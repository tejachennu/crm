const IGReels = require('../models/IGReels');
const Users = require('../models/User');
const axios = require('axios');

exports.createReel = async (req, res) => {
  try {
    const reel = await IGReels.create(req.body);
    res.status(201).json({ success: true, data: reel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating reel', error: error.message });
  }
};

exports.getReelByReelId = async (req, res) => {
  try {
    const { reelId } = req.params;
    const reel = await IGReels.findOne({ where: { reelId } });
    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }
    res.status(200).json({ success: true, data: reel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching reel', error: error.message });
  }
};

exports.getAllReelsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid pagination parameters' });
    }

    const offset = (pageNumber - 1) * limitNumber;

    const { rows: reels, count: totalReels } = await IGReels.findAndCountAll({
      where: { userId, type: 'REELS_VIDEO' },
      limit: limitNumber,
      offset: offset,
    });

    res.status(200).json({
      success: true,
      data: reels,
      meta: {
        totalReels,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalReels / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error('Error fetching reels:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching reels', error: error.message });
  }
};

const createReelServer = async (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input: data must be an object.');
    }
    const reel = await IGReels.create(data);
    return { success: true, data: reel };
  } catch (error) {
    console.error(`Error in createReelServer: ${error.message}`, error);
    if (error.name === 'SequelizeValidationError') {
      return { success: false, error: 'Validation error: ' + error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: error.message };
  }
};

exports.getReelsOfPrevious2DaysIg = async () => {
  try {
    console.log("Starting process to fetch reels of the previous 2 days...");
    await processReels();
    console.log("Completed fetching reels.");
  } catch (error) {
    console.error("Error fetching reels:", error.stack || error);
  }
};

const processReels = async () => {
  const baseUrl = "https://app.metricool.com/api/v2/analytics/reels/instagram";
  const headers = {
    Accept: "application/json",
    "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  };
  const platformId = 2;

  const accounts = await getAccounts();
  
  for (const account of accounts) {
    const currentDate = new Date();
    // Calculate dynamic dates
    const twoDaysAgo = new Date(currentDate);
    twoDaysAgo.setDate(currentDate.getDate() - 6);
 
    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };
    const params = {
      from: formatDateTime(twoDaysAgo),
      to: formatDateTime(currentDate),
      blogId: account.blogId,
    };
 
    try {
      const response = await axios.get(baseUrl, { params, headers });
      const posts = response.data.data || [];
      
      // Filter only reels
      const reels = posts.filter(post => post.type === 'REELS_VIDEO');
      
      for (const reel of reels) {
        await processSingleReel(reel, account, platformId);
      }
    } catch (error) {
      console.error(`Error processing account ${account.blogId}:`, error);
    }
  }
};

const processSingleReel = async (reel, account, platformId) => {
  try {
    const existingReel = await IGReels.findOne({ where: { reelId: reel.reelId } });

    if (existingReel) {
      console.log(`Reel ${reel.reelId} already exists`);
      return;
    }

    const reelData = {
      platformId,
      userId: account.id,
      businessId: reel.businessId,
      reelId: reel.reelId,
      publishedAt: reel.publishedAt.dateTime,
      timezone: reel.publishedAt.timezone,
      type: reel.type,
      url: reel.url,
      content: reel.content,
      imageUrl: reel.imageUrl,
      filter: reel.filter,
      likes: reel.likes || 0,
      comments: reel.comments || 0,
      interactions: reel.interactions || 0,
      engagement: reel.engagement || 0.0,
      impressions: reel.impressions || 0,
      reach: reel.reach || 0,
      saved: reel.saved || 0,
      shares: reel.shares || 0,
      videoViews: reel.videoViews || 0,
      impressionsTotal: reel.impressionsTotal || 0,
      videoViewsTotal: reel.videoViewsTotal || 0,
    };

    const result = await createReelServer(reelData);
    console.log(`Reel processed: ${result.success ? 'Success' : 'Failure'}`);
  } catch (error) {
    console.error(`Error processing reel:`, error);
  }
};

const formatDateTime = (date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const getAccounts = async () => {
  try {
    const accounts = await Users.findAll();
    return accounts.map(account => account.dataValues);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};
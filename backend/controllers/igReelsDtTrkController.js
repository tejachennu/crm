const IGReelsDtTrk = require('../models/IGReelsDtTrk');
const IGReels = require('../models/IGReels');
const axios = require('axios');

exports.createData = async (req, res) => {
  try {
    const data = await IGReelsDtTrk.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating data', error: error.message });
  }
};

exports.getDataByReelId = async (req, res) => {
  try {
    const { reelId } = req.params;
    const data = await IGReelsDtTrk.findAll({ where: { reelId } });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching data', error: error.message });
  }
};

exports.addReel14RecordIG = async () => {
  try {
    console.log('Starting process to fetch Instagram reels of the previous 14 days...');
    await processReels();
    console.log('Completed fetching reels.');
  } catch (error) {
    console.error('Error fetching reels:', error.stack || error);
  }
};

const processReels = async () => {
  const baseUrl = "https://app.metricool.com/api/v2/analytics/posts/instagram";
  const headers = {
    Accept: "application/json",
    "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  };

  const accounts = await getAccounts();
  
  for (const account of accounts) {
    const currentDate = new Date();
    const past14DaysAgo = new Date(currentDate);
    past14DaysAgo.setDate(currentDate.getDate() - 14);

    const params = {
      from: formatDateTime(past14DaysAgo),
      to: formatDateTime(currentDate),
      blogId: account.blogId,
    };

    try {
      const response = await axios.get(baseUrl, { params, headers });
      const posts = response.data.data || [];
      
      // Filter only reels
      const reels = posts.filter(post => post.type === 'REELS_VIDEO');
      
      for (const reel of reels) {
        await processSingleReelTracking(reel, account);
      }
    } catch (error) {
      console.error(`Error processing account ${account.blogId}:`, error);
    }
  }
};

const processSingleReelTracking = async (reel, account) => {
  try {
    const existingTrackedData = await IGReelsDtTrk.findAll({ 
      where: { reelId: reel.reelId },
      order: [['trackDate', 'DESC']]
    });

    if (existingTrackedData.length >= 14) {
      console.log(`Reel ${reel.reelId} already has 14 days of tracking`);
      return;
    }

    const currentDate = new Date();
    const reelCreationDate = new Date(reel.publishedAt.dateTime);

    if ((currentDate - reelCreationDate) / (1000 * 60 * 60 * 24) > 14) {
      console.log(`Reel ${reel.reelId} is older than 14 days`);
      return;
    }

    const previousRecord = existingTrackedData[0];
    let dailyData = { ...reel };

    if (previousRecord) {
      const previousData = previousRecord.dataValues;
      dailyData = calculateDailyDifference(reel, previousData);
    }

    await IGReelsDtTrk.create({
      reelId: reel.reelId,
      trackDate: currentDate,
      ...dailyData
    });

    console.log(`Daily tracking added for reel ${reel.reelId}`);
  } catch (error) {
    console.error(`Error processing reel tracking:`, error);
  }
};

const calculateDailyDifference = (current, previous) => {
  return {
    likes: Math.max(0, (current.likes || 0) - (previous.likes || 0)),
    comments: Math.max(0, (current.comments || 0) - (previous.comments || 0)),
    interactions: Math.max(0, (current.interactions || 0) - (previous.interactions || 0)),
    engagement: Math.max(0, (current.engagement || 0) - (previous.engagement || 0)),
    impressions: Math.max(0, (current.impressions || 0) - (previous.impressions || 0)),
    reach: Math.max(0, (current.reach || 0) - (previous.reach || 0)),
    saved: Math.max(0, (current.saved || 0) - (previous.saved || 0)),
    shares: Math.max(0, (current.shares || 0) - (previous.shares || 0)),
    videoViews: Math.max(0, (current.videoViews || 0) - (previous.videoViews || 0)),
    impressionsTotal: Math.max(0, (current.impressionsTotal || 0) - (previous.impressionsTotal || 0)),
    videoViewsTotal: Math.max(0, (current.videoViewsTotal || 0) - (previous.videoViewsTotal || 0)),
  };
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
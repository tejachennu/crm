const IgDtTrk = require('../models/IGDtTrk');
const axios = require('axios');
const Users = require('../models/User');
const IgPosts = require('../models/IGPosts ');

// Create a new IgDtTrk entry
exports.createData = async (req, res) => {
  try {
    const data = await IgDtTrk.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating data', error: error.message });
  }
};

// Get data by postId
exports.getDataByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const data = await IgDtTrk.findAll({ where: { postId } });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching data', error: error.message });
  }
};

// Get all data
exports.getAllData = async (req, res) => {
  try {
    const data = await IgDtTrk.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching all data', error: error.message });
  }
};

// Helper function to fetch accounts
const getAccounts = async () => {
  try {
    const accounts = await Users.findAll();
    const accountDetails = accounts.map((account) => account.dataValues);
    console.log('Fetched account details:', accountDetails);
    return accountDetails;
  } catch (error) {
    console.error('Error fetching account details:', error);
    throw new Error('Failed to fetch accounts');
  }
};

// Fetch posts from the last 14 days
exports.addPost14RecordIG = async () => {
  try {
    console.log('Starting process to fetch Instagram posts of the previous 14 days...');
    await processPosts();
    console.log('Completed fetching posts.');
  } catch (error) {
    console.error('Error fetching posts of the previous 14 days:', error.stack || error);
  }
};

const BASE_URL = 'https://app.metricool.com/api/v2/analytics/posts/instagram';
const HEADERS = {
  Accept: 'application/json',
  'X-Mc-Auth': "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
};

const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const processPosts = async () => {
  const accounts = await getAccounts();
  const fetchPromises = accounts.map(async (account) => {
    const currentDate = new Date();
    const past14DaysAgo = new Date(currentDate);
    past14DaysAgo.setDate(currentDate.getDate() - 14);

    const params = {
      from: formatDateTime(past14DaysAgo),
      to: formatDateTime(currentDate),
      blogId: account.blogId,
    };

    try {
      console.log(
        `Fetching Instagram posts for blogId: ${account.blogId} from ${params.from} to ${params.to}`
      );
      const response = await axios.get(BASE_URL, { params, headers: HEADERS });
      const posts = response.data.data || [];

      console.log(`Fetched ${posts.length} posts for blogId: ${account.blogId}`);

      await Promise.all(posts.map((post) => processSinglePost(post, account)));
    } catch (error) {
      console.error(
        `Error fetching posts for blogId: ${account.blogId}`,
        error.stack || error
      );
    }
  });

  await Promise.all(fetchPromises);
  console.log('All accounts processed.');
};

const processSinglePost = async (post, account) => {
  try {
    const currentDate = new Date(); // Declare and initialize `currentDate` once at the start.

    let existingPost = await IgDtTrk.findOne({ where: { postId: post.postId } });

    if (!existingPost) {
      // Create a new post if it doesn't exist
      existingPost = await IgDtTrk.create({
        postId: post.postId,
        userId: post.userId,
        trackDate: currentDate,
        likes: post.likes || 0,
        comments: post.comments || 0,
        interactions: post.interactions || 0,
        engagement: post.engagement || 0.0,
        impressions: post.impressions || 0,
        reach: post.reach || 0,
        saved: post.saved || 0,
        videoViews: post.videoViews || 0,
        impressionsTotal: post.impressionsTotal || 0,
        videoViewsTotal: post.videoViewsTotal || 0,
      });
      console.log(`New Instagram post created: ${post.postId}`);
      return;
    }

    const existingTrackedData = await IgDtTrk.findAll({ 
      where: { postId: post.postId },
      order: [['trackDate', 'DESC']]
    });

    if (existingTrackedData.length >= 14) {
      console.log(
        `Instagram post with postId: ${post.postId} already has 14 records for businessId: ${account.businessId}`
      );
      return; // Exit if the post has already been tracked for 14 days
    }

    const postCreationDate = new Date(post.publishedAt.dateTime);

    if ((currentDate - postCreationDate) / (1000 * 60 * 60 * 24) > 14) {
      console.log(
        `Skipping Instagram postId: ${post.postId} as it is older than 14 days.`
      );
      return; // Skip posts older than 14 days
    }

    const previousPostRecord = await IgDtTrk.findOne({
      where: { postId: post.postId },
      order: [['trackDate', 'DESC']],
    });

    let todaysData = { ...post };

    if (previousPostRecord) {
      const previousData = previousPostRecord.dataValues;
      todaysData.likes -= previousData.likes || 0;
      todaysData.comments -= previousData.comments || 0;
      todaysData.interactions -= previousData.interactions || 0;
      todaysData.engagement -= previousData.engagement || 0.0;
      todaysData.impressions -= previousData.impressions || 0;
      todaysData.reach -= previousData.reach || 0;
      todaysData.saved -= previousData.saved || 0;
      todaysData.videoViews -= previousData.videoViews || 0;
      todaysData.impressionsTotal -= previousData.impressionsTotal || 0;
      todaysData.videoViewsTotal -= previousData.videoViewsTotal || 0;
    }

    const postData = {
      postId: post.postId,
      trackDate: currentDate,
      likes: Math.max(0, todaysData.likes || 0),
      comments: Math.max(0, todaysData.comments || 0),
      interactions: Math.max(0, todaysData.interactions || 0),
      engagement: Math.max(0, todaysData.engagement || 0.0),
      impressions: Math.max(0, todaysData.impressions || 0),
      reach: Math.max(0, todaysData.reach || 0),
      saved: Math.max(0, todaysData.saved || 0),
      videoViews: Math.max(0, todaysData.videoViews || 0),
      impressionsTotal: Math.max(0, todaysData.impressionsTotal || 0),
      videoViewsTotal: Math.max(0, todaysData.videoViewsTotal || 0),
      userId: post.userId || '',
      businessId: post.businessId || '',
      type: post.type || '',
      filter: post.filter || '',
      url: post.url || '',
      content: post.content || '',
      imageUrl: post.imageUrl || '',
    };

    // Save the calculated data
    const result = await IgDtTrk.create(postData);
    console.log(
      `Instagram post daily change added for businessId: ${account.businessId}, postId: ${
        post.postId
      }, result: ${result ? "Success" : "Failure"}`
    );

    // Update the existing post's updatedAt timestamp
    await existingPost.update({ updatedAt: new Date() });

  } catch (error) {
    console.error(
      `Error processing Instagram postId: ${post.postId} for businessId: ${account.businessId}`,
      error.stack || error
    );
  }
};
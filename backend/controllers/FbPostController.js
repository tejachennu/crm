const FbPosts = require('../models/FbPosts');
const FbPDtTrk = require('../models/FbPDtTrk');
const Users = require('../models/User');
const axios = require('axios');
const bcrypt = require('bcrypt');


// Create a new FbPost entry
exports.createPost = async (req, res) => {
  try {
    const post = await FbPosts.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating post', error: error.message });
  }
};

const createPostServer = async (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input: data must be an object.');
    }
    const post = await FbPosts.create(data);
    return { success: true, data: post };
  } catch (error) {
    console.error(`Error in createPostServer: ${error.message}`, error);
    if (error.name === 'SequelizeValidationError') {
      return { success: false, error: 'Validation error: ' + error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: error.message };
  }
};


// Get post by postId
exports.getPostByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await FbPosts.findOne({ where: { postId } });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching post', error: error.message });
  }
};


// Get all posts filtered by userId and platformId
exports.getAllPostsByUserAndPlatform = async (req, res) => {
  try {
    const { userId, platformId } = req.query;
    const filters = {};

    if (userId) filters.userId = userId;
    if (platformId) filters.platformId = platformId;

    const posts = await FbPosts.findAll({ where: filters });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching posts', error: error.message });
  }
};


// Function to fetch posts from the last 2 days
exports.getPostsOfPrevious2Days = async () => {
  try {
    console.log("Starting process to fetch posts of the previous 2 days...");
    await processPosts();
    console.log("Completed fetching posts.");
  } catch (error) {
    console.error(
      "Error fetching posts of the previous 2 days:",
      error.stack || error
    );
  }
};

const getAccounts = async () => {
  try {
    const accounts = await Users.findAll();
    const accountDetails = accounts.map((account) => account.dataValues);
    console.log("Fetched account details:", accountDetails);
    return accountDetails;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw new Error("Failed to fetch accounts");
  }
};


const processPosts = async () => {
  const baseUrl = "https://app.metricool.com/api/v2/analytics/posts/facebook";
  const headers = {
    Accept: "application/json",
    "X-Mc-Auth":
      "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  };
  const platformId = 1;

  const accounts = await getAccounts();
  const fetchPromises = accounts.map(async (account) => {
    // Calculate dynamic dates
    const currentDate = new Date();
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
      console.log(
        `Fetching posts for blogId: ${account.blogId} from ${params.from} to ${params.to}`
      );
      const response = await axios.get(baseUrl, { params, headers });
      console.log(response.data.data);
      const posts = response.data.data || [];

      console.log(
        `Fetched ${posts.length} posts for blogId: ${account.blogId}`
      );

      // Process all posts concurrently
      await Promise.all(posts.map((post) => processSinglePost(post, account , platformId)));
    } catch (error) {
      console.error(
        `Error fetching or processing blogId: ${account.blogId}`,
        error.stack || error
      );
    }
  });

  await Promise.all(fetchPromises);
  console.log("All accounts processed.");
};

// Process a single post and save it to the database
const processSinglePost = async (post, account , platformId) => {
  try {
    // Check if the post already exists in the database
    const getPost = await FbPosts.findAll({ where: { postId: post.postId } });

    // If the post already exists (length > 0), do not process it again
    if (getPost.length > 0) {
      console.log(
        `Post with postId: ${post.postId} already exists for blogId: ${account.blogId}`
      );
      return; // Exit the function if the post already exists
    }

    // Prepare the data for the new post
    const postData = {
      platformId: platformId,
      userId: account.id,
      blogId: account.blogId,
      pageId: post.pageId,
      postId: post.postId,
      created: post.created?.dateTime || null,
      timezone: post.created?.timezone || null,
      link: post.link || "",
      text: post.text || "",
      type: post.type || "unknown",
      shares: post.shares || 0,
      comments: post.comments || 0,
      reactions: post.reactions || 0,
      impressions: post.impressions || 0,
      impressionsPaid: post.impressionsPaid || 0,
      impressionsOrganic: post.impressionsOrganic || 0,
      impressionsUnique: post.impressionsUnique || 0,
      impressionsUniquePaid: post.impressionsUniquePaid || 0,
      impressionsUniqueOrganic: post.impressionsUniqueOrganic || 0,
      clicks: post.clicks || 0,
      engagement: post.engagement || 0.0,
      picture: post.picture || "",
      videoViews: post.videoViews || 0,
      videoViewsPaid: post.videoViewsPaid || 0,
      videoViewsOrganic: post.videoViewsOrganic || 0,
      videoTimeWatched: post.videoTimeWatched || 0,
      linkClicks: post.linkclicks || 0,
      spend: post.spend || 0.0,
      internalSearchId: post.internalSearchId || "",
    };

    // Save the post to the database
    const result = await createPostServer(postData);
    console.log(
      `Post added for blogId: ${account.blogId}, postId: ${
        post.postId
      }, result: ${result.success ? "Success" : "Failure"}`
    );
  } catch (error) {
    console.error(
      `Error processing postId: ${post.postId} for blogId: ${account.blogId}`,
      error.stack || error
    );
  }
};


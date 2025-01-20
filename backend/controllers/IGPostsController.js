const IGPosts = require('../models/IGPosts ');

const IgPosts = require('../models/IGPosts ');
const Users = require('../models/User');
const axios = require('axios');

// Create a new IgPost entry
exports.createPost = async (req, res) => {
  try {
    const post = await IgPosts.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating post', error: error.message });
  }
};


exports.getAllPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page=1 and limit=10

    // Validate the userId
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    // Validate and parse pagination parameters
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid pagination parameters' });
    }

    // Calculate offset
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch posts by userId with pagination
    const { rows: posts, count: totalPosts } = await IGPosts.findAndCountAll({
      where: { userId }, // Proper Sequelize query syntax
      limit: limitNumber,
      offset: offset,
    });

    res.status(200).json({
      success: true,
      data: posts,
      meta: {
        totalPosts,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalPosts / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching posts', error: error.message });
  }
};



const createPostServer = async (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input: data must be an object.');
    }
    const post = await IgPosts.create(data);
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
    const post = await IgPosts.findOne({ where: { postId } });
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

    const posts = await IgPosts.findAll({ where: filters });

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

exports.processPosts = async () => {
  const baseUrl = "https://app.metricool.com/api/v2/analytics/posts/instagram";
  const headers = {
    Accept: "application/json",
    "X-Mc-Auth":
      "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  };
  const platformId = 2;

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
const processSinglePost = async (post, account, platformId) => {
  try {
    const existingPost = await IgPosts.findOne({ where: { postId: post.postId } });

    if (existingPost) {
      console.log(`Post with postId: ${post.postId} already exists for businessId: ${post.businessId}`);
      return;
    }

    const postData = {
      platformId,
      userId: account.id,
      businessId: post.businessId,
      postId: post.postId,
      publishedAt: post.publishedAt.dateTime,
      timezone: post.publishedAt.timezone,
      type: post.type,
      url: post.url,
      content: post.content,
      imageUrl: post.imageUrl,
      filter: post.filter,
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
    };

    const result = await createPostServer(postData);
    console.log(
      `Post added for businessId: ${post.businessId}, postId: ${post.postId}, result: ${result.success ? "Success" : "Failure"}`
    );
  } catch (error) {
    console.error(`
      Error processing postId: ${post.postId} for businessId: ${post.businessId},
      error.stack || error`
    );
  }
};


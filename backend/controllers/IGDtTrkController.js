const IgDtTrk = require("../models/IGDtTrk");
const axios = require("axios");
const Users = require("../models/User");
const IgPosts = require("../models/IGPosts ");
const { Op } = require("sequelize");

// Create a new IgDtTrk entry
exports.createData = async (req, res) => {
  try {
    const data = await IgDtTrk.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating data",
        error: error.message,
      });
  }
};

// Get data by postId
exports.getDataByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const data = await IgDtTrk.findAll({ where: { postId } });
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching data",
        error: error.message,
      });
  }
};

// Get all data
exports.getAllData = async (req, res) => {
  try {
    const data = await IgDtTrk.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching all data",
        error: error.message,
      });
  }
};

// Helper function to fetch accounts
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

// Fetch posts from the last 14 days
exports.addPost14RecordIG = async () => {
  try {
    console.log(
      "Starting process to fetch Instagram posts of the previous 14 days..."
    );
    await processPosts();
    console.log("Completed fetching posts.");
  } catch (error) {
    console.error(
      "Error fetching posts of the previous 14 days:",
      error.stack || error
    );
  }
};

const BASE_URL = "https://app.metricool.com/api/v2/analytics/posts/instagram";
const HEADERS = {
  Accept: "application/json",
  "X-Mc-Auth":
    "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
};

const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
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

      console.log(
        `Fetched ${posts.length} posts for blogId: ${account.blogId}`
      );

      await Promise.all(posts.map((post) => processSinglePost(post, account)));
    } catch (error) {
      console.error(
        `Error fetching posts for blogId: ${account.blogId}`,
        error.stack || error
      );
    }
  });

  await Promise.all(fetchPromises);
  console.log("All accounts processed.");
};


const processSinglePost = async (post, account) => {
  try {
    const currentDate = new Date();
    const formattedTrackDate = currentDate.toISOString().split("T")[0]; // Extract just the date

    const existingRecord = await IgDtTrk.findOne({
      where: {
        postId: post.postId,
        trackDate: {
          [Op.eq]: formattedTrackDate, // Ensure we're looking for the same day
        },
      },
    });

    if (existingRecord) {
      console.log(
        `Record already exists for postId: ${post.postId} on date: ${formattedTrackDate}`
      );
      return; // Exit to prevent duplicate entry
    }

    // Fetch all previous tracked data for the current post
    const previousRecords = await IgDtTrk.findAll({
      where: { postId: post.postId },
      order: [["trackDate", "ASC"]],
    });

    // Calculate cumulative data
    const cumulativeData = previousRecords.reduce(
      (sum, record) => {
        return {
          likes: sum.likes + (record.likes || 0),
          comments: sum.comments + (record.comments || 0),
          interactions: sum.interactions + (record.interactions || 0),
          engagement: sum.engagement + (record.engagement || 0),
          impressions: sum.impressions + (record.impressions || 0),
          reach: sum.reach + (record.reach || 0),
          saved: sum.saved + (record.saved || 0),
          videoViews: sum.videoViews + (record.videoViews || 0),
          impressionsTotal:
            sum.impressionsTotal + (record.impressionsTotal || 0),
          videoViewsTotal: sum.videoViewsTotal + (record.videoViewsTotal || 0),
        };
      },
      {
        likes: 0,
        comments: 0,
        interactions: 0,
        engagement: 0.0,
        impressions: 0,
        reach: 0,
        saved: 0,
        videoViews: 0,
        impressionsTotal: 0,
        videoViewsTotal: 0,
      }
    );

    // Calculate today's data by subtracting cumulative data from the post's current data
    const todaysData = {
      likes: Math.max(0, (post.likes || 0) - cumulativeData.likes),
      comments: Math.max(0, (post.comments || 0) - cumulativeData.comments),
      interactions: Math.max(
        0,
        (post.interactions || 0) - cumulativeData.interactions
      ),
      engagement: Math.max(
        0,
        (post.engagement || 0) - cumulativeData.engagement
      ),
      impressions: Math.max(
        0,
        (post.impressions || 0) - cumulativeData.impressions
      ),
      reach: Math.max(0, (post.reach || 0) - cumulativeData.reach),
      saved: Math.max(0, (post.saved || 0) - cumulativeData.saved),
      videoViews: Math.max(
        0,
        (post.videoViews || 0) - cumulativeData.videoViews
      ),
      impressionsTotal: Math.max(
        0,
        (post.impressionsTotal || 0) - cumulativeData.impressionsTotal
      ),
      videoViewsTotal: Math.max(
        0,
        (post.videoViewsTotal || 0) - cumulativeData.videoViewsTotal
      ),
    };

    // Add a record for today
    const postData = {
      postId: post.postId,
      trackDate: currentDate,
      likes: todaysData.likes,
      comments: todaysData.comments,
      interactions: todaysData.interactions,
      engagement: todaysData.engagement,
      impressions: todaysData.impressions,
      reach: todaysData.reach,
      saved: todaysData.saved,
      videoViews: todaysData.videoViews,
      impressionsTotal: todaysData.impressionsTotal,
      videoViewsTotal: todaysData.videoViewsTotal,
      userId: post.userId || "",
      businessId: post.businessId || "",
      type: post.type || "",
      filter: post.filter || "",
      url: post.url || "",
      content: post.content || "",
      imageUrl: post.imageUrl || "",
    };

    // Save the new record
    await IgDtTrk.create(postData);
    console.log(
      `New record added for postId: ${post.postId}`
    );
  } catch (error) {
    console.error(
      `Error processing Instagram postId: ${post.postId} for businessId: ${account.businessId}`,
      error.stack || error
    );
  }
};

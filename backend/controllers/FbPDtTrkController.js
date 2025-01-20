const FbPDtTrk = require("../models/FbPDtTrk");
const axios = require("axios");
const Users = require("../models/User");
const FbPosts = require("../models/FbPosts");

// Create a new FbPDtTrk entry
exports.createData = async (req, res) => {
  try {
    const data = await FbPDtTrk.create(req.body);
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
    const data = await FbPDtTrk.findAll({ where: { postId } });
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

exports.getAllData = async (req, res) => {
  try {
    const data = await FbPDtTrk.findAll();
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

// Function to fetch posts from the last 2 days
exports.addPost14Records = async () => {
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

const BASE_URL = "https://app.metricool.com/api/v2/analytics/posts/facebook";
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
  const accounts = await getAccounts(); // Fetch accounts dynamically
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
        `Fetching posts for blogId: ${account.blogId} from ${params.from} to ${params.to}`
      );
      const response = await axios.get(BASE_URL, { params, headers: HEADERS });
      const posts = response.data.data || [];

      console.log(
        `Fetched ${posts.length} posts for blogId: ${account.blogId}`
      );

      // Process all posts concurrently
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
    const currentDate = new Date(); // Declare and initialize `currentDate` once at the start.

    let existingPost = await FbPDtTrk.findOne({
      where: { postId: post.postId },
    });

    if (!existingPost) {
      // Create a new post if it doesn't exist
      existingPost = await FbPDtTrk.create({
        postId: post.postId,
        trackDate: currentDate,
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
        videoViews: post.videoViews || 0,
        videoViewsPaid: post.videoViewsPaid || 0,
        videoViewsOrganic: post.videoViewsOrganic || 0,
        videoTimeWatched: post.videoTimeWatched || 0,
        linkClicks: post.linkClicks || 0,
        spend: post.spend || 0.0,
        internalSearchId: post.internalSearchId || "",
      });
      console.log(`New Facebook post created: ${post.postId}`);
      return;
    }

    const existingTrackedData = await FbPDtTrk.findAll({
      where: { postId: post.postId },
      order: [["trackDate", "DESC"]],
    });

    if (existingTrackedData.length >= 14) {
      console.log(
        `Facebook post with postId: ${post.postId} already has 14 records for blogId: ${account.blogId}`
      );
      return; // Exit if the post has already been tracked for 14 days
    }

    const postCreationDate = new Date(post.created.dateTime);

    if ((currentDate - postCreationDate) / (1000 * 60 * 60 * 24) > 14) {
      console.log(
        `Skipping Facebook postId: ${post.postId} as it is older than 14 days.`
      );
      return; // Skip posts older than 14 days
    }

    // Calculate the sum of all previous records
    const previousData = existingTrackedData.reduce((acc, record) => {
      Object.keys(record.dataValues).forEach((key) => {
        if (typeof record[key] === "number") {
          acc[key] = (acc[key] || 0) + record[key];
        }
      });
      return acc;
    }, {});

    // Calculate today's data by subtracting the sum of all previous records from the current data
    let todaysData = { ...post };

    const numericFields = [
      "shares",
      "comments",
      "reactions",
      "impressions",
      "impressionsPaid",
      "impressionsOrganic",
      "impressionsUnique",
      "impressionsUniquePaid",
      "impressionsUniqueOrganic",
      "clicks",
      "videoViews",
      "videoViewsPaid",
      "videoViewsOrganic",
      "videoTimeWatched",
      "linkClicks",
    ];

    numericFields.forEach((field) => {
      todaysData[field] = Math.max(
        0,
        (todaysData[field] || 0) - (previousData[field] || 0)
      );
    });

    // Handle engagement and spend separately as they might be percentages or currency
    todaysData.engagement = Math.max(
      0,
      (todaysData.engagement || 0) - (previousData.engagement || 0)
    );
    todaysData.spend = Math.max(
      0,
      (todaysData.spend || 0) - (previousData.spend || 0)
    );

    const postData = {
      postId: post.postId,
      trackDate: currentDate,
      shares: todaysData.shares || 0,
      comments: todaysData.comments || 0,
      reactions: todaysData.reactions || 0,
      impressions: todaysData.impressions || 0,
      impressionsPaid: todaysData.impressionsPaid || 0,
      impressionsOrganic: todaysData.impressionsOrganic || 0,
      impressionsUnique: todaysData.impressionsUnique || 0,
      impressionsUniquePaid: todaysData.impressionsUniquePaid || 0,
      impressionsUniqueOrganic: todaysData.impressionsUniqueOrganic || 0,
      clicks: todaysData.clicks || 0,
      engagement: todaysData.engagement || 0.0,
      videoViews: todaysData.videoViews || 0,
      videoViewsPaid: todaysData.videoViewsPaid || 0,
      videoViewsOrganic: todaysData.videoViewsOrganic || 0,
      videoTimeWatched: todaysData.videoTimeWatched || 0,
      linkClicks: todaysData.linkClicks || 0,
      spend: todaysData.spend || 0.0,
      internalSearchId: post.internalSearchId || "",
    };

    // Save the calculated data
    const result = await FbPDtTrk.create(postData);
    console.log(
      `Facebook post daily change added for blogId: ${account.blogId}, postId: ${post.postId}, result: ${result ? "Success" : "Failure"}`
    );

    // Update the existing post's updatedAt timestamp
    await existingPost.update({ updatedAt: new Date() });
  } catch (error) {
    console.error(
      `Error processing Facebook postId: ${post.postId} for blogId: ${account.blogId}`,
      error.stack || error
    );
  }
};

const FbPosts = require('../models/FbPosts');
const IgPosts = require('../models/IGPosts ');
const Users = require('../models/User');
const axios = require('axios');

const apis = [
  {
    platformId: 1,
    name: "facebook",
    url: "https://app.metricool.com/api/v2/analytics/posts/facebook",
    model: FbPosts,
  },
  {
    platformId: 2,
    name: "instagram",
    url: "https://app.metricool.com/api/v2/analytics/posts/instagram",
    model: IgPosts,
  },
  {
    platformId: 1,
    name: "facebook Reels",
    url: "https://app.metricool.com/api/v2/analytics/reels/facebook",
    model: FbReels,
  },
  {
    platformId: 2,
    name: "instagram Reels",
    url: "https://app.metricool.com/api/v2/analytics/reels/instagram",
    model: IgReels,
  },
];

const headers = {
  Accept: "application/json",
  "X-Mc-Auth":
    "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
};

// Fetch user and their platform data dynamically from `apis`
const getUserData = async (userId) => {
  try {
    const user = await Users.findOne({ where: { id: userId } });
    console.log(user,"user")

    if (!user) {
      throw new Error("User not found");
    }

    let userPlatforms = user.platform
    ? user.platform.split(",").map((platform) => platform.trim())
    : [];
  
  // Add "instagram Reels" if "instagram" exists in userPlatforms
  if (userPlatforms.includes("instagram")) {
    userPlatforms.push("instagram Reels");
  }
  
  // Add "instagram Reels" if "instagram" exists in userPlatforms
  if (userPlatforms.includes("facebook")) {
    userPlatforms.push("facebook Reels");
  }
    console.log(userPlatforms,"platforms")

    if (userPlatforms.length === 0) {
      throw new Error("No platforms linked to this user");
    }

    // Match user platforms with defined APIs
    const validPlatforms = apis.filter((api) =>
      userPlatforms.includes(api.name)
    );

    console.log(validPlatforms,"validPlatforms")


    if (validPlatforms.length === 0) {
      throw new Error("No valid platforms found for this user");
    }

    // Return valid platforms with additional user-specific data
    return validPlatforms.map((platform) => ({
      ...platform,
      blogId: user.blogId, // Assume `blogId` is part of the user record
    }));
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

// Process posts for all user platforms
exports.processPostsuser = async (userId) => {
  try {
    const userPlatforms = await getUserData(userId);
    const currentDate = new Date();
    const threeYearsAgo = new Date(currentDate);
    threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const from = formatDateTime(threeYearsAgo);
    const to = formatDateTime(currentDate);

    // Fetch and process posts for each platform
    const fetchPromises = userPlatforms.map(async (platform) => {
      try {
        console.log(`Fetching posts for platform: ${platform.name}, blogId: ${platform.blogId}`);
        const response = await axios.get(platform.url, {
          params: { from, to, blogId: platform.blogId },
          headers,
        });

        const posts = response.data.data || [];
        console.log(`Fetched ${posts.length} posts for platform: ${platform.name}`);

        await Promise.all(
          posts.map((post) => processSinglePost(post, platform.blogId, platform.platformId, platform.model ,userId))
        );
      } catch (error) {
        console.error(
          `Error fetching posts for platform: ${platform.name}, blogId: ${platform.blogId}`,
          error.message
        );
      }
    });

    await Promise.all(fetchPromises);
    console.log("All platforms processed successfully.");
  } catch (error) {
    console.error("Error processing posts:", error.message);
  }
};

// Process a single post and save it to the database
const processSinglePost = async (post, blogId, platformId, model , userId) => {
  try {
    // Check if the post already exists in the database
    const existingPost = await model.findOne({ where: { postId: post.postId } });

    if (existingPost) {
      return; // Post already exists, skip processing
    }

    // Construct postData dynamically based on the platform
    const postData = platformId === 1
      ? {
          platformId,
          userId,
          blogId,
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
        }
      : {
          platformId,
          blogId,
          userId,
          postId: post.postId,
          businessId: post.businessId,
          publishedAt: post.publishedAt?.dateTime || null,
          timezone: post.publishedAt?.timezone || null,
          type: post.type || "unknown",
          url: post.url || "",
          content: post.content || "",
          imageUrl: post.imageUrl || "",
          filter: post.filter || "",
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

    // Save the post to the database
    await model.create(postData);
    console.log(`Post added for blogId: ${blogId}, postId: ${post.postId}`);
  } catch (error) {
    console.error(`Error processing postId: ${post.postId}`, error.message);
  }
};

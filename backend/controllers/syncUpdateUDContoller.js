const FbPosts = require('../models/FbPosts');
const IgPosts = require('../models/IGPosts ');
const Users = require('../models/User');
const FbReels = require('../models/FBReels');
const IgReels = require('../models/IGReels');
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
    model: FbReels ,
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
  "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
};

// Fetch user and their platform data dynamically from `apis`
const getUserData = async (userId) => {
  try {
    const user = await Users.findOne({ where: { id: userId } });
    console.log(user, "user");

    if (!user) {
      throw new Error("User not found");
    }

    const userPlatforms = user.platform
      ? user.platform.split(",").map((platform) => platform.trim())
      : [];

    console.log(userPlatforms, "platforms");

    if (userPlatforms.length === 0) {
      throw new Error("No platforms linked to this user");
    }

    const validPlatforms = apis.filter((api) =>
      userPlatforms.includes(api.name)
    );

    console.log(validPlatforms, "validPlatforms");

    if (validPlatforms.length === 0) {
      throw new Error("No valid platforms found for this user");
    }

    return validPlatforms.map((platform) => ({
      ...platform,
      blogId: user.blogId,
    }));
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

// Process posts for all user platforms with update functionality
exports.updateUserPosts = async (userId) => {
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

    // Fetch and update posts for each platform
    const updatePromises = userPlatforms.map(async (platform) => {
      try {
        console.log(`Updating posts for platform: ${platform.name}, blogId: ${platform.blogId}`);
        const response = await axios.get(platform.url, {
          params: { from, to, blogId: platform.blogId },
          headers,
        });

        const posts = response.data.data || [];
        console.log(`Fetched ${posts.length} posts for platform: ${platform.name}`);

        await Promise.all(
          posts.map((post) => updateSinglePost(post, platform.blogId, platform.platformId, platform.model, userId))
        );
      } catch (error) {
        console.error(
          `Error updating posts for platform: ${platform.name}, blogId: ${platform.blogId}`,
          error.message
        );
      }
    });

    await Promise.all(updatePromises);
    console.log("All platforms updated successfully.");
  } catch (error) {
    console.error("Error updating posts:", error.message);
  }
};

// Update a single post in the database
const updateSinglePost = async (post, blogId, platformId, model, userId) => {
  try {
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

    // Update or create the post in the database
    const [updatedPost, created] = await model.upsert(postData, {
      where: { postId: post.postId },
      returning: true,
    });

    console.log(
      `Post ${created ? 'created' : 'updated'} for blogId: ${blogId}, postId: ${post.postId}`
    );

    return updatedPost;
  } catch (error) {
    console.error(`Error updating postId: ${post.postId}`, error.message);
  }
};


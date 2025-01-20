// const FbPosts = require('../models/FbPosts');
// const IgPosts = require('../models/IGPosts ');
// const Users = require('../models/User');
// const FbReels = require('../models/FBReels');
// const IgReels = require('../models/IGReels');
// const axios = require('axios');

// const apis = [
//   {
//     platformId: 1,
//     name: "facebook",
//     url: "https://app.metricool.com/api/v2/analytics/posts/facebook",
//     model: FbPosts,
//   },
//   {
//     platformId: 2,
//     name: "instagram",
//     url: "https://app.metricool.com/api/v2/analytics/posts/instagram",
//     model: IgPosts,
//   },
//   {
//     platformId: 1,
//     name: "facebook Reels",
//     url: "https://app.metricool.com/api/v2/analytics/reels/facebook",
//     model: FbReels ,
//   },
//   {
//     platformId: 2,
//     name: "instagram Reels",
//     url: "https://app.metricool.com/api/v2/analytics/reels/instagram",
//     model: IgReels,
//   },

// ];

// const headers = {
//   Accept: "application/json",
//   "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
// };

// // Fetch user and their platform data dynamically from `apis`
// const getUserData = async (userId) => {
//   try {
//     const user = await Users.findOne({ where: { id: userId } });
//     console.log(user, "user");

//     if (!user) {
//       throw new Error("User not found");
//     }

//     const userPlatforms = user.platform
//       ? user.platform.split(",").map((platform) => platform.trim())
//       : [];

//     console.log(userPlatforms, "platforms");

//     if (userPlatforms.length === 0) {
//       throw new Error("No platforms linked to this user");
//     }

//     const validPlatforms = apis.filter((api) =>
//       userPlatforms.includes(api.name)
//     );

//     console.log(validPlatforms, "validPlatforms");

//     if (validPlatforms.length === 0) {
//       throw new Error("No valid platforms found for this user");
//     }

//     return validPlatforms.map((platform) => ({
//       ...platform,
//       blogId: user.blogId,
//     }));
//   } catch (error) {
//     console.error("Error fetching user data:", error.message);
//     throw error;
//   }
// };

// // Process posts for all user platforms with update functionality
// exports.updateUserPosts = async (userId) => {
//   try {
//     const userPlatforms = await getUserData(userId);
//     const currentDate = new Date();
//     const threeYearsAgo = new Date(currentDate);
//     threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

//     const formatDateTime = (date) => {
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       const hours = String(date.getHours()).padStart(2, "0");
//       const minutes = String(date.getMinutes()).padStart(2, "0");
//       const seconds = String(date.getSeconds()).padStart(2, "0");
//       return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//     };

//     const from = formatDateTime(threeYearsAgo);
//     const to = formatDateTime(currentDate);

//     // Fetch and update posts for each platform
//     const updatePromises = userPlatforms.map(async (platform) => {
//       try {
//         console.log(`Updating posts for platform: ${platform.name}, blogId: ${platform.blogId}`);
//         const response = await axios.get(platform.url, {
//           params: { from, to, blogId: platform.blogId },
//           headers,
//         });

//         const posts = response.data.data || [];
//         console.log(`Fetched ${posts.length} posts for platform: ${platform.name}`);

//         await Promise.all(
//           posts.map((post) => updateSinglePost(post, platform.blogId, platform.platformId, platform.model, userId))
//         );
//       } catch (error) {
//         console.error(
//           `Error updating posts for platform: ${platform.name}, blogId: ${platform.blogId}`,
//           error.message
//         );
//       }
//     });

//     await Promise.all(updatePromises);
//     console.log("All platforms updated successfully.");
//   } catch (error) {
//     console.error("Error updating posts:", error.message);
//   }
// };

// // Update a single post in the database
// const updateSinglePost = async (post, blogId, platformId, model, userId) => {
//   try {
//     // Construct postData dynamically based on the platform
//     const postData = platformId === 1
//       ? {
//           platformId,
//           userId,
//           blogId,
//           pageId: post.pageId,
//           postId: post.postId,
//           created: post.created?.dateTime || null,
//           timezone: post.created?.timezone || null,
//           link: post.link || "",
//           text: post.text || "",
//           type: post.type || "unknown",
//           shares: post.shares || 0,
//           comments: post.comments || 0,
//           reactions: post.reactions || 0,
//           impressions: post.impressions || 0,
//           impressionsPaid: post.impressionsPaid || 0,
//           impressionsOrganic: post.impressionsOrganic || 0,
//           impressionsUnique: post.impressionsUnique || 0,
//           impressionsUniquePaid: post.impressionsUniquePaid || 0,
//           impressionsUniqueOrganic: post.impressionsUniqueOrganic || 0,
//           clicks: post.clicks || 0,
//           engagement: post.engagement || 0.0,
//           picture: post.picture || "",
//           videoViews: post.videoViews || 0,
//           videoViewsPaid: post.videoViewsPaid || 0,
//           videoViewsOrganic: post.videoViewsOrganic || 0,
//           videoTimeWatched: post.videoTimeWatched || 0,
//           linkClicks: post.linkclicks || 0,
//           spend: post.spend || 0.0,
//           internalSearchId: post.internalSearchId || "",
//         }
//       : {
//           platformId,
//           blogId,
//           userId,
//           postId: post.postId,
//           businessId: post.businessId,
//           publishedAt: post.publishedAt?.dateTime || null,
//           timezone: post.publishedAt?.timezone || null,
//           type: post.type || "unknown",
//           url: post.url || "",
//           content: post.content || "",
//           imageUrl: post.imageUrl || "",
//           filter: post.filter || "",
//           likes: post.likes || 0,
//           comments: post.comments || 0,
//           interactions: post.interactions || 0,
//           engagement: post.engagement || 0.0,
//           impressions: post.impressions || 0,
//           reach: post.reach || 0,
//           saved: post.saved || 0,
//           videoViews: post.videoViews || 0,
//           impressionsTotal: post.impressionsTotal || 0,
//           videoViewsTotal: post.videoViewsTotal || 0,
//         };

//     // Update or create the post in the database
//     const [updatedPost, created] = await model.upsert(postData, {
//       where: { postId: post.postId },
//       returning: true,
//     });

//     console.log(
//       `Post ${created ? 'created' : 'updated'} for blogId: ${blogId}, postId: ${post.postId}`
//     );

//     return updatedPost;
//   } catch (error) {
//     console.error(`Error updating postId: ${post.postId}`, error.message);
//   }
// };


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
  "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
};

const getUserData = async (userId) => {
  try {
    const user = await Users.findOne({ where: { id: userId } });
    console.log(user, "user");

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

const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const processReelData = (reel, platformId) => {
  if (platformId === 1) { // Facebook
    return {
      platformId,
      pageId: reel.pageId,
      reelId: reel.reelId,
      created: reel.created?.dateTime,
      timezone: reel.created?.timezone,
      description: reel.description,
      videoUrl: reel.videoUrl,
      length: reel.length,
      thumbnailUrl: reel.thumbnailUrl,
      reelUrl: reel.reelUrl,
      blueReelsPlayCount: reel.blueReelsPlayCount || 0,
      postImpressionsUnique: reel.postImpressionsUnique || 0,
      postVideoAvgTimeWatchedSeconds: reel.postVideoAvgTimeWatchedSeconds || 0,
      postVideoViewTimeSeconds: reel.postVideoViewTimeSeconds || 0,
      postVideoReactions: reel.postVideoReactions || 0,
      postVideoSocialActions: reel.postVideoSocialActions || 0,
      engagement: reel.engagement || 0,
      reach: reel.reach || 0,
      comments: reel.comments || 0
    };
  } else { // Instagram
    return {
      platformId,
      businessId: reel.businessId,
      reelId: reel.reelId,
      publishedAt: reel.publishedAt?.dateTime,
      timezone: reel.publishedAt?.timezone,
      type: 'REELS_VIDEO',
      url: reel.url,
      content: reel.content,
      imageUrl: reel.imageUrl,
      filter: reel.filter,
      likes: reel.likes || 0,
      comments: reel.comments || 0,
      interactions: reel.interactions || 0,
      engagement: reel.engagement || 0,
      impressions: reel.impressions || 0,
      reach: reel.reach || 0,
      saved: reel.saved || 0,
      shares: reel.shares || 0,
      videoViews: reel.videoViews || 0,
      impressionsTotal: reel.impressionsTotal || 0,
      videoViewsTotal: reel.videoViewsTotal || 0
    };
  }
};

const updateSingleReel = async (reel, blogId, platformId, model, userId) => {
  try {
    const reelData = {
      userId,
      blogId,
      ...processReelData(reel, platformId)
    };

    const [updatedReel, created] = await model.upsert(reelData, {
      where: { reelId: reel.reelId },
      returning: true,
    });

    console.log(
      `Reel ${created ? 'created' : 'updated'} for blogId: ${blogId}, reelId: ${reel.reelId}`
    );

    return updatedReel;
  } catch (error) {
    console.error(`Error updating reelId: ${reel.reelId}`, error.message);
  }
};

exports.updateUserContent = async (userId) => {
  try {
    const userPlatforms = await getUserData(userId);
    const currentDate = new Date();
    const threeYearsAgo = new Date(currentDate);
    threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

    const from = formatDateTime(threeYearsAgo);
    const to = formatDateTime(currentDate);

    const updatePromises = userPlatforms.map(async (platform) => {
      try {
        console.log(`Updating content for platform: ${platform.name}, blogId: ${platform.blogId}`);
        const response = await axios.get(platform.url, {
          params: { from, to, blogId: platform.blogId },
          headers,
        });

        const content = response.data.data || [];
        console.log(`Fetched ${content.length} items for platform: ${platform.name}`);

        // Determine if we're dealing with reels or posts based on the platform name
        const isReel = platform.name.toLowerCase().includes('reel');
        const updateFunction = isReel ? updateSingleReel : updateSinglePost;

        await Promise.all(
          content.map((item) => updateFunction(item, platform.blogId, platform.platformId, platform.model, userId))
        );
      } catch (error) {
        console.error(
          `Error updating content for platform: ${platform.name}, blogId: ${platform.blogId}`,
          error.message
        );
      }
    });

    await Promise.all(updatePromises);
    console.log("All platforms updated successfully.");
  } catch (error) {
    console.error("Error updating content:", error.message);
  }
};

// Original updateSinglePost function remains unchanged
const updateSinglePost = async (post, blogId, platformId, model, userId) => {
  try {
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


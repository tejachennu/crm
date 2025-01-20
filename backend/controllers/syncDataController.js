const FbPosts = require('../models/FbPosts');
const Users = require('../models/User');
const axios = require('axios');



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
      const threeYearsAgo = new Date(currentDate);
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3); // Subtract 3 years
  
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
        from: formatDateTime(threeYearsAgo),
        to: formatDateTime(currentDate),
        blogId: Number(account.blogId),
      };
  
      try {
        console.log(
          `Fetching posts for blogId: ${account.blogId} from ${params.from} to ${params.to}`
        );
        const response = await axios.get(`https://app.metricool.com/api/v2/analytics/posts/facebook?from=${params.from}&to=${params.to}&blogId=${params.blogId}`, { params, headers });
        console.log(response.data.data);
        const posts = response.data.data || [];
  
        console.log(
          `Fetched ${posts.length} posts for blogId: ${account.blogId}`
        );
  
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
    const result = await FbPosts.create(postData);
    console.log(
      `Post added for blogId: ${account.blogId}, postId: ${
        post.postId
      }, result: ${result ? "Success" : "Failure"}`
    );
  } catch (error) {
    console.error(
      `Error processing postId: ${post.postId} for blogId: ${account.blogId}`,
      error.stack || error
    );
  }
};
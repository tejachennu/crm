const FBReelsDtTrk = require('../models/FBReelsDtTrk');
const FBReels = require('../models/FBReels');
const Users = require('../models/User');
const axios = require('axios');

exports.createData = async (req, res) => {
  try {
    const data = await FBReelsDtTrk.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating data', error: error.message });
  }
};

exports.getDataByReelId = async (req, res) => {
  try {
   
    const { reelId } = req.params;
    console.log("data",reelId)
    const data = await FBReelsDtTrk.findAll({ 
      where: { reelId },
      order: [['trackDate', 'DESC']]
    });

    console.log(data)
    if (!data.length <= 0) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching data', error: error.message });
  }
};

exports.addReel14RecordFB = async () => {
  try {
    console.log('Starting process to fetch Facebook reels of the previous 14 days...');
    await processReels();
    console.log('Completed fetching reels.');
  } catch (error) {
    console.error('Error fetching reels:', error.stack || error);
  }
};

const processReels = async () => {
  const baseUrl = "https://app.metricool.com/api/v2/analytics/posts/facebook";
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
      const reels = response.data.data || [];
      
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
    const existingTrackedData = await FBReelsDtTrk.findAll({ 
      where: { reelId: reel.reelId },
      order: [['trackDate', 'DESC']]
    });

    if (existingTrackedData.length >= 14) {
      console.log(`Reel ${reel.reelId} already has 14 days of tracking`);
      return;
    }

    const currentDate = new Date();
    const reelCreationDate = new Date(reel.created.dateTime);

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

    await FBReelsDtTrk.create({
      reelId: reel.reelId,
      trackDate: currentDate,
      blueReelsPlayCount: dailyData.blueReelsPlayCount || 0,
      postImpressionsUnique: dailyData.postImpressionsUnique || 0,
      postVideoAvgTimeWatchedSeconds: dailyData.postVideoAvgTimeWatchedSeconds || 0,
      postVideoViewTimeSeconds: dailyData.postVideoViewTimeSeconds || 0,
      postVideoReactions: dailyData.postVideoReactions || 0,
      postVideoSocialActions: dailyData.postVideoSocialActions || 0,
      engagement: dailyData.engagement || 0,
      reach: dailyData.reach || 0,
      comments: dailyData.comments || 0
    });

    console.log(`Daily tracking added for reel ${reel.reelId}`);
  } catch (error) {
    console.error(`Error processing reel tracking:`, error);
  }
};

const calculateDailyDifference = (current, previous) => {
  return {
    blueReelsPlayCount: Math.max(0, (current.blueReelsPlayCount || 0) - (previous.blueReelsPlayCount || 0)),
    postImpressionsUnique: Math.max(0, (current.postImpressionsUnique || 0) - (previous.postImpressionsUnique || 0)),
    postVideoAvgTimeWatchedSeconds: Math.max(0, (current.postVideoAvgTimeWatchedSeconds || 0) - (previous.postVideoAvgTimeWatchedSeconds || 0)),
    postVideoViewTimeSeconds: Math.max(0, (current.postVideoViewTimeSeconds || 0) - (previous.postVideoViewTimeSeconds || 0)),
    postVideoReactions: Math.max(0, (current.postVideoReactions || 0) - (previous.postVideoReactions || 0)),
    postVideoSocialActions: Math.max(0, (current.postVideoSocialActions || 0) - (previous.postVideoSocialActions || 0)),
    engagement: Math.max(0, (current.engagement || 0) - (previous.engagement || 0)),
    reach: Math.max(0, (current.reach || 0) - (previous.reach || 0)),
    comments: Math.max(0, (current.comments || 0) - (previous.comments || 0))
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
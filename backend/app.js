const express = require("express");
const cors = require("cors");
const axios = require("axios");
const sequelize = require("./config/dbConfig");
const userRoutes = require("./routes/usersRoutes");
const Platform = require("./routes/platformRoutes");
const FbPost = require("./routes/fbPostsRoutes");
const { addPost14RecordIG } = require("./controllers/IGDtTrkController");

const {processPosts} = require("./controllers/IGPostsController");
const fbPDtTrkRoutes = require("./routes/FbPDtTrkRoutes");
const IGDtTrkRoutes = require("./routes/IGPDDtTrkRoutes");
const cron = require('node-cron');

const { getPostsOfPrevious2Days } = require("./controllers/FbPostController");
const { addPost14Records } = require("./controllers/FbPDtTrkController");
const { getReelsOfPrevious2Days } = require("./controllers/FBReelsController");
const { getReelsOfPrevious2DaysIg } = require("./controllers/igReelsController");

const FbReelsRoutes = require("./routes/fbReelsRoutes");
const IgReelsRoute = require("./routes/IgReelsRoute");
const IGPDRoutes = require("./routes/IGPDRoutes");



const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api", userRoutes);
app.use("/api/platform", Platform);
app.use("/api/fbPosts", FbPost);
app.use("/api/fbPDtTrk", fbPDtTrkRoutes);
app.use("/api/IGPDtTrk", IGDtTrkRoutes);
app.use("/api/IGPD", IGPDRoutes);
app.use("/api/fbreels", FbReelsRoutes);
app.use("/api/Igreels", IgReelsRoute);


const runScheduledTasks = async (retries = 3) => {
  console.log('Running scheduled tasks...');
  try {
    await processPosts();
    await getPostsOfPrevious2Days();
    await addPost14Records();
    await addPost14RecordIG();
    await getReelsOfPrevious2Days();
    await getReelsOfPrevious2DaysIg();
    console.log('Scheduled tasks completed successfully.');
    return { success: true, message: 'Scheduled tasks completed successfully.' };
  } catch (error) {
    console.error('Error in scheduled tasks:', error);
    if (retries > 0 && error.name === 'SequelizeConnectionError') {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      return runScheduledTasks(retries - 1);
    }
    return { success: false, message: 'Error in scheduled tasks', error: error.message };
  }
};

cron.schedule('11 13 * * *', runScheduledTasks, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

// processPosts();
// getPostsOfPrevious2Days();
// addPost14Records();
// addPost14RecordIG();


// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Database synced successfully...");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   })
//   .finally(() => {
    app.listen(3003, () => {
      console.log("Server is running on port 3003...");
    });
  // });

const express = require("express");
const cors = require("cors");
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
const nodemailer = require("nodemailer")
const multer = require("multer")
const fs = require("fs")

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

// Middleware to parse FormData
const multerStorage = multer.memoryStorage()
const upload = multer({ storage: multerStorage })
// Endpoint to send email with the report attached
app.post("/api/send-report", upload.single("file"), async (req, res) => {
  const { email } = req.body
  const file = req.file

  if (!file || !email) {
    return res.status(400).send("File and email are required.")
  }

  // Create a transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tejachennu17@gmail.com",
      pass: "thye wtbx anwr bckq",
    },
  })

  // Email options
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your Social Media Report",
    text: "Please find the attached report.",
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer,
      },
    ],
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.response)
    res.status(200).send("Report sent successfully")
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).send("Failed to send email")
  }
})

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

cron.schedule('0 8 * * *', runScheduledTasks, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully...");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  })
  .finally(() => {
    app.listen(3003, () => {
      console.log("Server is running on port 3003...");
    });
  });

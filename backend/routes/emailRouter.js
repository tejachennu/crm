const { sendEmail } = require('../controllers/emailController');
const express = require('express');
const router = express.Router();

// Middleware to parse FormData
const multer = require('multer');
const multerStorage = multer.memoryStorage()
const upload = multer({ storage: multerStorage })

router.post("/", upload.single("file"), sendEmail);

module.exports = router;
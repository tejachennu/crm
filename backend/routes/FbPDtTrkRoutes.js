const express = require('express');
const router = express.Router();
const fbPDtTrkController = require('../controllers/FbPDtTrkController');

// Route to create a new FbPDtTrk entry
router.post('/', fbPDtTrkController.createData);

// Route to get data by postId
router.get('/:postId', fbPDtTrkController.getDataByPostId);

// Route to get all data
router.get('/', fbPDtTrkController.getAllData);

module.exports = router;

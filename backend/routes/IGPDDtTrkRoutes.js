const express = require('express');
const router = express.Router();
const IGDtTrkController = require('../controllers/IGDtTrkController');

// Route to create a new FbPDtTrk entry
router.post('/', IGDtTrkController.createData);

// Route to get data by postId
router.get('/:postId', IGDtTrkController.getDataByPostId);

// Route to get all data
router.get('/', IGDtTrkController.getAllData);

module.exports = router;

const express = require('express');
const router = express.Router();
const fbReelsController = require('../controllers/FBReelsController');
const fbReelsDtTrkController = require('../controllers/fbReelsDtTrkController');

// FBReels routes
router.post('/reels', fbReelsController.createReel);
router.get('/reels/:reelId', fbReelsController.getReelByReelId);
router.get('/reels/user/:userId', fbReelsController.getAllReelsByUser);

// FBReelsDtTrk routes
router.post('/reels/tracking', fbReelsDtTrkController.createData);
router.get('/reels/tracking/:reelId', fbReelsDtTrkController.getDataByReelId);

module.exports = router;

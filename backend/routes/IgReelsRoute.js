const express = require('express');
const router = express.Router();
const igReelsController = require('../controllers/igReelsController');
const igReelsDtTrkController = require('../controllers/igReelsDtTrkController');

// IGReels routes
router.post('/reels', igReelsController.createReel);
router.get('/reels/:reelId', igReelsController.getReelByReelId);
router.get('/reels/user/:userId', igReelsController.getAllReelsByUser);

// IGReelsDtTrk routes
router.post('/reels/tracking', igReelsDtTrkController.createData);
router.get('/reels/trackings/:reelId', igReelsDtTrkController.getDataByReelId);

module.exports = router;
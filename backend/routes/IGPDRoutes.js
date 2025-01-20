const express = require('express');
const router = express.Router();
const IGPostsController = require('../controllers/IGPostsController');


// Route to get a post by postId
router.get('/:userId', IGPostsController.getAllPostsByUser);

module.exports = router;

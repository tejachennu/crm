const express = require('express');
const router = express.Router();
const fbPostsController = require('../controllers/FbPostController');

// Route to create a new post
router.post('/', fbPostsController.createPost);

// Route to get a post by postId
router.get('/:postId', fbPostsController.getPostByPostId);

// Route to get all posts by userId and platformId
router.get('/', fbPostsController.getAllPostsByUserAndPlatform);

module.exports = router;

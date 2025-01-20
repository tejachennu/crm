const express = require('express');
const platformController = require('../controllers/platformController');

const router = express.Router();

router.post('/', platformController.createPlatform);
router.get('/', platformController.getAllPlatforms);
router.get('/:id', platformController.getPlatformById);
router.put('/:id', platformController.updatePlatform);
router.delete('/:id', platformController.deletePlatform);

module.exports = router;

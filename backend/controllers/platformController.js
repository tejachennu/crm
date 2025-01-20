const  Platform  = require('../models/Platforms');

// Create a new platform
exports.createPlatform = async (req, res) => {
  try {
    const platform = await Platform.create(req.body);
    
    res.status(201).json(platform);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all platforms
exports.getAllPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.findAll();
    res.status(200).json(platforms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a platform by ID
exports.getPlatformById = async (req, res) => {
  try {
    const platform = await Platform.findByPk(req.params.id);
    if (!platform) return res.status(404).json({ error: 'Platform not found' });
    res.status(200).json(platform);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a platform
exports.updatePlatform = async (req, res) => {
  try {
    const [updated] = await Platform.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Platform not found' });
    const updatedPlatform = await Platform.findByPk(req.params.id);
    res.status(200).json(updatedPlatform);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a platform
exports.deletePlatform = async (req, res) => {
  try {
    const deleted = await Platform.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Platform not found' });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

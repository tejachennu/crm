const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User');
const Platform = require('./Platforms');

const IGReels = sequelize.define('IGReels', {
  platformId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Platform,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  businessId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reelId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'REELS_VIDEO'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  filter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  interactions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  engagement: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  saved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  videoViews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressionsTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  videoViewsTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'IGReels',
  timestamps: true,
});

module.exports = IGReels;
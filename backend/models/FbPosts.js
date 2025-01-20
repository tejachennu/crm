const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('../models/User');
const Platform = require('../models/Platforms');

const FbPosts = sequelize.define('FbPosts', {
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
  blogId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  pageId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique:true
  },
  created: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reactions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressionsPaid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressionsOrganic: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressionsUnique: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressionsUniquePaid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressionsUniqueOrganic: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  engagement: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  picture: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videoViews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  videoViewsPaid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  videoViewsOrganic: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  videoTimeWatched: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  linkClicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  spend: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  internalSearchId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'FbPosts',
  timestamps: true,
});

module.exports = FbPosts;

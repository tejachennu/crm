const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User');
const Platform = require('./Platforms');

const FBReels = sequelize.define('FBReels', {
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
  pageId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reelId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  created: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  length: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  thumbnailUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reelUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blueReelsPlayCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  postImpressionsUnique: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  postVideoAvgTimeWatchedSeconds: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  postVideoViewTimeSeconds: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  postVideoReactions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  postVideoSocialActions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  engagement: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'FBReels',
  timestamps: true,
});

module.exports = FBReels;
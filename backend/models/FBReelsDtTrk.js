const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const FBReels = require('./FBReels');

const todayWithTime = new Date();

const FBReelsDtTrk = sequelize.define('FBReelsDtTrk', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trackDate: {
    type: DataTypes.DATEONLY,
    defaultValue: todayWithTime
  },
  reelId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: FBReels,
      key: 'reelId',
    }
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
  tableName: 'FBReelsDtTrk',
  timestamps: true,
});

module.exports = FBReelsDtTrk;
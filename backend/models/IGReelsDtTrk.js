const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const IGReels = require('./IGReels');

const todayWithTime = new Date();

const IGReelsDtTrk = sequelize.define('IGReelsDtTrk', {
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
      model: IGReels,
      key: 'reelId',
    }
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
  tableName: 'IGReelsDtTrk',
  timestamps: true,
});

module.exports = IGReelsDtTrk;
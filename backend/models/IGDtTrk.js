const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const IGPosts = require('./IGPosts ');

const todayWithTime = new Date();

const IGDtTrk = sequelize.define('IGDtTrk', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trackDate: {
    type: DataTypes.DATEONLY,
    defaultValue: todayWithTime
  },
  postId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: IGPosts,
      key: 'postId',
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
  tableName: 'IGDtTrk',
  timestamps: true,
});

module.exports = IGDtTrk;
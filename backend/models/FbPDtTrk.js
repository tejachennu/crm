const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const FbPosts = require('../models/FbPosts');

const todayWithTime = new Date(); // This will get the full date and time.


const FbPDtTrk = sequelize.define('FbPDtTrk', {
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
    primaryKey: true,
    references : {
        model: FbPosts,
        key: 'postId',
    }
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
  tableName: 'FbPDtTrk',
  timestamps: true,
});

module.exports = FbPDtTrk;

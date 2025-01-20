const { DataTypes } = require('sequelize');
const sequalize = require('../config/dbConfig');
const User = require('../models/User')

const Platform = sequalize.define('Platform', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Platform :{
        type: DataTypes.ENUM,
        values: ['Facebook', 'Instagram', 'Twitter' ,'LinkedIn' ,'GoogleAds', 'MetaAds', 'Google Business'],
        allowNull:false
    },
    baseUrl :{
        type: DataTypes.STRING,
        allowNull:false
    }
},
  {
    timestamps: true,
    tableName : 'Platform',
  }
) 

module.exports = Platform
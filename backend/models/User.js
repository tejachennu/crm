const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Platform = require('./Platforms');

const User = sequelize.define(
    'users',{
        id: {
            type :DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        userName :{
            type: DataTypes.STRING,
            allowNull: false
        },
        blogId :{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email :{
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile : {
            type: DataTypes.STRING,
            allowNull: true
        },
        password : {
            type: DataTypes.STRING,
            allowNull: false
        },
        platform: {
            type: DataTypes.STRING, // Store as a comma-separated string
            allowNull: true,
        },
    },{
        tableName:'users',
        timestamps: true
    }
)
module.exports = User;
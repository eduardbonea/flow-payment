const db = require('../config/db');
const { DataTypes } = require('sequelize');

const payerModel = db.define(
    "payer",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idPay: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { 
        freezeTableName: true,
        timestamps: false 
    }
);

module.exports = payerModel;
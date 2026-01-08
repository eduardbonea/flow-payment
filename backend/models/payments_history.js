const db = require('../config/db');
const { DataTypes } = require('sequelize');

const paymentHistoryModel = db.define(
    "payments_history",
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
        idPayer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('in_progress', 'finished', 'pending', 'canceled'),
            allowNull: false,
            defaultValue: 'in_progress'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    { 
        freezeTableName: true,
        timestamps: false 
    }
);

module.exports = paymentHistoryModel;
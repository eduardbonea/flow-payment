const db = require('../config/db');
const {DataTypes} = require('sequelize');

const paymentHistoryModel = db.define(
    "payments_history",
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idPay:{
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false,
        },
        idUser:{
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false,
        },
        status:{
            type: DataTypes.ENUM('finished', 'in_progress', 'canceled'),
            allowNull: false,
            defaultValue: 'in_progress'
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    }
)

module.exports = paymentHistoryModel;
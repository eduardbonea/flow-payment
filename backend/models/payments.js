const db = require('../config/db');
const {DataTypes} = require('sequelize');

const paymentModel = db.define (
    "payments",
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idRequester:{
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
        },
        idPayeer:{
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        },
        currency:{
            type: DataTypes.ENUM('RON', 'EUR', 'USD', 'GBP'),
            allowNull: false,
            defaultValue: 'RON'
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        expireDate:{
            type: DataTypes.DATE,
            allowNull: false, 
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull: false
        },
        status:{
            type: DataTypes.ENUM('finished', 'in_progress', 'canceled'),
            allowNull: false,
            defaultValue: 'in_progress'
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    }
)

module.exports = paymentModel;

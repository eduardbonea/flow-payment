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
        UUID:{
            type: DataTypes.UUID,
            foreignKey: true,
            allowNull: false
        },
        amount:{
            type: DataTypes.DECIMAL(7, 2),
            allowNull: false,
            defaultValue: 0
        },
        peopleNo:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        description:{
            type: DataTypes.STRING,
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
            type: DataTypes.ENUM('finished', 'in_progress', 'pending', 'canceled'),
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

const { toDefaultValue } = require('sequelize/lib/utils');
const db = require('../config/db');
const {DataTypes} = require('sequelize');

const userModel = db.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        iban: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [15, 34],
                is: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/i,
            }
        },
        revolutLink: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true,
            }
        },
    },
    {
        freezeTableName: true
    }
)

module.exports = userModel;
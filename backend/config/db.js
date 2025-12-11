require('dotenv').config();
const Sequelize = require('sequelize');

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
    DB_CHARSET
} = process.env

if (!DB_NAME || !DB_USER || !DB_HOST || !DB_DIALECT) {
    console.error('DB_NAME, DB_USER, DB_HOST, DB_DIALECT incorrect');
    console.error('.env is missing');
    process.exit(1); 
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    charset: DB_CHARSET || 'utf8', 
});

module.exports = sequelize;
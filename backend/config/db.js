require('dotenv').config();
const Sequelize = require('sequelize');

const {
    MYSQL_DATABASE,
    MYSQL_USER,
    MYSQL_PASSWORD,
    DB_HOST,
    DB_DIALECT,
    DB_CHARSET
} = process.env

if (!MYSQL_DATABASE || !MYSQL_USER || !DB_HOST || !DB_DIALECT) {
    console.error('MYSQL_DATABASE, MYSQL_USER, DB_HOST, DB_DIALECT incorrect');
    console.error('.env is missing');
    process.exit(1); 
}

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    charset: DB_CHARSET || 'utf8', 
});

module.exports = sequelize;
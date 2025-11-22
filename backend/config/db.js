const Sequelize = require('sequelize');

const sequelize = new Sequelize("flow", "root", "", {
    host: "localhost",
    dialect: "mysql",
    charset: "utf8",
});

module.exports = sequelize;
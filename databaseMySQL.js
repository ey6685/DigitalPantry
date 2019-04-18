// db defined in the file for mysql

const Sequelize = require('sequelize');
module.exports = new Sequelize('digital_pantry', 'root', 'password', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000
  }
});

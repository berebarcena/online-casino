const Sequelize = require('sequelize');
const userModel = require('./user.js');

//db config
const db = new Sequelize({
  database: process.env.BLOGAPP,
  username: process.env.POSTGRES_USER,
  host: 'localhost',
  dialect: 'postgres',
  storage: './session.postgres',
});

module.exports = {
  db,
  User,
};

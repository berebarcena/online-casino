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

// Declare Models
const User = userModel(db, Sequelize);

module.exports = {
  db,
  User,
};

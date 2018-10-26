const Sequelize = require('sequelize');
const userModel = require('./user.js');

//db config
const db = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  storage: './session.postgres',
});

// Declare Models
const User = userModel(db, Sequelize);

module.exports = {
  db,
  User,
};

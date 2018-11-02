const Sequelize = require('sequelize');
const userModel = require('./user.js');

//db config
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? true : false,
  },
});

// Declare Models
const User = userModel(db, Sequelize);

module.exports = {
  db,
  User,
};

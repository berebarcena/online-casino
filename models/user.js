module.exports = (sequelize, type) => {
  return sequelize.define('users', {
    firstname: {
      type: type.STRING,
    },
    lastname: {
      type: type.STRING,
    },
    email: {
      type: type.STRING,
      unique: true,
    },
    password: {
      type: type.STRING,
      unique: true,
    },
    credits: {
      type: type.INTEGER,
    },
  });
};

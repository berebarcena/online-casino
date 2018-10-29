const express = require('express');
const router = express.Router();
const { User } = require('../models');

const get = (req, res) => {
  const userSession = req.session.user || {};
  User.findOne({
    where: {
      id: userSession.id,
    },
  }).then(user => {
    res.render('play', { userSession, user });
  });
};

module.exports = router.get('/', get);

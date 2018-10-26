const express = require('express');
const router = express.Router();
const { User } = require('../models');

const get = (req, res) => {
  const userSession = req.session.user || {};
  res.render('signup', { userSession });
};

module.exports = router.get('/', get);

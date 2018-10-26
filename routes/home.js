const express = require('express');
const router = express.Router();
const { User } = require('../models');
const errors = require('../util/messages');

const get = (req, res) => {
  const message = req.query.message ? errors[req.query.message] : '';
  const userSession = req.session.user || {};
  res.render('home', { userSession, message });
};

module.exports = router.get('/', get);

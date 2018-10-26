const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

//create a new user from the signup form
const getUser = (req, res) => {
  const userSessionData = req.session.user || {};
  if (!userSessionData.id) {
    res.redirect('/');
  }
  const userSessionId = userSessionData.id;
  const id = req.params.id;
  const message = req.query.message;
  User.findAll({
    where: {
      id: id,
    },
  }).then(user => {
    if (!user.length) {
      res.status(400);
      res.render('404', { error: 'This user does not exist' });
    } else {
      res.render('user', {
        userSession: userSessionData,
        message,
      });
    }
  });
};

module.exports = router.get('/:id', getUser);

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { User } = require('../models');

const get = (req, res) => {
  const userSession = req.session.user || {};
  res.render('signup', { userSession });
};

const newUserPOST = (req, res) => {
  //all fields are required
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.redirect(
      `/signup?message=${encodeURIComponent('All fields are required')}`
    );
  }
  //find a user with that username
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(user => {
      //if mail is already taken, then send an error
      if (user) {
        return res.redirect(
          `/signup?message=${encodeURIComponent(
            'An account with that email is already registered'
          )}`
        );
      }
    })
    .catch(err => {
      console.log(err);
    });

  const password = req.body.password;
  bcrypt
    .hash(password, 8)
    .then(hash => {
      return User.create({
        //populate the user table using an encrypted password
        username: req.body.username,
        email: req.body.email,
        password: hash,
        credits: 100,
      });
    })
    .then(user => {
      req.session.user = user;
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = router.get('/', get).post('/', newUserPOST);

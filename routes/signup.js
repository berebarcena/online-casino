const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { User } = require('../models');
const moment = require('moment');

const get = (req, res) => {
  const userSession = req.session.user || {};
  const message = req.query.message || '';
  res.render('signup', { userSession, message });
};

const newUserPOST = (req, res) => {
  //all fields are required
  if (
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.birthday
  ) {
    res.redirect(
      `/signup?message=${encodeURIComponent('All fields are required')}`
    );
  }
  const now = moment();
  const userBirthday = moment(req.body.birthday);

  if (now.diff(userBirthday, 'years') < 18) {
    res.redirect(
      `/signup?message=${encodeURIComponent(
        'Must be 18 years old or older to register, sorry :('
      )}`
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
      res.redirect('/user/${user.id}');
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = router.get('/', get).post('/', newUserPOST);

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { User } = require('../models');
const errors = require('../util/messages');

const get = (req, res) => {
  const userSession = req.session.user || {};
  const message = req.query.message ? errors[req.query.message] : '';
  res.render('login', { userSession, message });
};

const post = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //email and password is needed
  if (!email || !password) {
    const errorMsg = !email ? 'emailRequired' : 'passwordRequired';
    res.redirect(`/login?message=${errorMsg}`);
  }

  //find the user with the email from the req
  User.findOne({
    where: {
      email: email,
    },
  })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password).then(isValidPassword => {
          if (isValidPassword) {
            req.session.user = user;
            res.redirect(`/user/${user.id}`);
          } else {
            //if the password is incorrect, send a message
            res.redirect('/login?message=invalidPass');
          }
        });
      } else {
        //if user does not exist, send a message
        res.redirect('/login?message=userNotExistent');
      }
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = router.get('/', get).post('/', post);

const express = require('express');
const router = express.Router();
const { User } = require('../models');

//find the user in our database
const getUser = (req, res) => {
  const userSession = req.session.user || {};
  if (!userSession.id) {
    res.redirect('/');
  }
  const id = req.params.id;
  const message = req.query.message;
  User.findOne({
    where: {
      id: id,
    },
  }).then(user => {
    if (!user.id) {
      res.status(400);
      res.render('404', { error: 'This user does not exist' });
    } else {
      res.render('user', {
        user,
        userSession,
        message,
      });
    }
  });
};

module.exports = router.get('/:id', getUser);

const express = require('express');
const router = express.Router();
const { User } = require('../models');

const get = (req, res) => {
  const userSession = req.session.user || {};
  res.render('buyCredits', { userSession });
};

const addCreditsPOST = (req, res) => {
  const userSession = req.session.user || {};
  //find a user with the id
  User.findOne({
    where: {
      id: userSession.id,
    },
  })
    .then(user => {
      const currentCredit = parseInt(req.body.creditAmount);
      User.update(
        {
          credits: currentCredit + user.credits,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.redirect(`/user/${userSession.id}`);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = router.get('/buy', get).post('/add', addCreditsPOST);

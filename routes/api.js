const express = require('express');
const router = express.Router();
const { User } = require('../models');

const pay = (req, res) => {
  User.findOne({
    where: {
      id: req.body.userId,
    },
  })
    .then(user => {
      const newCredits = user.credits + req.body.credits;
      return User.update(
        {
          credits: newCredits,
        },
        {
          where: {
            id: user.id,
          },
        }
      ).then(user => {
        res.json({ credits: newCredits });
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const charge = (req, res) => {
  User.findOne({
    where: {
      id: req.body.userId,
    },
  })
    .then(user => {
      const newCredits = user.credits - req.body.credits;
      if (newCredits < 0) {
        return res.json({ error: 'Not enough credits', credits: user.credits });
      }
      return User.update(
        {
          credits: newCredits,
        },
        {
          where: {
            id: user.id,
          },
        }
      ).then(user => {
        res.json({ credits: newCredits });
      });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = router
  .post('/credits/pay', pay)
  .post('/credits/charge', charge);

const express = require('express');
const router = express.Router();
const errors = require('../util/messages');

const get = (req, res) => {
  req.session.destroy(error => {
    if (error) {
      throw error;
    }
    res.redirect('/?message=loggedOut');
  });
};

module.exports = router.get('/', get);

'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, function (req, res) {
  const { username, id, firstname, income } = req.user;
  const user = { id, username, firstname, income };
  const authToken = createAuthToken(user);
  return res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const hasNumbers = /\d/; // On the front-end, we can send values that can be added into the new, refreshed token.


  if (hasNumbers.test(req.body.value)) {
    req.user.income = req.body.value; // Ensures that income is updated on refresh! May need this later, so I'm keeping it reusable!
  }
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

module.exports = router;
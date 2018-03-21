'use strict';

const express = require('express');
const router = express.Router();

const {dbGet} = require('../db-knex');

router.post ('/users', (req, res, next) => {
  const knex = dbGet();

  const {fullname, username, password} = req.body;

  const newUser = {
    fullname: fullname,
    username: username,
    password: password
  };

  let userId;

  knex.insert(newUser)
    .into('users')
    .returning('id')
    .then(([id]) => {
      userId = id;
    })
    .then(() => {
      return knex.select('fullname', 'username')
        .where('users.id', userId)
        .first();
    })
    .then (result => {
      if (result) {
        res.location(`${req.originalUrl}/${userId}`).status(201).json(result);
      } else {
        next();
      }
    })
    .catch (err => {
      next(err);
    });
});

module.exports = router;
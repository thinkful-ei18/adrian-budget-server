'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const {dbGet} = require('../db-knex');

router.post ('/users', (req, res, next) => {
  const knex = dbGet();

  const { fullname, username, password } = req.body;

  let userId;

  return bcrypt.hash(password, 10)
    .then(digest => {
      const newUser = {
        fullname: fullname,
        username: username,
        password: digest
      };
      return knex.insert(newUser)
        .into('users')
        .returning('id')
        .then(([id]) => {
          userId = id;
        });
    })
    .then(() => {
      return knex.select('users.fullname', 'users.username')
        .from('users')
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
      if (err.code === '23505') {
        err = new Error('The username already exists');
        err.status = 400;
        // return next(err);
      }
      next(err);
    });

});

module.exports = router;
'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const {dbGet} = require('../db-knex');

router.post ('/users', (req, res, next) => {
  const knex = dbGet();

  const { firstname, username, password } = req.body;

  let userId;

  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['username', 'password', 'firstname'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be type String`);
    err.status = 422;
    return next(err);
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error(`Field: '${nonTrimmedField}' cannot start or end with whitespace`);
    err.status = 422;
    return next(err);
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 8, max: 72 }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
  );

  if (tooSmallField) {
    const min = sizedFields[tooSmallField].min;
    const err = new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`);
    err.status = 422;
    return next(err);
  }

  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
  );

  if (tooLargeField) {
    const max = sizedFields[tooLargeField].max;
    const err = new Error(`Field: '${tooSmallField}' must be at most ${max} characters long`);
    err.status = 422;
    return next(err);
  }

  return bcrypt.hash(password, 10)
    .then(digest => {
      const newUser = {
        firstname: firstname,
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
      return knex.select('users.firstname', 'users.username')
        .from('users')
        .where('users.id', userId)
        .first();
    })
    .then (user => {
      console.log('user:', user);
      if (user) {
        res.location(`${req.originalUrl}/${userId}`).status(201).json(user);
      } else {
        next();
      }
    })
    .catch (err => {
      // console.log(err);
      if (err.code === '23505') {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });

});

router.get('/users/:id/income', (req, res, next) => {
  const knex = dbGet();

  const userId = req.params.id;
  knex
    .select('users.income')
    .from('users')
    .where('users.id', userId)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/users/:id/income', (req, res, next) => {
  const knex = dbGet();

  const { income } = req.body;
  const userId = req.params.id;
  const userIncome = {
    income: income
  };

  knex('users.id').from('users')
    .where('users.id', userId)
    .then(result => {
      if (result && result.length > 0) {
        knex('users')
          .update(userIncome)
          .where('id', userId)
          .then(() => {
            return knex.select('users.id', 'users.username', 'users.income')
              .from('users')
              .where('users.id', userId)
              .first()
              .then(result => {
                if (result) {
                  res.json(result);
                }
              });
          });
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;
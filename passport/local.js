'use strict';

const express = require('express');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');

const app = express();
const bodyParser = require('body-parser');

const {dbGet} = require('../db-knex');

app.use(express.static('public'));
app.use(bodyParser.json());

const localStrategy = new LocalStrategy((username, password, done) => {

  const knex = dbGet();
  let user;

  function validatePassword (password) {
    return bcrypt.compare(password, 10);
  }

  knex.select('users.username', 'users.password')
    .from('users')
    .where('users.username', username)
    .first()
    .then(results => {
      user = results;
      console.log(user);
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username'
        });
      }
      // return validatePassword(user.password);
    })
    // .then(isValid => {
    //   if (!isValid) {
    //     return Promise.reject({
    //       reason: 'LoginError',
    //       message: 'Incorrect password',
    //       location: 'password'
    //     });
    //   }
    //   return done(null, user);
    // })
    .catch(err => {
      if(err.reason === 'LoginError') {
        return done(null, false);
      }
      return done(err);
    });

  // try {
  //   if (username !== 'thinkfulstudent123') {
  //     console.log('Incorrect username!');
  //     return done(null, false);
  //   }

  //   if (password !== 'thinkful2018') {
  //     console.log('Incorrect password!');
  //     return done(null, false);
  //   }

  //   const user = { username, password };
  //   return done(null, user);

  // } catch (err) {
  //   done(err);
  // }

});

module.exports = localStrategy;

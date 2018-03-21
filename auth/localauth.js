'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');

const options = {session: false, failwithError: true};
const localAuth = passport.authenticate('local', options);
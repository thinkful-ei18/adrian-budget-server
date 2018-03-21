'use strict';

const express = require('express');
const router = express.Router();

const {dbGet} = require('..db/knex');

router.post ('/users', (req, res, next) => {
  const knex = dbGet();
});

module.exports = router;
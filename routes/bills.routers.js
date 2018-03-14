'use strict';

const express = require('express');
const router = express.Router();

const {dbGet} = require('../db-knex');

router.get('/bills', (req, res, next) => {
  const knex = dbGet();
  knex.select('bills.id', 'bills.category_id', 'bills.user_id', 'name', 'amount')
    .from('bills')
    .leftJoin('categories', 'bills.category_id', 'categories.id')
    .leftJoin('bills_categories', 'bills.id', 'bills_categories.bill_id')
    .orderBy('bills.id')
    .then(results => res.json(results))
    .catch(err => {next(err);
    });
});

module.exports = router;
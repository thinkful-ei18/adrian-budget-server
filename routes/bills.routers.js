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
    .then(results => console.log(results));


  const bills = [
    {
      name: 'Internet',
      amount: 65,
    },
    {
      name: 'Groceries',
      amount: 250,
    },
    {
      name: 'Utilities',
      amount: 300,
    },
    {
      name: 'Rent',
      amount: 1250,
    },
    {
      name: 'Cellphone',
      amount: 55,
    },
    {
      name: 'Netflix',
      amount: 15,
    },
    {
      name: 'Spotify',
      amount: 15,
    },
  ];

  return res.json(bills);

});

module.exports = router;
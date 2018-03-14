'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/bills', (req, res, next) => {

  knex.select('bills.id', 'category_id', 'user_id', 'name', 'amount')
    .from('bills')
    .leftJoin('categories', 'notes.category_id', 'categories.id')
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
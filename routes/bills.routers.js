'use strict';

const express = require('express');
const router = express.Router();

router.get('/bills', (req, res, next) => {


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
'use strict';

const express = require('express');
const router = express.Router();

router.get('/bills', (req, res, next) => {

  const bills = [
    {
      name: 'Internet',
      amount: 65
    },
    {
      name: 'Groceries',
      amount: 150
    },
    {
      name: 'Utilities',
      amount: 250
    }
  ];

  return res.json(bills);

});

module.exports = router;
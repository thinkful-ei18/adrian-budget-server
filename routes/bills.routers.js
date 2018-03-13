'use strict';

const express = require('express');
const router = express.Router();

router.get('/bills', (req, res, next) => {


  // const staticBills = [
  //   {name: 'Internet',
  //   amount: 65,
  // },
  // {name: 'Groceries',
  // amount: 250,
  // },
  // ];

  const bills = [
    'Internet $65',
    'Groceries $250',
    'Utilities $300',
    'Rent $1200',
    'Cellphone $50',
    'Netflix $15',
    'Spotify $15'
  ];

  return res.json(bills);

});

module.exports = router;
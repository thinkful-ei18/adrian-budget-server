'use strict';

const express = require('express');
const router = express.Router();

router.get('/bills', (req, res, next) => {

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
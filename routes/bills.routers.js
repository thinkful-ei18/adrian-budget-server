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

router.post('/bills', (req, res, next) => {
  const { name, amount, category_id } = req.body;

  if (!req.body.name || !req.body.amount) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newBill = {
    name: name,
    amount: amount,
    category_id: category_id
  };

  let billId;

  const knex = dbGet();
  knex.insert(newBill)
    .into('bills')
    .returning('id')
    .then(([id]) => {
      billId = id;
    })
    .then(() => {
      return knex.select('bills.id', 'bills.category_id', 'bills.user_id', 'name', 'amount')
        .from('bills')
        .leftJoin('categories', 'bills.category_id', 'categories.id')
        .leftJoin('bills_categories', 'bills.id', 'bills_categories.bill_id')
        .where('bills.id', billId);
    })
    .then(result => {
      if (result) {
        res.location(`${req.originalUrl}/${billId}`).status(201).json;
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
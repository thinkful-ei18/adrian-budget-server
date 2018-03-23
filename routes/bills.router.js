'use strict';

const express = require('express');
const router = express.Router();

const {dbGet} = require('../db-knex');

router.get('/bills', (req, res, next) => {

  const knex = dbGet();

  let userId;

  knex.select('bills.id', 'bills.category_id', 'bills.user_id', 'name', 'amount')
    .from('bills')
    .leftJoin('users', 'bills.user_id', 'users.id')
    .leftJoin('categories', 'bills.category_id', 'categories.id')
    .leftJoin('bills_categories', 'bills.id', 'bills_categories.bill_id')
    .orderBy('bills.id')
    // .where('bills.user_id', 'users.id')
    .then(results => res.json(results))
    .catch(err => {next(err);
    });
});

router.post('/bills', (req, res, next) => {

  const knex = dbGet();

  const { name, amount, category_id, beenpaid, duedate, billinterval } = req.body;

  if (!req.body.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newBill = {
    user_id: userId,
    name: name,
    amount: amount,
    category_id: category_id,
    beenpaid: beenpaid,
    duedate: duedate,
    billinterval: billinterval
  };

  let billId;

  knex.insert(newBill)
    .into('bills')
    .returning('id')
    .then(([id]) => {
      billId = id;
    })
    .then(() => {
      return knex.select('bills.id', 'bills.category_id', 'bills.user_id', 'name', 'amount')
        .from('bills')
        .leftJoin('users', 'bills.user_id', 'users.id')
        .leftJoin('categories', 'bills.category_id', 'categories.id')
        .leftJoin('bills_categories', 'bills.id', 'bills_categories.bill_id')
        .where('bills.id', billId)
        .first();
    })
    .then(result => {
      if (result) {
        res.location(`${req.originalUrl}/${billId}`).status(201).json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
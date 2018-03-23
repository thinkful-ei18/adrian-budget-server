'use strict';

const express = require('express');
const router = express.Router();

const {dbGet} = require('../db-knex');

router.get('/bills', (req, res, next) => {

  const knex = dbGet();

  const userId = req.user.id;

  knex.select('bills.id', 'bills.category_id', 'bills.user_id', 'name', 'amount')
    .from('bills')
    .leftJoin('users', 'bills.user_id', 'users.id')
    .leftJoin('categories', 'bills.category_id', 'categories.id')
    .leftJoin('bills_categories', 'bills.id', 'bills_categories.bill_id')
    .orderBy('bills.id')
    .where('bills.user_id', userId)
    .then(results => res.json(results))
    .catch(err => {next(err);
    });
});

router.post('/bills', (req, res, next) => {

  const knex = dbGet();

  const { name, amount, category_id, beenpaid, duedate, billinterval } = req.body;
  const userId = req.user.id;

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
        .andWhere('bills.user_id', userId)
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

router.put('/bills/:id', (req, res, next) => {

  const knex = dbGet();

  const userId = req.user.id;
  const billId = req.params.id;
  const { name, amount, category_id, beenpaid, duedate, billinterval } = req.body;

  const updatedBill = {
    user_id: userId,
    name: name,
    amount: amount,
    category_id: category_id,
    beenpaid: beenpaid,
    duedate: duedate,
    billinterval: billinterval
  };

  knex('bills.id').from('bills')
    .where('bills.id', billId)
    .andWhere('bills.user_id', userId)
    .then(result => {
      if (result && result.length > 0) {
        knex('bills')
          .update(updatedBill)
          .where('id', billId)
          .then(() => {
            return knex.select('bills.id', 'bills.category_id', 'bills.user_id', 'name', 'amount')
              .from('bills')
              .leftJoin('users', 'bills.user_id', 'users.id')
              .leftJoin('categories', 'bills.category_id', 'categories.id')
              .leftJoin('bills_categories', 'bills.id', 'bills_categories.bill_id')
              .where('bills.id', billId)
              .andWhere('bills.user_id', userId)
              .first()
              .then(result => {
                if (result) {
                  res.json(result);
                }
              });
          });
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

});


router.delete('/bills/:id', (req, res, next) => {

  const knex = dbGet();
  const userId = req.user.id;
  const billId = req.params.id;

  knex.del()
    .where('id', billId)
    .andWhere('bills.user_id', userId)
    .from('bills')
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
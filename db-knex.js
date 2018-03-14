'use strict';

const createKnex = require('knex');

const {DATABASE_URL} = require('./config');

let knex = null;

function dbConnect(url = DATABASE_URL) {
  console.log('Connecting...');
  knex = createKnex({
    client: 'pg',
    connection: {
      user: 'dev',
      database: 'dev-budget-app'
    }

  });
}

function dbDisconnect() {
  return knex.destroy();
}

function dbGet() {
  return knex;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};

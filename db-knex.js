'use strict';

const createKnex = require('knex');
const {DATABASE_URL} = require('./config');
var pg = require('pg');
pg.defaults.ssl = true; // enable SSL for Heroku Postgres
let knex = null;


function dbConnect(url = DATABASE_URL) {
  console.log('Connecting...');
  knex = createKnex({
    client: 'pg',
    connection: url
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

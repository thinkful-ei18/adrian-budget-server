'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection:    {
      user: 'dev',
      database: 'dev-budget-app'
    },
    debug: false, // http://knexjs.org/#Installation-debug
    pool: {min : 1 , max : 2}
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgres://dev:0320@localhost/test-budget-app',
    pool: {min : 1 , max : 2}
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
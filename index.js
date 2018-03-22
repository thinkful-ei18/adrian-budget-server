'use strict';

require('dotenv').config();

const express = require('express');
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-knex');

const app = express();
const billsRouter = require('./routes/bills.router');
const usersRouter = require('./routes/users.router');
const authRouter = require('./routes/auth.router');


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(bodyParser.json());

app.use('/api', usersRouter);
app.use('/api', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(passport.authenticate('jwt', { session: false, failWithError: true }));

app.use('/api', billsRouter);

app.use(function (req, res, next) {
  // console.log('404 error ran');
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  console.log(err);
  // console.log('error handler ran');
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};

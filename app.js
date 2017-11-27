"use strict";
const { path, requirePath, PATHS } = require('./paths');

const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { check, validationResult, matchedData, sanitize } = requirePath(PATHS.includes, 'validator');
const upload = requirePath(PATHS.includes, 'upload');
const flash = require('connect-flash');
const messages = require('express-messages');
const mongoose = require('mongoose');

const index = requirePath(PATHS.routes, 'index');
const users = requirePath(PATHS.routes, 'users');

const app = express();

// view engine setup
app.set('views', PATHS.views);
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(PATHS.client, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets', express.static(PATHS.assets));

// sessions setup
app.use(session(
  requirePath(PATHS.config, 'session')
));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// validator setup
app.use([
  // validation checks
], function(req, res, next){
  // Get the validation result whenever you want; see the Validation Result API for all options!
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
});

// flash setup
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

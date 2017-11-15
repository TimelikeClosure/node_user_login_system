"use strict";
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const upload = require('multer')({dest: './uploads'});
const flash = require('connect-flash');
const messages = require('express-messages');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;

const index = require('./routes/index');
const users = require('./routes/users');

const CONFIG = path.join(__dirname, 'config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// sessions setup
app.use(session(
  require(path.join(CONFIG, 'session'))
));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// validator setup
// errorFormatter: function(param, msg, value){
//   var namespace = param.split('.'),
//     root = namespace.shift(),
//     formParam = root;

//   while(namespace.length){
//     formParam += '[' + namespace.shift() + ']';
//   }
//   return {
//     param: formParam,
//     msg: msg,
//     value: value
//   }
// }
app.use([
  // validation checks
], function(req, res, next){
  // Get the validation result whenever you want; see the Validation Result API for all options!
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // matchedData returns only the subset of data validated by the middleware
  // const user = matchedData(req);
  // createUser(user).then(user => res.json(user));
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

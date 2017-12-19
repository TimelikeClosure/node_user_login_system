"use strict";
const { requirePath, PATHS } = require('../paths');
const express = require('express');
const router = express.Router();
const passport = requirePath(PATHS.includes, 'passport');
const upload = requirePath(PATHS.includes, 'upload');
const { body, sanitizeBody, validationResult, createValidationChain } = requirePath(PATHS.includes, 'validator');
const User = requirePath(PATHS.models, 'user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
  ['username', 'password']
    .map(field => sanitizeBody(field).stripLow()),
  ['username']
    .map(field => sanitizeBody(field).trim()),
  createValidationChain('username').nonEmpty().isUsername()(body),
  createValidationChain('password').nonEmpty().isPassword()(body),
  function(req, res, next){
    const fieldNames = ['username', 'password'];
    const {username, password} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log('the following login form errors occured:');
      console.log(errors.array().map(value => JSON.stringify(value)).join('\n'));
      const fields = fieldNames.reduce((fields, field) => {
        if (!fields.hasOwnProperty(field)){
          fields[field] = {value: req.body[field]};
        }
        return fields;
      }, errors.mapped());
      req.flash('danger', 'There were some errors with your login. See below for details.');
      res.render('login', { fields });
    } else {
      next();
    }
  },
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/users/login',
    successFlash: true,
    successRedirect: '/'
  })
);

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', upload.single('profile_image'),
  ['name', 'email', 'username', 'password', 'password_confirm']
    .map(field => sanitizeBody(field).stripLow()),
  ['name', 'email', 'username']
    .map(field => sanitizeBody(field).trim()),
  createValidationChain('name').nonEmpty().isName()(body),
  createValidationChain('email').nonEmpty().isEmail()(body),
  createValidationChain('username').nonEmpty().isUsername()(body),
  createValidationChain('password').nonEmpty().isPassword()(body),
  createValidationChain('password_confirm').nonEmpty().matchesField('password', 'body')(body),
  function(req, res, next) {
    const fieldNames = ['name', 'email', 'username', 'password', 'password_confirm'];
    const {name, email, username, password, password_confirm} = req.body;
    if (req.file){
      console.log('Uploading file');
      var profileImage = req.file.filename;
    } else {
      console.log('No file uploaded');
      var profileImage = 'noimage.jpg';
    }

    // Check Errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log('the following registration form errors occured:');
      console.log(errors.array().map(value => JSON.stringify(value)).join('\n'));
      const fields = fieldNames.reduce((fields, field) => {
        if (!fields.hasOwnProperty(field)){
          fields[field] = {value: req.body[field]};
        }
        return fields;
      }, errors.mapped());
      req.flash('danger', 'There were some errors with your registration. See below for details.');
      res.render('register', { fields });
    } else {
      User.createUser({
        name,
        email,
        username,
        password,
        profileImage
      }).then(user => {
        console.log('new user added:\n', user);
        req.flash('success', 'User successfully created. Please login to begin.')
        res.redirect('/');
      }).catch(err => {
        console.error('error adding new user:\n', err);
        const fields = fieldNames.reduce((fields, field) => {
          fields[field] = {value: req.body[field]};
          return fields;
        }, {});
        req.flash('danger', 'There was an issue contacting the server. Please try again later.');
        res.render('register', { fields });
      });
    }
  }
);

module.exports = router;

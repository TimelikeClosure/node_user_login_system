"use strict";
const { requirePath, PATHS } = require('../paths');
const express = require('express');
const router = express.Router();
const upload = requirePath(PATHS.includes, 'upload');
const { body, sanitizeBody, validationResult, createValidationChain } = requirePath(PATHS.includes, 'validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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
    if(errors.isEmpty()){
      console.log('there were no registration form errors');
    } else {
      console.log('the following registration form errors occured:');
      console.log(errors.array().map(value => JSON.stringify(value)).join('\n'));
    }
  }
);

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;

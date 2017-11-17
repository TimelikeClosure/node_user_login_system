"use strict";
const { requirePath, PATHS } = require('../paths');
const express = require('express');
const router = express.Router();
const upload = requirePath(PATHS.includes, 'upload');
const { validationResult, bodyFieldsExist, bodyFieldsTrim, bodyFieldsNonEmpty } = requirePath(PATHS.includes, 'validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', upload.single('profile_image'), bodyFieldsExist([
  'name', 'email', 'username', 'password', 'password_confirm'
]), bodyFieldsTrim([
  'name', 'email', 'username'
]), bodyFieldsNonEmpty([
  'name', 'email', 'username', 'password'
]), [
  /* body('password_confirm', 'both passwords must match')
    .equals(matchedData(req, {locations: ['body']}).password) */
], function(req, res, next) {
  const {name, email, username, password, password_confirm} = req.body;
  if (req.file){
    console.log('Uploading file');
    var profileImage = req.file.filename;
  } else {
    console.log('No file uploaded');
    var profileImage = 'noimage.jpg';
  }

  // Form Validation


  // Check Errors
  const errors = validationResult(req);
  if(errors.isEmpty()){
    console.log('there were no registration form errors');
  } else {
    console.log('the following registration form errors occured:');
    console.log(JSON.stringify(errors.array()));
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;

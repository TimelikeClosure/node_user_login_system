"use strict";
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

module.exports = {
    check,
    validationResult,
    matchedData,
    sanitize
};
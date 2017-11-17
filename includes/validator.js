"use strict";
const { check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize, sanitizeBody } = require('express-validator/filter');

const bodyFieldsExist = fields => fields.map(field => (
    body(field, `No ${field} provided`).exists()
));

const bodyFieldsTrim = fields => fields.map(field => (
    sanitizeBody(field).trim()
));

const bodyFieldsNonEmpty = fields => fields.map(field => (
    body(field, `No ${field} provided`).not().isEmpty()
));

module.exports = {
    check,
    body,
    validationResult,
    matchedData,
    sanitize,
    sanitizeBody,
    bodyFieldsExist,
    bodyFieldsTrim,
    bodyFieldsNonEmpty
};
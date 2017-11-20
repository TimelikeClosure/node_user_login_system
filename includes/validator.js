"use strict";
const { check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize, sanitizeBody } = require('express-validator/filter');
const flow = require('lodash/fp/flow');

const createValidationChain = field => {
    const chain = [];

    validationChain.nonEmpty = () => {
        chain.push(chain => (
            chain
                .exists().withMessage(`No ${field} provided`)
                .not().isEmpty().withMessage(`No ${field} provided`)
        ));
        return validationChain;
    }

    validationChain.isLength = options => {
        chain.push(chain => {
            if (options.hasOwnProperty('min') && options.min > 0){
                chain = chain.isLength({min: options.min}).withMessage(`${field} must be at least ${options.min} characters long`);
            }
            if (options.hasOwnProperty('max') && options.max < Infinity){
                chain = chain.isLength({max: options.max}).withMessage(`${field} must be no more than ${options.max} characters long`);
            }
            return chain;
        });
        return validationChain;
    };

    validationChain.isName = () => {
        chain.push(
            chain => chain.matches(/^[^\x00-\x1F\x7F\"\'\\]*$/).withMessage(`${field} can contain only printable characters other than ", ', \\`)
        );
        validationChain.isLength({min: 2, max: 64});
        return validationChain;
    };

    validationChain.isEmail = () => {
        chain.push(
            chain => chain.isEmail().withMessage(`${field} is not a valid email address`)
        );
        return validationChain;
    };

    validationChain.isUsername = () => {
        chain.push(
            chain => chain.isAlphanumeric().withMessage(`${field} can contain only alphanumeric characters`)
        );
        validationChain.isLength({min: 8, max: 32});
        return validationChain;
    };

    validationChain.isPassword = () => {
        chain.push(
            chain => chain.matches(/^[a-z0-9\-_\.]*$/i).withMessage(`${field} can only contain alphanumeric characters or -, _, .`)
        );
        validationChain.isLength({min: 10, max: 64});
        return validationChain;
    };

    validationChain.matchesField = (matchField, location) => {
        chain.push(
            chain => (
                chain
                    .custom((value, {req}) => value === req[location][matchField])
                    .withMessage(`${matchField} and ${field} must match`)
            )
        );
        return validationChain;
    };

    return validationChain;

    function validationChain(chainBase){
        return flow(chain)(chainBase(field));
    }
};

module.exports = {
    check,
    body,
    validationResult,
    matchedData,
    sanitize,
    sanitizeBody,
    createValidationChain
};
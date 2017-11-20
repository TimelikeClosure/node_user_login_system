"use strict";
const { check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize, sanitizeBody } = require('express-validator/filter');
const flow = require('lodash/fp/flow');

const createValidationChain = field => {
    const chain = [];

    validationChain.nonEmpty = function(){
        chain.push(chain => (
            chain
                .exists().withMessage(`No ${field} provided`)
                .not().isEmpty().withMessage(`No ${field} provided`)
        ));
        return this;
    }

    validationChain.isLength = function(options){
        if (options.hasOwnProperty('min') && options.min > 0){
            chain.push(chain => (
                chain.isLength({min: options.min}).withMessage(`${field} must be at least ${options.min} characters long`)
            ));
        }
        if (options.hasOwnProperty('max') && options.max < Infinity){
            chain.push(chain => (
                chain.isLength({max: options.max}).withMessage(`${field} must be no more than ${options.max} characters long`)
            ));
        }
        return this;
    };

    validationChain.isName = function(){
        chain.push(
            chain => chain.matches(/^[^\x00-\x1F\x7F\"\'\\]*$/).withMessage(`${field} can contain only printable characters other than ", ', \\`)
        );
        this.isLength({min: 2, max: 64});
        return this;
    };

    validationChain.isEmail = function(){
        chain.push(
            chain => chain.isEmail().withMessage(`${field} is not a valid email address`)
        );
        return this;
    };

    validationChain.isUsername = function(){
        chain.push(
            chain => chain.isAlphanumeric().withMessage(`${field} can contain only alphanumeric characters`)
        );
        this.isLength({min: 8, max: 32});
        return this;
    };

    validationChain.isPassword = function(){
        chain.push(
            chain => chain.matches(/^[a-z0-9\-_\.]*$/i).withMessage(`${field} can only contain alphanumeric characters or -, _, .`)
        );
        this.isLength({min: 10, max: 64});
        return this;
    };

    validationChain.matchesField = function(matchField, location){
        chain.push(
            chain => (
                chain
                    .custom((value, {req}) => value === req[location][matchField])
                    .withMessage(`${matchField} and ${field} must match`)
            )
        );
        return this;
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
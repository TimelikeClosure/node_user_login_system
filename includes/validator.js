"use strict";
const { check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize, sanitizeBody } = require('express-validator/filter');
const flow = require('lodash/fp/flow');

const createValidationChain = field => {
    const pipeline = [];

    validationChain.nonEmpty = function(){
        pipeline.push(chain => (
            chain
                .exists().withMessage(`${field} is required`)
                .not().isEmpty().withMessage(`${field} is required`)
        ));
        return this;
    }

    validationChain.isLength = function(options){
        if (options.hasOwnProperty('min') && options.min > 0){
            pipeline.push(chain => (
                chain.isLength({min: options.min}).withMessage(`${field} must be at least ${options.min} characters long`)
            ));
        }
        if (options.hasOwnProperty('max') && options.max < Infinity){
            pipeline.push(chain => (
                chain.isLength({max: options.max}).withMessage(`${field} must be no more than ${options.max} characters long`)
            ));
        }
        return this;
    };

    validationChain.isName = function(){
        pipeline.push(
            chain => chain.matches(/^[^\x00-\x1F\x7F\"\'\\]*$/).withMessage(`${field} can contain only printable characters other than ", ', \\`)
        );
        this.isLength({min: 2, max: 64});
        return this;
    };

    validationChain.isEmail = function(){
        pipeline.push(
            chain => chain.isEmail().withMessage(`${field} is not a valid email address`)
        );
        return this;
    };

    validationChain.isUsername = function(){
        pipeline.push(
            chain => chain.isAlphanumeric().withMessage(`${field} can contain only alphanumeric characters`)
        );
        this.isLength({min: 8, max: 32});
        return this;
    };

    validationChain.isPassword = function(){
        pipeline.push(
            chain => chain.matches(/^[a-z0-9\-_\.]*$/i).withMessage(`${field} can only contain alphanumeric characters or -, _, .`)
        );
        this.isLength({min: 10, max: 64});
        return this;
    };

    validationChain.matchesField = function(matchField, location){
        pipeline.push(
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
        pipeline.unshift(chainBase);
        return flow(pipeline)(field);
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
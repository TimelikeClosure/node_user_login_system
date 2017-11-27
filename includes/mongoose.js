"use strict";
const { requirePath, PATHS } = require('../paths');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

{
    const { uri, options } = requirePath(PATHS.config, 'mongoose');
    mongoose.connect(uri, options).then(function(){
        console.log('database connected\n');
    }).catch(function(err){
        console.error('mongoose connection err: ', err);
    });
}

module.exports = mongoose;
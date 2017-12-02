"use strict";
const { requirePath, PATHS } = require('../paths');
const target = requirePath(PATHS.config, 'encryption');

const keys = Object.freeze(["validate", "encrypt"]);

const encryption = new Proxy(target, {
    getPrototypeOf: function(){ return null },
    setPrototypeOf: function(){ return false },
    isExtensible: function(){ return false },
    preventExtensions: function(){ return false },
    getOwnPropertyDescriptor: function(){},
    defineProperty: function(){ return false },
    has: function(target, prop){ return keys.includes(prop) },
    get: function(target, prop){
        if (keys.includes(prop)){
            return target[prop];
        }
    },
    set: function(target, prop){
        return false;
    },
    deleteProperty: function(){ return false },
    ownKeys: function(target){ return keys.slice() }
});

module.exports = exports = encryption;
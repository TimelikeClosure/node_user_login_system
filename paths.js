"use strict";
const path = require('path');
const PATHS = Object.freeze({
    assets: path.join(__dirname, 'public/assets'),
    config: path.join(__dirname, 'config'),
    client: path.join(__dirname, 'public'),
    includes: path.join(__dirname, 'includes'),
    models: path.join(__dirname, 'models'),
    routes: path.join(__dirname, 'routes'),
    views: path.join(__dirname, 'views')
});
const requirePath = function(...args){
    return require(path.join(...args));
}

module.exports = {
    PATHS,
    path,
    requirePath
};
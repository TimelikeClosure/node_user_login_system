"use strict";
const { requirePath, PATHS } = require('../paths');
const mongoose = requirePath(PATHS.includes, 'mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileImage: {
        type: String,
        default: 'noimage.jpg'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
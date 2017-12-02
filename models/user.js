"use strict";
const { requirePath, PATHS } = require('../paths');
const mongoose = requirePath(PATHS.includes, 'mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: 'noimage.jpg'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
"use strict";
const { requirePath, PATHS } = require('../paths');
const mongoose = requirePath(PATHS.includes, 'mongoose');
const { encrypt } = requirePath(PATHS.includes, 'encryption');

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

User.createUser = function(newUser){
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(`User creation timeout`));
        }, 10000);
        encrypt(newUser.password).catch(err => {
            clearTimeout(timeout);
            reject(new Error(`Password encryption error: ${err}`));
        }).then(hash => {
            newUser = Object.assign({}, newUser);
            newUser.password = hash;
            (new User(newUser)).save().catch(err => {
                clearTimeout(timeout);
                reject(new Error(`User creation error: ${err}`));
            }).then(user => {
                clearTimeout(timeout);
                resolve(user);
            });
        });
    });
}

module.exports = User;
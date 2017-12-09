"use strict";
const { requirePath, PATHS } = require('../paths');
const mongoose = requirePath(PATHS.includes, 'mongoose');
const { encrypt } = requirePath(PATHS.includes, 'encryption');
const Timeout = requirePath(PATHS.includes, 'timeout');

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
        const timeout = new Timeout(() => reject(new Error(`User creation timeout`)), 10000);
        const rejectHandler = timeout.ifActive(err => (
            reject(new Error(`User creation error: ${err}`))
        ), true);

        encrypt(newUser.password).then(
            timeout.ifActive(hash => {
                newUser = Object.assign({}, newUser);
                newUser.password = hash;
                (new User(newUser)).save().then(
                    timeout.ifActive(user => resolve(user))
                ).catch(rejectHandler);
            })
        ).catch(rejectHandler);
    });
};

module.exports = exports = User;
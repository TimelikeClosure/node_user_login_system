"use strict";
const { requirePath, PATHS } = require('../paths');
const mongoose = requirePath(PATHS.includes, 'mongoose');
const { encrypt, validate } = requirePath(PATHS.includes, 'encryption');
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

User.validateUser = function(username, password){
    return new Promise((resolve, reject) => {
        const timeout = new Timeout(() => reject(new Error(`User validation timeout`)), 10000);
        const rejectHandler = timeout.ifActive(err => (
            reject(new Error(`User validation error: ${err}`))
        ), true);

        this.findOne({username: username}).exec().then(
            timeout.ifActive(user => {
                if (user === null){
                    timeout.clear();
                    return resolve(null);
                }
                validate(password, user.password).then(
                    timeout.ifActive(isValid => isValid ? resolve(user) : resolve(null))
                ).catch(rejectHandler);
            })
        ).catch(rejectHandler);
    });
};

User.getUserById = function(username, done){
    done(null, false);
};

module.exports = exports = User;
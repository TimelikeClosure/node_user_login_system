"use strict";
const { requirePath, PATHS } = require('../paths');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = requirePath(PATHS.models, 'user');

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.getUserById(id).then(user => {
        if (user === null){
            console.log('User is anonymous');
            done(null, false);
        }
        console.log('User currently logged in: ', user);
        done(null, user);
    }).catch(err => done(err, false));
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password, done){
    User.validateUser(username, password).then(user => {
        if (user === null){
            return done(null, false, {message: 'Invalid username or password.'})
        }
        return done(null, user, {message: 'Successfully logged in.'});
    }).catch(err => done(err, false));
}));

module.exports = exports = passport;
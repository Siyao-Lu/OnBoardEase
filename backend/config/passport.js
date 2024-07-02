const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
require('dotenv').config();
const keys = process.env.SECRET_OR_KEY;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id).then
                (user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email: email }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (isMatch) {
                        return done(null, user);
                    }
                    return done(null, false, { message: 'Incorrect password.' });
                });
            })
                .catch(err => console.log(err));
        })
    );
};
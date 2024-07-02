const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    User.findOne({ email: email }).then(user => {
        if (user) {
            return res.status(400).json({ message: 'Email already exists.' });
        } else {
            const newUser = new User({
                username,
                email,
                password,
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = { id: user.id, username: user.username };
                jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: 3600 }, (err, token) => {
                    res.json({ success: true, token: 'Bearer ' + token });
                });
            } else {
                return res.status(400).json({ message: 'Password incorrect.' });
            }
        });
    });
});

// protected, get user session information
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
    });
});


module.exports = router;


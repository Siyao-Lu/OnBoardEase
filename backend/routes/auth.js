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
                    if (err) return res.status(500).json({ message: 'Error hashing password' });
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.status(201).json({
                            message: 'User created', user: {
                                id: user.id,
                                username: user.username,
                                email: user.email
                            }
                        }))
                        .catch(err => res.status(500).json({ message: 'Error saving user' }));
                });
            });
        }
    }).catch(err => res.status(500).json({ message: 'Error checking user' }));
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
                    res.json({
                        message: 'Successful login', token: 'Bearer ' + token, user: {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        }
                    });
                });
            } else {
                return res.status(400).json({ message: 'Password incorrect.' });
            }
        }).catch(err => res.status(500).json({ message: 'Error checking password' }));
    }).catch(err => res.status(500).json({ message: 'Error checking user' }));
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


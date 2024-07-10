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
                status: 'pending',
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) return res.status(500).json({ message: 'Error hashing password' });
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.status(201).json({
                            message: 'User created successfully. Awaiting admin approval. Please check back later.',
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                status: user.status,
                            }
                        }))
                        .catch(err => res.status(500).json({ message: 'Error saving user' }));
                });
            });
        }
    }).catch(err => res.status(500).json({ message: 'Error checking user' }));
});

// login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });
        if (user.status !== 'approved') return res.status(400).json({ message: 'Your account is not approved yet.' });
        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ message: 'Error logging in' });
            const payload = { id: user.id, username: user.username };
            jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: 3600 }, (err, token) => {
                if (err) return res.status(500).json({ message: 'Error generating token' });
                res.json({
                    message: 'Login successful.',
                    token: 'Bearer ' + token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    }
                });
            });
        });
    })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logged out successfully.' });
});

// protected, get user session information
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
    });
});


module.exports = router;


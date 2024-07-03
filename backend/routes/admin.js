const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// get all pending users
router.get('/pending', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const pendingUsers = await User.find({ status: 'pending' });
        res.json(pendingUsers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// approve
router.post('/approve', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const { userId, role } = req.body;
    console.log('Approving user:', userId, 'with role:', role);
    if (!userId || !role) {
        console.error('User ID and role are required');
        return res.status(400).json({ message: 'User ID and role are required' });
    }
    User.findByIdAndUpdate(userId, { status: 'approved', role: role }, { new: true }).then(user => {
        res.json(user);
    }).catch(err => {
        console.error('Error approving user:', err);
        res.status(500).json({ message: 'Error approving user' });
    });
});

module.exports = router;
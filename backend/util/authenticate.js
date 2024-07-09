// validate user request to project and resource endpoints
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    console.log("backend token:", token);
    try {
        const decoded = jwt.verify(token, process.env.SECRET_OR_KEY);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found with the token' });
        console.log("backend user:", user);
        req.user = user;
        // console.log("Request:", req);
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Error verifying token' });
    }
};

module.exports = authenticate;
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authenticate = require('../util/authenticate');
const User = require('../models/User');

// create project
router.post('/', authenticate, async (req, res) => {
    const { name, members, tasks, startTime, endTime } = req.body;
    try {
        const project = new Project({
            name,
            manager: req.user._id,
            members,
            tasks,
            startTime,
            endTime
        });
        await project.save();
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
});

// get list of all members
router.get('/get-members', authenticate, async (req, res) => {
    try {
        console.log("Tring to get members");
        const members = await User.find({ role: 'member' }, 'username email _id');
        console.log("Members: ", members);
        res.json(members);
    } catch (error) {
        console.error("Error fetching members: ", error);
        res.status(500).json({ message: 'Error fetching members', error });
    }
});

// get projects for logged in manager
router.get('/manager', authenticate, async (req, res) => {
    try {
        const projects = await Project.find({ manager: req.user._id }).populate('members', 'username email').populate('manager', 'username email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

// get projects for logged in member
router.get('/member', authenticate, async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user._id }).populate('members', 'username email').populate('manager', 'username email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

module.exports = router;
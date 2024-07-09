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
        let projects = await Project.find({ manager: req.user._id });
        console.log("Before populate: ", projects);

        projects = await Project.populate(projects, [
            { path: 'members', select: 'username email' },
            { path: 'manager', select: 'username email' }
        ]);

        console.log("After populate: ", projects);
        projects.forEach(project => {
            console.log("Project Members:");
            project.members.forEach(member => {
                console.log("Member: ", member);
            });
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

// get projects for logged in member
router.get('/member', authenticate, async (req, res) => {
    try {
        let projects = await Project.find({ members: req.user._id });
        console.log("Before populate: ", projects);

        projects = await Project.populate(projects, [
            { path: 'members', select: 'username email' },
            { path: 'manager', select: 'username email' }
        ]);

        console.log("After populate: ", projects);
        projects.forEach(project => {
            console.log("Project Members:");
            project.members.forEach(member => {
                console.log("Member: ", member);
            });
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

module.exports = router;
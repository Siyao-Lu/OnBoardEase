const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const authenticate = require('../util/authenticate');

// create resource
router.post('/', authenticate, async (req, res) => {
    console.log("Request: ", req.body);
    const { resources } = req.body; // Expecting an array of resources
    console.log("Posting resources: ", resources);
    try {
        const createdResources = await Resource.insertMany(resources);
        res.status(201).json({ message: 'Resources created successfully', resources: createdResources });
    } catch (error) {
        res.status(500).json({ message: 'Error creating resources', error });
    }
});

// get all resources
router.get('/', authenticate, async (req, res) => {
    const { name } = req.query;
    try {
        const resources = await Resource.find({ name: { $regex: name, $options: 'i' } });
        const uniqueResources = [...new Map(resources.map(item => [item.name, item])).values()];
        res.json(uniqueResources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error });
    }
});

module.exports = router;
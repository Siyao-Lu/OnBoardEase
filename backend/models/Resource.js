const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
    name: { type: String, required: true },
    link: { type: String, required: true }
});

module.exports = mongoose.model('Resource', ResourceSchema);
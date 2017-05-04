var mongoose = require('mongoose');

exports.DashboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String},
    description: { type: String},
    active: { type: Boolean },
    created: { type: Date },
    updated: { type: Date }
});

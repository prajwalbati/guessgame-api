'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    'username': {type: String},
    'type': {type: String},
    'created_at': { type: Date, default: Date.now },
    'updated_at': { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
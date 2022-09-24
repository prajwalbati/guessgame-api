'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let gameSchema = new Schema({
    'status': {type: String, default: 'active'},
    'created_at': { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
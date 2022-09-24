'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let gameRoundSchema = new Schema({
    'game_id': {type: Schema.Types.ObjectId, ref: 'Game'},
    'round': {type: Number},
    'secret_number': {type: Number},
    'created_at': { type: Date, default: Date.now },
    'updated_at': { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameRound', gameRoundSchema);
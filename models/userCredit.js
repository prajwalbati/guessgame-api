'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userCreditSchema = new Schema({
    'game_id': {type: Schema.Types.ObjectId, ref: 'Game'},
    'round_id': {type: Schema.Types.ObjectId, ref: 'GameRound'},
    'user_id': {type: Schema.Types.ObjectId, ref: 'User'},
    'guessed_number': {type: Number},
    'final_credit': {type: Number},
    'created_at': { type: Date, default: Date.now, index: true },
    'updated_at': { type: Date, default: Date.now }
});

userCreditSchema.index({ created_at: 'date' });

userCreditSchema.set('toObject', { virtuals: true });
userCreditSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserCredit', userCreditSchema);
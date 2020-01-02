'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({

    // _id
    bairro: {
        type: String,
        required: true,
        trim: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    cidades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cidade',
    }]
}, { versionKey: false });

module.exports = mongoose.model('Score', ScoreSchema);
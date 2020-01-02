'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cidadeSchema = new Schema({

    // _id
    name: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        required: false
    },
    image: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = mongoose.models.Cidade || mongoose.model('Cidade', cidadeSchema);
'use strict'
const mongoose = require('mongoose');
const Cidade = mongoose.model('Cidade');

exports.get = async() => {
    const res = await Cidade.find({}, 'name image');
    return res;
}


exports.getById = async(id) => {
    const res = await Cidade
        .findById(id);
    return res;
}

exports.getByTag = async(tag) => {
    const res = await Cidade
        .find({
            tags: tag,
            active: true
        }, 'name image');
    return res;
}

exports.create = async(data) => {
    var cidade = new Cidade(data);
    await cidade.save();
}

exports.update = async(id, data) => {
    await Cidade
        .findByIdAndUpdate(id, {
            $set: {
                name: data.name
            }
        });


}

exports.delete = async(id) => {
    await Cidade
        .findOneAndRemove(id)
}
'use strict'
const mongoose = require('mongoose');
const Score = mongoose.model('Score');

// exports.get = async() => {
//     const res = await Tourism.find({
//         active: true
//     }, 'title subtitle description image Score');
//     return res;
// }

exports.get = async() => {
    const res = await Score.find({}, 'title subtitle description image bairro');
    return res;
}

exports.getById = async(id) => {
    const res = await Score
        .findById(id);
    return res;
}

exports.getByTag = async(tag) => {
    const res = await Score
        .find({
            tags: tag,
            active: true
        }, 'title subtitle description image bairro');
    return res;
}

exports.create = async(data) => {
    var score = new Score(data);
    await score.save();
}


exports.update = async(id, data) => {
    await Score
        .findByIdAndUpdate(req.params.id, {
            $set: {
                bairro: req.data.bairro,
                title: req.data.title,
                subtitle: req.data.subtitle,
                description: req.data.description,
                image: req.data.image
            }
        })
}

exports.delete = async(id) => {
    await Score
        .findOneAndRemove(id)
}
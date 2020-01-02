'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/ScoreRepository');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');
const Score = require('../models/Score');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, image);
    },
    filename: (req, files, cb) => {
        cb(null, files.originalname);
    }
});

var upload = multer({ storage: storage }).array("image");

exports.get = async(req, res, next) => {
    Score.find().exec((err, scores) => {
        if (err)
            res.status(500).send({
                message: 'Falha ao processar sua requisição'
            });
        else
            res.status(200).send(scores);
    })
}

exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.getByTag = async(req, res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}
exports.post = (req, res, next) => {
    upload(req, res, (err) => {
        let contract = new ValidationContract();
        contract.hasMinLen(req.body.bairro, 3, 'O título deve conter pelo menos 3 caracteres');

        // Se os dados forem inválidos
        if (!contract.isValid()) {
            res.status(400).send(contract.errors()).end();
            return;
        }

        try {
            // Cria o Blob Service
            const blobSvc = azure.createBlobService(config.containerConnectionString);


            let filename = guid.raw().toString() + '.jpg';
            let rawdata = req.body.image;
            let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let type = matches[1];
            let buffer = new Buffer.from(matches[2], 'base64');

            // Salva a imagem
            blobSvc.createBlockBlobFromText('cidades-images', filename, buffer, {
                contentType: type
            }, function(error, result, response) {
                if (error) {
                    filename = 'default-cidades.png'
                }
            });

            repository.create({
                bairro: req.body.bairro,
                title: req.body.title,
                subtitle: req.body.subtitle,
                description: req.body.description,

                // active: true,
                image: 'https://travelrs.blob.core.windows.net/cidades-images/' + filename,
                cidades: req.body.cidades

            });
            res.status(201).send({
                message: 'Cidade cadastrado com sucesso!'
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({
                message: 'Falha ao processar sua requisição'
            });




        }
    })

};


exports.put = async(req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};



exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};


// router.delete('/:id', async(req, res) => {
//     try {
//         let id = req.params.id;
//         let prods = await Cidade.find({ cidades: id }).exec();
//         if (prods.length > 0) {
//             res.status(500).send({
//                 msg: 'Could not remove this department. You may have to fix its dependencies before.'
//             })
//         } else {
//             await Cidade.deleteOne({ _id: id });
//             res.status(200).send({});
//         }
//     } catch (err) {
//         res.status(500).send({ msg: "Internal error.", error: err })
//     }
// })
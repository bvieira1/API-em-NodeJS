'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/CidadeRepository');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');
const Cidade = require('../models/Cidade');



// exports.get = async(req, res, next) => {
//     try {
//         var data = await repository.get();
//         res.status(200).send(data);
//     } catch (e) {
//         res.status(500).send({
//             message: 'Falha ao processar sua requisição'
//         });
//     }
// }

exports.get = async(req, res, next) => {
    Cidade.find().exec((err, cids) => {
        if (err)
            res.status(500).send({
                message: 'Falha ao processar sua requisição'
            });
        else
            res.status(200).send(cids);
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

// exports.post = async(req, res, next) => {
//     let contract = new ValidationContract();
//     contract.hasMinLen(req.body.name, 3, 'O título deve conter pelo menos 3 caracteres');

//     // Se os dados forem inválidos
//     if (!contract.isValid()) {
//         res.status(400).send(contract.errors()).end();
//         return;
//     }

//     try {
//         // Cria o Blob Service
//         const blobSvc = azure.createBlobService(config.containerConnectionString);


//         let filename = guid.raw().toString() + '.jpg';
//         let rawdata = req.body.image;
//         let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
//         let type = matches[1];
//         let buffer = new Buffer(matches[2], 'base64');

//         // Salva a imagem
//         await blobSvc.createBlockBlobFromText('cidades-images', filename, buffer, {
//             contentType: type
//         }, function(error, result, response) {
//             if (error) {
//                 filename = 'default-cidades.png'
//             }
//         });

//         await repository.create({
//             name: req.body.name,
//             // active: true,
//             image: 'https://travelrs.blob.core.windows.net/cidades-images/' + filename
//         });
//         res.status(201).send({
//             message: 'Cidade cadastrado com sucesso!'
//         });
//     } catch (e) {
//         console.log(e);
//         res.status(500).send({
//             message: 'Falha ao processar sua requisição'
//         });
//     }
// };

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O título deve conter pelo menos 3 caracteres');

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
        let buffer = new Buffer(matches[2], 'base64');

        // Salva a imagem
        await blobSvc.createBlockBlobFromText('cidades-images', filename, buffer, {
            contentType: type
        }, function(error, result, response) {
            if (error) {
                filename = 'default-cidades.png'
            }
        });

        await repository.create({
            name: req.body.name,
            // active: true,
            image: 'https://travelrs.blob.core.windows.net/cidades-images/' + filename

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

// router.patch('/:id', (req, res) => {
//     Department.findById(req.params.id, (err, dep) => {
//         if (err)
//             res.status(500).send(err);
//         else if (!dep)
//             res.status(404).send({});
//         else {
//             dep.name = req.body.name,
//                 dep.image = req.body.image;
//             dep.save()
//                 .then((d) => res.status(200).send(d))
//                 .catch((e) => res.status(500).send(e));
//         }
//     })
// })



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
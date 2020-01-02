'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/CidadeController');
const authService = require('../services/auth-service');
var AuthController = require('../controllers/AuthController');

// router.get('/', controller.get);
// router.get('/admin/:id', controller.getById);
// router.get('/tags/:tag', controller.getByTag);
// // router.post('/', authService.isAdmin, controller.post);
// router.post('/', controller.post);
// router.put('/:id', authService.isAdmin, controller.put);
// router.delete('/:id', authService.isAdmin, controller.delete);

// router.use(AuthController.check_token);
router.get('/', controller.get);
router.get('/admin/:id', controller.getById);
router.get('/tags/:tag', controller.getByTag);
router.post('/', controller.post);
router.put('/:id', controller.put);
// router.delete('/', authService.isAdmin, controller.delete);
router.delete('/:id', controller.delete);

module.exports = router;
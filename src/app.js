'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const auth = require('./routes/auth')

const app = express();
const router = express.Router();

// Conecta ao BD
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// Carrega os Models
const Score = require('./models/Score');
const Order = require('./models/order');
const Cidade = require('./models/cidade');
var AuthController = require('./controllers/AuthController');
var cors = require("cors")

// Carregar as Rotas
const indexRoute = require('./routes/index-route');
const ScoreRoute = require('./routes/ScoreRoute');
const CidadeRoute = require('./routes/CidadeRoute.js');


app.use(bodyParser.json({ limit: '550mb' }));
app.use(bodyParser.urlencoded({ limit: '550mb', extended: false }));
app.use(cors({}));

//Habilita o CORS
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:4200");
//     res.header('Access-Control-Allow-Headers', ' X-Requested-With, Content-Type, Accept', 'token'); //Accept, x-access-token
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     next();
// });
// app.use(AuthController.check_token);
app.use('/', indexRoute);
app.use('/Score', ScoreRoute);
app.use('/Cidade', CidadeRoute);
app.use('/auth', auth);

module.exports = app;
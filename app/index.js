
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('../config');
const Routes = require('./routes');

mongoose.connect(config.database, { useMongoClient: true });
app.set('superSecretKey', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

Routes(app);

module.exports = app;
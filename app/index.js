
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('../config');
const User = require('../app/models/user');
const ApiRoutes = require('./routes/api_routes');

mongoose.connect(config.database, { useMongoClient: true });
app.set('superSecret', config.secret); //replace express superSecret with app key
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function (req, res) {
    const nick = new User({
        name: 'nick cerminara',
        password: 'password',
        admin: true
    });

    nick.save(function (err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    })
});

app.use('/api', ApiRoutes);

module.exports = app;
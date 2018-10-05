
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../app/models/user');


var port = process.env.PORT || 3010;
mongoose.connect(config.database, { useMongoClient: true });
app.set('superSecret', config.secret); //replace express superSecret with app key

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.listen(port);
console.log('Magic happens at http://localhost:' + port);

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


app.get('/setup', function (req, res) {
    var nick = new User({
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

//API Routes
var apiRoutes = express.Router();

apiRoutes.post('/auth', function (req, res) {
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Auth failed, User not found'
            });
        } else {
            //check if user matched with database
            if (user.password != req.body.password) {
                res.json({
                    success: false,
                    message: 'Auth failed, User or Password Wrong'
                });
            } else {
                const payload = {
                    admin: user.admin
                };

                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: '1440d'
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                });
            }
        }
    })
});

apiRoutes.use(function (req, res, next) {
    console.log('middleware verify');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //decode the token
    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to auth token'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No Token provided'
        });
    }
});

apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth' });
});

apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

app.use('/api', apiRoutes);

module.exports = app;
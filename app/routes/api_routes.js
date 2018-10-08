const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.use(function (req, res, next) {
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

router.post('/auth', function (req, res, next) {
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

router.get('/', function (req, res, next) {
    res.json({ message: 'Welcome to the coolest API on earth' });
});

router.get('/users', function (req, res, next) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

module.exports = router;

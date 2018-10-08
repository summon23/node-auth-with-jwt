const router = require('express').Router();
const User = require('../../app/models/user');

router.get('/', function (req, res, next) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

router.get('/setup', function (req, res, next) {
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


module.exports = router;

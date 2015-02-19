var express = require('express');
var crypto = require('crypto');
var passport = require('passport');

var router = express.Router();


router.get('/register', function(req, res, next) {
    res.render('auth/register', { title: 'Register Account'});
});

router.post('/register', function(req, res, next){
    if(req.body.username && req.body.password && req.body.confirmation) {

        if(req.body.password != req.body.confirmation) {
            res.render('auth/register', { title: 'Register Account', error: 'Passwords do NOT match!' });
        }

        var users = req.db.get('users');

        users.findOne({username: req.body.username}, function(err, user) {
            if(err) res.render('auth/register', { title: 'Register Account', error: 'Sorry, we could not connect to the database.'});
            if(user) {
                return res.render('auth/register', { title: 'Register Account', error: 'This username is already registered!' });
            } else {
                users.insert({username: req.body.username, password: crypto.createHash('sha256').update(req.body.password).digest('hex')}, function(err, newUser) {
                    console.log("Attempting login with user", newUser);
                    req.login(newUser, function(err){
                        if(err) return next(err);

                        return res.redirect('/');
                    });
                });

            }
        });

    } else {
        res.render('auth/register', { title: 'Register Account', error: 'Missing data!' });
    }
});

// TODO: Remember Me / cookie expiration
// http://stackoverflow.com/questions/15609232/how-to-add-remember-me-to-my-app-with-passport
router.get('/login', function(req, res, next){
   res.render('auth/login');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: 'Failed to verify credentials!' }));

router.get('/logout', function(req, res, next){
    if(req.isAuthenticated()) {
       req.logout();
    }
    res.redirect('/');
});

console.log('Application is running!');

module.exports = router;

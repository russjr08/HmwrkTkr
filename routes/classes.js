var express = require('express');
var router = express.Router();

var Models = require('../models/models')();

function ensureAuthenticated(req, res, next) {

    // do any checks you want to in here

    if (req.isAuthenticated()) {
        return next();
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/auth/login');
}

router.get('/classes/manage', ensureAuthenticated, function(req, res, next) {

    var classDB = req.db.get('classes');

    classDB.find({'owner': req.user.username}, function(err, data) {
        res.render('classes/manage_classes', { title: 'Classes', req: req, classes: data });
    });
});

router.get('/classes/manage/add', ensureAuthenticated, function(req, res) {
   res.render('classes/add', { title: 'Add a Class', req: req });
});

router.get('/classes/detail/:id', ensureAuthenticated, function(req, res, next) {
    if (req.params.id.length != 24) {
        res.sendStatus(400);
        return;
    }
    var classes = req.db.get('classes');
    classes.findOne({_id: req.params.id}, function(err, Class){

       if(err || Class === null || Class.owner != req.user.username) {
           res.status(404);
           next();
           console.log("Couldn't find class: " + req.params.id);
           return;
       }

       res.render('classes/detail', { title: Class.name, Class: Class});
   });
});

module.exports = router;

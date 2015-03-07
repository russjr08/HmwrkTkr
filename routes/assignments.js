var express = require('express');
var router = express.Router();

var Models = require('../models/models')();



function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/auth/login');
}

router.get('/assignments/manage/add', ensureAuthenticated, function(req, res) {
    var classDB = req.db.get('classes');


    classDB.find({'owner': req.user.username}, function(err, data) {
        return res.render('assignments/add', { title: 'Add Assignment', req: req, classes: data });
    });
});

router.post('/assignments/manage/add', ensureAuthenticated, function(req, res) {
    var classDB = req.db.get('classes');

    classDB.findById(req.body.class_id, function(err, Class) {
        // TODO: Validate
        var assign = new Models.Assignment();
        assign.name = req.body.name;
        assign.details = req.body.details;
        assign.completed = false;

        Class.assignments.push(assign);

        classDB.updateById(req.body.class_id, Class, function(err, newClass) {
            return res.redirect('/classes/detail/' + Class._id);

        });

    });

});

module.exports = router;

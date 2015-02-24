var express = require('express');
var router = express.Router();

router.get('/manage/assignments', function(req, res, next) {
    res.render('index', { title: 'Assignments', req: req });
});

module.exports = router;

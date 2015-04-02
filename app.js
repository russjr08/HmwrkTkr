var express = require('express');
var session = require('express-session');
var connect = require('connect');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MongoStore = require('connect-mongo')(session);

var flash = require('connect-flash');

var crypto = require('crypto');

var stylus = require('stylus');

var dbHost = process.env.DBHOST || '127.0.0.1'; // Obviously, replace this with your MongoDB host.
var db = require('monk')(dbHost + ':27017/hmwrktrkr'); // Change port as needed.

var passport = require('passport');
var passportLocal = require('passport-local').Strategy;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport serializing and deserializing sessions

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    var users = db.get('users');
    users.findOne({_id: id}, function(err, user){
        done(err, user);
    });
});

// This tells Passport how to lookup our users and test authentication
passport.use(new passportLocal(function(username, password, done){
    var users = db.get('users');
    users.findOne({username: username}, function(err, user) {
        var hash = crypto.createHash('sha256').update(password).digest('hex');

        if(err) return done(err, null, { message: 'Sorry, we were unable to connect to the database!'});

        if(!user) return done(null, null, { message: 'Invalid credentials!'});

        if(hash === user.password) {
            console.log('Matched user ' + user._id);
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid credentials!'});
        }
    });

}));



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Configure the session store to use MongoDB
app.use(session({
    store: new MongoStore({
        db: 'hmwrktrkr',
        host: dbHost,
        port: '27017'
    }),
    secret: process.env.COOKIE_SECRET || 'kldsfjDFSYfd', // IMPORTANT: Do NOT keep this the default except for development!
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Allow all routes to access the database and Passport
app.use(function(req, res, next){
    req.db = db;
    req.passport = passport;
    next();
});

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var classes = require('./routes/classes');
var assignments = require('./routes/assignments');

app.use('/', routes);
app.use('/', classes);
app.use('/', assignments);
app.use('/auth', auth);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            req: req
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        req: req
    });
});

module.exports = app;

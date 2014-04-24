var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var httpProxy = require('http-proxy');

/* Import own JS files */
var config = require('./config/config');

/* App Setup */
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded());
app.use(cookieParser())
app.use(session({ key: 'orthus', secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


var proxy = httpProxy.createProxyServer({
    target: config.proxiedResource
});

passport.use(new OpenIDStrategy({
    returnURL: config.serverAddress + '/auth/openid/callback',
    profile: true,
    },
    function (identifier, profile, done) {
        return done(null, { identifier: identifier, profile: profile });
    }
));
passport.serializeUser(function (user, done) {
    done(null, { identifier: user.identifier, profile: user.profile });
});

passport.deserializeUser(function (user, done) {
    done(null, { identifier: user.identifier, profile: user.profile });
});

/** Routes **/
app.post('/auth/openid', passport.authenticate('openid'),
  function (req, res) {
      res.redirect('/');
  });
app.get('/auth/openid/callback', passport.authenticate('openid', { failureRedirect: '/login' }), function (req, res) {
    res.redirect(req.session.returnTo || '/');
    res.redirect('/');
});

app.use('/login', express.static(__dirname + '/public/login'));
app.get('/login', function (req, res, next) {
    res.sendfile(__dirname + '/public/login/login.html');
});

app.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/login');
});

app.get('/signup', function (req, res, next) {
    res.redirect('/login');
});


//Anything after this needs to be authenticated
app.use(function (req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.returnTo = req.path;
    res.redirect('/login');
});

app.use(function (req, res, next) {
    proxy.web(req, res);
});

app.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

//Finally start server
app.listen(config.port);
console.log("listening on port: " + config.port);

process.on('uncaughtException', function (exception) {
    debugger;
});
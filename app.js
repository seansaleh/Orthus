var http = require('http');
var express = require('express');
var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var httpProxy = require('http-proxy');

//Import own JS files
var config = require('./config/config');

//App Setup
var app = express();
var proxy = httpProxy.createProxyServer({
    target: config.proxiedResource
});

passport.use(new OpenIDStrategy({
    returnURL: config.serverAddress + '/auth/openid/callback',
    realm: config.serverAddress,
    profile: true,
    },
    function (identifier, profile, done) {
        return done(null, { identifier: identifier, profile: profile });
    }
));


//Routes
app.get('/auth/openid', passport.authenticate('openid'));
app.get('/auth/openid/callback', passport.authenticate('openid', { failureRedirect: '/login' }), function (req, res) {
    res.redirect(req.session.returnTo || '/');
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
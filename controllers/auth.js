var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var config = require('../config/config');

/** Passport Config **/
passport.use(new OpenIDStrategy({
    returnURL: config.serverAddress + '/auth/openid/callback',
    profile: true,
    providerURL: 'https://www.google.com/accounts/o8/id'
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

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.returnTo = req.path;
    res.redirect('/login');
};

/** Routes **/
exports.postOpenID = function (req, res, next) {
    res.redirect('/');
};

exports.getOpenIDCallback = function (req, res, next) {
    res.redirect(req.session.returnTo || '/');
    res.redirect('/');
};

exports.getLogin = function (req, res, next) {
    res.render('login');
};

exports.getLogout = function (req, res, next) {
    req.logout();
    res.redirect('/login');
};

exports.getSignup = function (req, res, next) {
    res.redirect('/login');
};
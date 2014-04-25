var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var config = require('../config/config');
var User = require('../models/User');
var userController = require('./user');

/** Passport Config **/
passport.use(new OpenIDStrategy({
    returnURL: config.openIDReturnURL,
    profile: true,
    providerURL: 'https://www.google.com/accounts/o8/id'
}, function (identifier, profile, done) {
    //Note: After this passport calls into getOpenIDCallback's authenticate callback
    if (!identifier) return done(null, false);
    done(null, { identifier: identifier, profile: profile });
}));

passport.serializeUser(function (user, done) {
    done(null, { identifier: user.identifier, profile: user.profile });
});

passport.deserializeUser(function (user, done) {
    done(null, { identifier: user.identifier, profile: user.profile });
});

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    if (req.url != "/favicon.ico") {
        req.session.returnTo = req.path;
    }
    res.redirect(config.baseURL + 'login');
};

/** Routes **/
exports.postOpenID = function (req, res, next) {
    res.redirect('/');
};

exports.getOpenIDCallback = function (req, res, next) {
    passport.authenticate('openid', function (err, identifierAndProfile, info) {
        //Note: based on current passport.use err will never be called
        if (err) return next(err);
        if (!identifierAndProfile) return res.redirect(config.baseURL + 'login');

        userController.loginOrSignupOpenID(identifierAndProfile.identifier, identifierAndProfile.profile, req, res, next);
    })(req, res, next);
};
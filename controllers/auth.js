var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var PersonaStrategy = require('passport-persona').Strategy;
var config = require( '../config/config' );
var secrets = require( '../config/secrets' );
var User = require('../models/User');
var userController = require('./user');

/** Passport Config **/
passport.use(new GoogleStrategy({
    callbackURL: config.googleCallbackUrl,
    clientID: secrets.clientID,
    clientSecret: secrets.clientSecret
}, function (accessToken, refreshToken, profile, done) {
    //Note: After this passport calls into getGoogleCallback's authenticate callback
    if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) return done(null, false);
    done(null, { identifier: profile.emails[0].value, profile: profile });
}));

passport.use(new PersonaStrategy({
    audience: config.personaAudience
},
function(email, done) {
    if (!email) return done(null, false);
    var emails = [
      {value: email}
    ];
    done(null, {identifier: "persona:" + email, profile: {emails: emails}});
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

/** Middleware **/

exports.isAuthorized = function (req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.isAuthorized) return next();
    if (req.url != "/favicon.ico") {
        req.session.returnTo = req.path;
    }
    res.redirect(config.baseURL + 'login');
};

exports.addAuthHeader = function (req, res, next) {
    if (config.addAuthHeader) {
        if (!req.user.name || !req.user.identifier) return next(new Error("Orthus's User missing name or identifier"));
        if (!req.user.hash) {
            User.getUniqueHash(req.user.identifier, function (hash) {
                addHeader(req, hash);
                return next();
            });
        } else {
            addHeader(req, req.user.hash);
            return next();
        }
    } else {
        return next();
    }

    function addHeader(req, hash) {
        req.headers["Authorization"] = 'Orthus uniqueUser="' + hash + '"';
    }
};

/** Routes **/

exports.getGoogleCallback = function (req, res, next) {
    passport.authenticate('google', function (err, identifierAndProfile, info) {
        //Note: based on current passport.use err will never be called
        if (err) return next(err);
        if (!identifierAndProfile) return res.redirect(config.baseURL + 'login');

        userController.loginOrSignup(identifierAndProfile.identifier, identifierAndProfile.profile, req, res, next);
    })(req, res, next);
};

exports.postPersonaAuthenticate = function (req, res, next) {
  userController.loginOrSignup(req.user.identifier, req.user.profile, req, res, next);
};

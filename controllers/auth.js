var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var PersonaStrategy = require('passport-persona').Strategy;
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

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) return next();
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

exports.postPersonaAuthenticate = function (req, res, next) {
  userController.loginOrSignupOpenID(req.user.identifier, req.user.profile, req, res, next);
};

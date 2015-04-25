var User = require('../models/User');
var config = require('../config/config');
var csrf = require('csurf');

//TODO: Where should this logic live? All in auth controller? Or here?
exports.loginOrSignup = function (identifier, profile, req, res, next) {
    User.findByIdentifier(identifier, function (err, user) {
        if (err) return next(err);
        if (!user || !user.isAuthorized) {
            if (user) {
                console.log("user is:");
                console.log(user);
            }
            //Signup user to request access
            req.session.signUpIdentifier = identifier;
            req.session.signUpProfile = profile;
            return res.redirect(config.baseURL + 'signup');
        } else { //The user is authorized, so log them in
            req.login(user, function (err) {
                if (err) return next(err);
                res.redirect(req.session.returnTo || '/');
            });  
        }
    });
};

function signup(identifier, profile, name, justification) {
    if (!identifier || !profile) return;
    User.create(identifier, profile, name, justification); 
}

/** Routes **/
exports.getLogin = function (req, res, next) {
    res.render('login');
};

exports.getLogout = function (req, res, next) {
    req.logout();
    res.redirect(config.baseURL + 'login');
};

exports.getSignup = function (req, res, next) {
    if (!req.session.signUpProfile) {
        req.flash('errors', { msg: "Failed to sign up. Try linking with google again" });
        return res.redirect(config.baseURL + 'login');
    }
    res.render('signup', {profile: req.session.signUpProfile});
};

exports.postSignup = function (req, res, next) {
    if(!req.session.signUpIdentifier || !req.session.signUpProfile || !req.body.name || !req.body.justification) {
        req.flash('errors', { msg: "Failed to sign up. Maybe you are missing data from the form?"});
        return res.redirect(config.baseURL + 'login');
    }

    signup(req.session.signUpIdentifier, req.session.signUpProfile, req.body.name, req.body.justification);
    req.flash('success', { msg: 'User Account requested. Will require admin approval' });
    res.redirect(config.baseURL + 'login');
};

exports.getAdmin = function (req, res, next) {
    User.all(function (accounts) {
        res.render('admin', { user: req.user, accounts: accounts });
    });
};

exports.postToggleAuthorize = function (req, res, next) {
    User.toggleAuthorize(req.body.identifier);
    res.end();
};

exports.postToggleAdmin = function (req, res, next) {
    User.toggleAdmin(req.body.identifier);
    res.end();
};

exports.admin = function (req, res, next) {
    if (!req.user.isAdmin) {
        req.flash('errors', { msg: 'Not Admin, try logging in as an admin instead' });
        return res.redirect(config.baseURL + 'logout');
    }
    csrf()(req, res, function (err) {
        res.locals._csrf = req.csrfToken();
        next(err);
    });
};
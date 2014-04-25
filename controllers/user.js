var User = require('../models/User');
var config = require('../config/config');


//TODO: Where should this logic live? All in auth controller? Or here?
exports.loginOrSignupOpenID = function (identifier, profile, req, res, next) {
    User.findByIdentifier(identifier, function (err, user) {
        if (err) return next(err);
        if (!user || !user.isAuthorized) {
            //Signup user to request access
            req.session.signUpIdentifier = identifier;
            req.session.signUpProfile = profile;
            return res.redirect(config.signupURL);
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
    res.redirect(config.loginURL);
};

exports.getSignup = function (req, res, next) {
    //debugger;
    res.render('signup', {profile: req.session.signUpProfile});
};

exports.postSignup = function (req, res, next) {
    signup(req.session.signUpIdentifier, req.session.signUpProfile, req.body.name, req.body.justification);
    req.flash('success', { msg: 'User Account requested. Will require admin approval' });
    res.redirect(config.loginURL);
};
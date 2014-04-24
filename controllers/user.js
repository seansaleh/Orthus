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
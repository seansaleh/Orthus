var path = require('path');
var crypto = require('crypto');
var storage = require('node-persist');

storage.initSync({encodeFilename: true, dir: path.join(path.dirname(require.main.filename), "persist")});

var User = function (identifier, profile, name) {
    this.identifier = identifier;
    this.profile = profile;
    this.name = name || profile.displayName;
    this.isAdmin = false;
    this.isAuthorized = false;
};

User.getUniqueHash = function (identifier, callback) {
    var user = storage.getItem(identifier);
    if (!user.hash) {
        user.hash = crypto.createHash('md5').update(identifier).digest('base64');
        storage.setItem(identifier, user);
    }
    callback(user.hash);
};

User.findByIdentifier = function (identifier, callback) {
    return callback(null, storage.getItem(identifier));
};

User.all = function (callback) {
    storage.values(callback);
};

User.toggleAuthorize = function (identifier, callback) {
    var account = storage.getItem(identifier);
    if (account) {
        account.isAuthorized = !account.isAuthorized;
        storage.setItem(identifier, account);
    }
};

User.toggleAdmin = function (identifier, callback) {
    var account = storage.getItem(identifier);
    if (account) {
        account.isAdmin = !account.isAdmin;
        storage.setItem(identifier, account);
    }
};

//TODO: Here make sure we don't overwrite user
User.create = function (identifier, profile, name, justification) {
    if (!identifier || !profile) return;

    var user = storage.getItem(identifier);
    if (!user) {
        user = new User(identifier, profile, name);
    }
    user.justification = justification;
    storage.setItem(identifier, user);
};
module.exports = User;
﻿var storage = require('node-persist');
var path = require('path');
storage.initSync({encodeFilename: true, dir: path.join(path.dirname(require.main.filename), "persist")});

var User = function (identifier, profile, name) {
    this.identifier = identifier;
    this.profile = profile;
    this.name = name || profile.displayName;
    this.isAdmin = false;
    this.isAuthorized = false;
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

User.create = function (identifier, profile, name, justification) {
    if (!identifier || !profile) return;
    var user = new User(identifier, profile, name);
    user.justification = justification;
    storage.setItem(identifier, user);
};
module.exports = User;
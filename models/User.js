var storage = require('node-persist');
storage.initSync({encodeFilename: true});

var User = function (identifier, profile) {
    this.identifier = identifier;
    this.profile = profile;
};

User.findByIdentifier = function (identifier, callback) {
    return callback(null, storage.getItem(identifier));
};

User.create = function (identifier, profile) {
    if (!identifier || !profile) return;
    var user = new User(identifier, profile);
    user.isAuthorized = true;
    storage.setItem(identifier, user);
};
module.exports = User;
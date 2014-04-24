var storage = require('node-persist');
storage.initSync();

function encodeKey(string) { //needed since identifier name can't be written to disk
    return new Buffer(string).toString('base64');
}

var User = function (identifier, profile) {
    this.identifier = identifier;
    this.profile = profile;
};

User.findByIdentifier = function (identifier, callback) {
    return callback(null, storage.getItem(encodeKey(identifier)));
};

User.create = function (identifier, profile) {
    if (!identifier || !profile) return;
    var user = new User(identifier, profile);
    user.isAuthorized = true;
    storage.setItem(encodeKey(identifier), user);
};
module.exports = User;
var usersDB = {};

var User = function (identifier, profile) {
    this.identifier = identifier;
    this.profile = profile;
};

User.prototype.print = function () {
    console.log("TODO");
};

User.findByIdentifier = function (identifier, callback) {
    return callback(null, usersDB[identifier]);
};

User.create = function (identifier, profile) {
    if (!identifier || !profile) return;
    usersDB[identifier] = new User(identifier, profile);
    usersDB[identifier].isAuthorized = true;
};
module.exports = User;
var User = function (identifier) {
    this.identifier = identifier;
};

User.prototype.print = function () {
    console.log("TODO");
};

User.findByIdentifier = function (identifier, callback) {
    var user = new User(identifier);
    user.isAuthorized = true;
    return callback(null, user);
}
module.exports = User;
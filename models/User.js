var path = require( 'path' );
var crypto = require( 'crypto' );
var storage = require( 'node-persist' );

var GoogleWhiteListKey = "GoogleUserWhitelist";
storage.initSync( { encodeFilename: true, dir: path.join( path.dirname( require.main.filename ), "persist" ) } );

var User = function ( identifier, profile, name ) {
    this.identifier = identifier;
    this.profile = profile;
    this.name = name || profile.displayName;
    this.isAdmin = false;
    this.isAuthorized = false;
};

User.getUniqueHash = function ( identifier, callback ) {
    var user = storage.getItem( identifier );
    if ( !user.hash ) {
        user.hash = crypto.createHash( 'md5' ).update( identifier ).digest( 'base64' );
        storage.setItem( identifier, user );
    }
    callback( user.hash );
};

User.findByIdentifier = function ( identifier, callback ) {
    return callback( null, storage.getItem( identifier ) );
};

User.all = function ( callback ) {
    storage.values( function ( values ) {
        callback( values.filter( function ( value ) {
            return value && value.profile && value.profile.emails;
        } ) );
    } );
};

User.toggleAuthorize = function ( identifier ) {
    var account = storage.getItem( identifier );
    if ( account ) {
        account.isAuthorized = !account.isAuthorized;
        storage.setItem( identifier, account );
    } else {
        console.error( "Tried to toggle auth for non existent user" );
    }
};

User.toggleAdmin = function ( identifier, callback ) {
    var account = storage.getItem( identifier );
    if ( account ) {
        account.isAdmin = !account.isAdmin;
        storage.setItem( identifier, account );
    } else {
        console.error( "Tried to toggle admin for non existent user" );
    }
};

//TODO: Here make sure we don't overwrite user
User.create = function ( identifier, profile, name, justification ) {
    if ( !identifier || !profile ) return;
    
    var user = storage.getItem( identifier );
    if ( !user ) {
        user = new User( identifier, profile, name );
        if ( isWhiteListUser( identifier ) ) user.isAuthorized = true;
    }
    user.justification = justification;
    storage.setItem( identifier, user );
    return user;
};

User.whitelistGoogleUser = function ( email ) {
    var whitelist = storage.getItem( GoogleWhiteListKey );
    if ( !whitelist ) whitelist = {};
    whitelist[email] = true;
    storage.setItem( GoogleWhiteListKey, whitelist );
    storage.persistSync( );
}

User.getWhitelist = function () {
    return storage.getItem( GoogleWhiteListKey );
}

User.getWhitelistAsString = function () {
    var dict = storage.getItem( GoogleWhiteListKey );
    var output = "";
    for ( var key in dict ) {
        if ( dict[key] ) {
            output += key + ", ";
        }
    }
    return output;
}

function isWhiteListUser( email ) {
    var whitelist = storage.getItem( GoogleWhiteListKey );
    if ( whitelist[email] ) return true;
    return false;
}

module.exports = User;
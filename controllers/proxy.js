var httpProxy = require( 'http-proxy' );
var config = require( '../config/config' );

var proxy = httpProxy.createProxyServer( {
    target: config.proxiedResource
} );

exports.proxy = function ( req, res, next ) {
    proxy.web( req, res, next );
};

exports.proxyWebSocket = function ( req, socket, head ) {
    proxy.ws( req, socket, head );
};

proxy.on( 'error', function ( err, req, res ) {
    res.writeHead( 500, {
        'Content-Type': 'text/plain'
    } );
    console.error( "error in proxy" );
    console.dir( err );
    res.end( 'Something went wrong, sorry!' );
} );
var httpProxy = require('http-proxy');
var config = require('../config/config');

var proxy = httpProxy.createProxyServer({
    target: config.proxiedResource
});

exports.proxy = function (req, res, next) {
    proxy.web(req, res);
};

exports.proxyWebSocket = function (req, socket, head) {
    proxy.ws(req, socket, head);
};
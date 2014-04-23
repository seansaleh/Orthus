var http = require('http');
var express = require('express');
//var passport = require('passport');
var httpProxy = require('http-proxy');

//Import own JS files
var config = require('./config/config');

//App Setup
var app = express();
var proxy = httpProxy.createProxyServer({
    target: config.proxiedResource
});


//Routes
app.use(function (req, res, next) {
    proxy.web(req, res);
});

app.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

//Finally start server
app.listen(config.port);
console.log("listening on port: " + config.port);
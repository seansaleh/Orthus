var http = require('http');
var config = require('../config/config');

describe('Proxy Tests', function () {
    var proxiedServer;
    var proxyController;
    var proxyServer;
    before(function () {
        proxyController = require('../controllers/proxy');

        proxiedServer = http.createServer(function (req, res) {
            console.log("==Proxied server responding==");
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
            res.end();
        }).listen(8080);

        proxyServer = http.createServer(function (req, res) {
            console.log("==Proxy Server forwarding to proxyController==");
            console.log(config.proxiedResource);
            proxyController.proxy(req, res);
        }).listen(1337);

        console.log("before all done");
    });

    beforeEach(function () {

    });

    it("test", function (done) {
        var request = http.request({ port:1337}, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
            res.on('end', done);
        })
        .on("error", function (e) {
            console.error(e);
            //done(e);
        });
        request.write("test")
        request.end();
    });


});
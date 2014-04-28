var http = require('http');

http.createServer(function (req, res) {
    console.log("Proxied server responding");
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
}).listen(8080);
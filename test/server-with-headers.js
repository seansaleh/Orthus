var http = require('http');

http.createServer(function (req, res) {
    console.log("Proxied server responding");
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(req.method + ' successfully proxied for '+ req.url + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
}).listen(process.env.port || 8080);
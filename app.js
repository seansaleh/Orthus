var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var passport = require('passport');
var httpProxy = require('http-proxy');

/** Import own JS files **/
var config = require('./config/config');
var secrets = require('./config/secrets');
var User = require('./models/User');
var authController = require('./controllers/auth');
var userController = require('./controllers/user.js');
var proxyController = require('./controllers/proxy');

/** App Setup **/
var app = express();
app.use(logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(config.baseURL + 'static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(cookieParser())
app.use(session({ key: 'orthus', secret: secrets.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var server = http.createServer(app.handle.bind(app))

/** Routes **/
app.post(config.baseURL + 'auth/openid', passport.authenticate('openid'));
app.get(config.baseURL + 'auth/openid/callback', authController.getOpenIDCallback);

app.get(config.baseURL + 'login', userController.getLogin);
app.get(config.baseURL + 'logout', userController.getLogout);
app.get(config.baseURL + 'signup', userController.getSignup);
app.post(config.baseURL + 'signup', userController.postSignup);

//Anything after this needs to be authenticated
app.use(authController.isAuthenticated);
app.get(config.baseURL + 'admin', userController.isAdmin, userController.getAdmin);
app.post(config.baseURL + 'admin/toggleAuthorize', userController.isAdmin, userController.postToggleAuthorize);
app.post(config.baseURL + 'admin/toggleAdmin', userController.isAdmin, userController.postToggleAdmin);

server.on('upgrade', proxyController.proxyWebSocket);
app.use(authController.addAuthHeader);
app.use(proxyController.proxy);

app.use(errorHandler());

/** Finally start server **/
server.listen(config.port);
console.log("Orthus listening on port: " + config.port);
console.log("Orthus's openID Callback route is: " + config.openIDReturnURL);
console.log("Orthus is proxying: " + config.proxiedResource);
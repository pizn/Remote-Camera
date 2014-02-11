var config = require(__dirname + '/config/config.js');
var express = require('express');
var swig = require('swig');
var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/webapp'));
app.use(app.router);

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/**
 * Include controllers
 */
var remoteCamera = require(__dirname + '/controllers/camera.js');
remoteCamera.cameraCtrl(app);

/**
 * Include routes
 */
var webapp = require(__dirname + '/routes/all.js');
webapp.createRoutes(app);

/**
 * Include helper
 */
//require(__dirname + '/controllers/helper.js');

app.listen(config.port);
console.log("Server started and listening on port " + config.port);
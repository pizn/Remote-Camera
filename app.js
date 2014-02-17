var config = require(__dirname + '/config/config.js');
var express = require('express');
var swig = require('swig');
var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({secret: config.cookieSecret}));
app.use(app.router);

// Static
app.use(express.static(__dirname + '/publish'));

// Engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Controllers
var user = require(__dirname + '/controllers/login.js');
user.doLoginCtrl(app);

var remoteCamera = require(__dirname + '/controllers/camera.js');
remoteCamera.cameraCtrl(app);

var photos = require(__dirname + '/controllers/watch.js');
photos.watchPhotosCtrl(app);

// Routes
var webapp = require(__dirname + '/routes/all.js');
webapp.createRoutes(app);

// Helper
var address = require(__dirname + '/controllers/ipHelper.js');
address.ipHelperCtrl(app);

// System
var os = require(__dirname + '/controllers/system.js');
os.systemCtrl(app);

exports.server = function() {
    return app;
}

app.listen(config.port);
console.log("[info] Server started and listening on port " + config.port);
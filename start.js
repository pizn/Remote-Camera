var config = require(__dirname + '/config.js');
//var capture = require('webcam-capture');
var RaspiCam = require("raspicam");
var moment = require('moment');
var every = require('schedule').every;
var times;
var camelot = require('camelot');
var spawn = require('child_process').spawn;
var fswebcam = spawn('fswebcam', '-d /dev/video0 -r 320*240 --bottom-banner --title "Hello world!" --no-timestamp /home/pi/tmp/111.jpg');

 fswebcam.on('exit', function (code) {
     console.log('123');
 });


//create a new connection to fswebcam and set some options
/**
var camelot = new camelot({
  'device': '/dev/video0',
  'jpeg': '95',
  'resolution': '320x240'
});

camelot.on('frame', function (image) {
  console.log('frame received!');
});

camelot.on('error', function (err) {
  console.log(err);
});

//initiate camera recording - note: frequency = frames per second
camelot.grab({
  'title': 'Camera1',
  'font': 'Arial:24',
  'frequency': 1
});
**/

var camera = new RaspiCam({
        mode: "photo",
        output: "webapp/photo/image.jpg",
        encoding: "jpg",
        timeout: 0 // take the picture immediately
});
exports.createRoutes = function(app) {
    app.get('/api/start', function(req, res) {
        console.log('doScean');
        //开启定时抓拍
        //doEveryScean();
        var data = {
            'msg': 'done',
            'stat': 'ok'
        }
        res.send(200, data);
    });

    app.get('/api/getPhoto', function(req, res) {
        var data = {
            'msg': 'ooo',
            'stat': 'ok'
        }
        res.send(200, data);
    });

    app.get('/api/cancle', function(req, res) {
        times.stop();
        var data = {
            'msg': 'ooo',
            'stat': 'ok'
        }
        res.send(200, data);
    });


}

function doEveryScean() {
    times = every('10s').do(function() {
        console.log('start');
        camera.on("started", function( err, timestamp ){
                console.log("photo started at " + timestamp );
        });

        camera.on("read", function( err, timestamp, filename ){
                console.log("photo image captured with filename: " + filename );
        });

        camera.on("exit", function( timestamp ){
                console.log("photo child process has exited at " + timestamp );
        });

        camera.start();
    });
}
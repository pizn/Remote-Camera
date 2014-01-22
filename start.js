var config = require(__dirname + '/config.js');
var capture = require('webcam-capture');
var moment = require('moment');
var every = require('schedule').every;
var times;



exports.createRoutes = function(app) {
    app.get('/api/start', function(req, res) {
        console.log('doScean');
        //开启定时抓拍
        doEveryScean();
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
        var spawn = capture({ out: __dirname + '/webapp/picture/me.jpg' });
    });
}
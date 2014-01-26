var config = require(__dirname + '/config.js');
var moment = require('moment');
var spawn = require('child_process').spawn;

exports.createRoutes = function(app) {
    app.get('/api/take', function(req, res) {
        console.log('---> 准备拍照 ----------');
        var title = moment().format('YYYYMMDD-hhmmss-a');
        var param = ["-d", "/dev/video0", "-r", "320*240"];
        param.push("--title");
        param.push(title);
        param.push("--no-timestamp");
        param.push("/home/pi/tmp/" + title + '.jpg');
        var result = {};
        console.log('---> Done');

        console.log('---> 启动进程');
        var fswebcam = spawn('fswebcam', param);
        console.log('---> Done');

        console.log('---> 准备数据');
        fswebcam.on('exit', function () {
            result = {
                'stat': 'ok',
                'id': title
            }
        });
        fswebcam.on('error', function() {
            result = {
                'stat': 'fail'
            }
        });
        if(typeof result.stat === 'undefined') {
            result = {
                'stat': 'fail'
            }
        }
        console.log('---> Done');

        console.log('---> 发送数据');
        res.send(200, result);
        console.log('---> Done     ---------|');
    });
}
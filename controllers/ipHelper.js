/**
 * The helper for help me to get the IP address.
 * Because my router always dynamically allocated
 * ip address.
 */

var config = require('../config/config.js');
/**
 * 由于路由器的ip地址是被服务商定期更换，所以需要获取下
 */
var os=require('os');
var every = require('schedule').every;
var nodemailer = require('nodemailer');
var cheerio = require('cheerio');
var http =  require('http');
var iconv = require('iconv-lite');
var moment = require('moment');
var BufferHelper = require('bufferhelper');
var url = 'http://iframe.ip138.com/ic.asp';

/**
 * 发送邮件
 */
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: config.email,
        pass: config.password
    }
});
var sentMailModule = function(data) {
    var mailOptions = {
        from: "Remote-Camera get the IP Address",
        to: config.sentToMail,
        subject: moment().format('YYYYMMDD-hhmmss-a'),
        text: data
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('[error] Sent email error');
        }else{
            console.log('[info]' + moment().format('YYYYMMDD-hhmmss-a') + " mail send " + response.message);
        }
        //如果还需要实用其他的 smtp 协议，可将当前回话关闭
        smtpTransport.close();
    });
}

/**
 * Get Msg
 */
var getMessageModule = function(url) {
    http.get(url, function(res) {
        var bufferHelper = new BufferHelper();
        var source = "";
        //通过 get 请求获取网页代码 source
        res.on('data', function(data) {
            bufferHelper.concat(data);
        });
        //获取到数据 source，我们可以对数据进行操作了!
        res.on('end', function() {
            // console.log(source);
            var html = iconv.decode(bufferHelper.toBuffer(),'GBK');
            var $ = cheerio.load(html);
            // will be: 您的IP是：[x.x.x.x] 来自：xxx 电信
            var currentData = $("center").html();
            var rounterIP;
            if(currentData !== '') {
                rounterIP = $($(currentData.split('['))[1].split(']'))[0];
            }
            var content = 'Good job! The Remote Camera send you a email! We got the newer IP address, please click http://' + rounterIP + ' to enjoy!';
            sentMailModule(content);
        });
    }).on('error', function() {
        console.log("[error] Get data error!");
    });
}



exports.ipHelperCtrl = function(app) {
    /**
     * get host
     */
    app.get('/api/hostIP', function(req, res) {
        var message = {
            'stat': 'fail',
            'host': ''
        }
        if (!req.session.user) {
            var message = {
                'stat': 'deny'
            }
            res.send(200, message);
            return false;
        }
        var ifaces = os.networkInterfaces();
        var hostIP;
        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details){
                if (details.family === 'IPv4') {
                    hostIP = details.address;
                }
            });
        }
        if(hostIP === "") {
            message = {
                'stat': 'fail',
                'msg': 'System error'
            }
            res.send(200, message);
            return false;
        }
        message = {
            'stat': 'ok',
            'host': hostIP
        }
        res.send(200, message);
        return true;
    });

    /**
     * get rounter
     */
    app.get('/api/rounterIP', function(req, res) {
        var message = {
            'stat': 'fail',
            'host': ''
        }
        if (!req.session.user) {
            var message = {
                'stat': 'deny'
            }
            res.send(200, message);
            return false;
        }
        http.get(url, function(request) {
            var bufferHelper = new BufferHelper();
            var rounterIP = "";
            //通过 get 请求获取网页代码 source
            request.on('data', function(data) {
                bufferHelper.concat(data);
            }).on('end', function() {
                var html = iconv.decode(bufferHelper.toBuffer(),'GBK');
                var $ = cheerio.load(html);
                var currentData = $("center").html();
                if(currentData !== '') {
                    rounterIP = $($(currentData.split('['))[1].split(']'))[0];
                }
                message = {
                    'stat': 'ok',
                    'host': rounterIP
                }
                res.send(200, message);
                return true;
            });
        }).on('error', function() {
            console.log("[error] Get data error!");
            message = {
                'stat': 'fail',
                'msg': 'Get data error!'
            }
            res.send(200, message);
            return false;
        });
    });

    /**
     * 启动定时任务
     */
    every(config.emailTimes).do(function() {
        getMessageModule(url);
    });
}



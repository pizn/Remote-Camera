var config = require(__dirname + '/config.js');
/**
 * 由于路由器的ip地址是被服务商定期更换，所以需要获取下
 */
var every = require('schedule').every;
var nodemailer = require('nodemailer');
var cheerio = require('cheerio');
var http =  require('http');
var iconv = require('iconv-lite');
var moment = require('moment');
var url = 'http://iframe.ip138.com/ic.asp';

/**
 * 发送邮件
 */
//邮件配置
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: config.email,
        pass: config.password
    }
});
var sentMailModule = function(data) {
    //定义参数
    var mailOptions = {
        from: "Remote-Camera get IP ✔ ",       // 发送地址
        to: config.sentToMail, // 接收列表
        subject: moment().format('YYYYMMDD-hhmmss-a'),                             // 邮件主题
        text: data                          // 文本内容
    }
    //发送邮件
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log(moment().format('YYYYMMDD-hhmmss-a') + "邮件已经发送: " + response.message);
        }
        //如果还需要实用其他的 smtp 协议，可将当前回话关闭
        smtpTransport.close();
    });
}

/**
 * 获取的内容
 */
var getMessageModule = function(url) {
    http.get(url, function(res) {
        var source = "";
        //通过 get 请求获取网页代码 source
        res.on('data', function(data) {
            source += data;
        });
        //获取到数据 source，我们可以对数据进行操作了!
        res.on('end', function() {
            //console.log(source);
            var $ = cheerio.load(source);
            var currentData = $("center").html();
            sentMailModule(currentData);
        });
    }).on('error', function() {
        console.log("获取数据出现错误");
    });
}

/**
 * 启动定时任务
 */
every('2h').do(function() {
    getMessageModule(url);
});
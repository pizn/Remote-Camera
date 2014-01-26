# Remote Camera - 远程照相机

通过手机访问「树莓派」上的摄像头，抓拍相片并返回给手机界面的一款 HTML5 轻量级应用。

关键字：树莓派，NodeJS，HTML5，AngularJS，iPhone单页应用。

## 如何实用？

1. npm install .
2. 配置你的个性化信息（修改config.js）

        //端口号
        exports.port = 3000;
        //摄像头驱动位置
        exports.piVedioPath = "/dev/video0";
        //相片尺寸
        exports.pictureXY = "320*240";
        //相片生成地址（需要修改到 webapp/photo/）
        exports.picturePath = "/home/pi/tmp/";

3. 启动应用```node app.js```
4. 手机访问您的服务地址，例如```192.168.1.100:3000```
5. 基本搞定

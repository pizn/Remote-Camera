# Remote Camera - 远程照相机
-------

![Remote Camera](http://www.zhanxin.info/static/picture/2014012703.jpg)

[![building status](https://secure.travis-ci.org/pizn/Remote-Camera.png?branch=master)](https://travis-ci.org/pizn/Remote-Camera)

Remote Camera 是一个使用 NodeJs 控制接入在「树莓派」上的摄像头进行拍照，获取相片并返回给手机界面的一款 HTML5 轻量级 WebApp 应用。

它的主要功能有：

- 控制用户访问的登录功能
- 核心的拍照功能
- 相片集的展示和删除功能
- 动态获取路由器 IP 地址功能

安装所需的依赖
-------

Remote Camera 目前只在 RaspberryPi 上正常运行，并且依赖于 linux 下的抓图工具包 fswebcam，所以在运行之前需要安装 fswebcam。

要想让它跑起来，需要：

- 硬件：RaspberryPi（主机、SD卡、电源）、路由器（包括网线）、摄像头
- 底层：fswebcam、NodeJs

另外，还需要将树莓派接入到路由器中，设置路由器的「虚拟服务器」80端口指向「树莓派」的应用端口（例如3000）。

如何使用
-------

懂得 NodeJs 的同学应该很简单，是吧。

- make install
- make server

更多细节，请详见《<a href="http://www.zhanxin.info/raspberrypi/2014-01-26-raspberrypi-use-nodejs-to-remote-camera.html">远程控制树莓派摄像头拍照</a>》

关于作者
-------

大家好，我是[【掌心】](http://www.zhanxin.info)，欢迎交流。

License
-------

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

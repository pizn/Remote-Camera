/**
 * @name: camera.js
 * @author: zhanxin.lin < pizner@gmail.com >
 * @create: 2014.02
 * @desc: Just for Remote Camera
 */
var remoteCamera = angular.module('RemoteCamera',['ngResource'], function ($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }).config(function($routeProvider) {
        $routeProvider.when("/", {
            controller: remoteCamera.loginCtrl,
            template: document.getElementById('loginView').text
        }).when("/camera", {
            controller: remoteCamera.cameraCtrl,
            template: document.getElementById('cameraView').text
        }).when("/menu", {
            controller: remoteCamera.menuCtrl,
            template: document.getElementById('menuView').text
        }).otherwise({
            redirectTo: "/"
    })
});

// loginCtrl
remoteCamera.controller('loginCtrl', function($scope, $resource, $location) {
    if(connected) {
        return $location.path("/camera");
    }

    $scope.doLogin = function() {
        var values = {
            email: $scope.email,
            password: $scope.password
        }
        $resource('/api/login').save(values, function(data) {
            if(data.stat === 'ok') {
                loginSuccess();
            } else if(data.stat === 'fail') {
                loginError(data.msg);
            } else {
                loginError('Unknow error!');
            }
        }, function() {
            loginFail('Request error!');
        });

        loginSuccess = function() {
            connected = true;
            $location.path("/camera");
        }

        loginError = function(msg) {
            $scope.errorMsg = msg;
            $scope.errorClass = "login-error-show";
        }

    }
});


// cameraCtrl
remoteCamera.controller('cameraCtrl', function($scope, $resource, $location) {
    if(!connected) {
        return $location.path("/");
    }

    $scope.photoInfo = 'Remote Camera';
    $scope.photoStyle = {
        backgroundImage:'url(/images/bg.jpg)'
    };
    /**
     * Take a photo
     */
    $scope.cameraAction = function() {
        delete $scope.cameraErr;
        $scope.photoStyle = {
            backgroundImage:'url(/images/loading.jpg)'
        };
        $scope.doAction = true;
        /**
         *  发起请求，拍照，返回结果
         */
        $resource('/api/take').get(function(data) {
            //塞入图片
            if(data.stat === 'ok') {
                delete $scope.cameraErr;
                var picture = 'url(/photo/' + data.id + '.jpg' + ')';
                $scope.photoStyle = {
                    backgroundImage: picture
                };
                $scope.doAction = false;
            } else if(data.stat === 'fail') {
                $scope.cameraErr = 'Sorry, I can\'t get the photo';
                $scope.doAction = false;
            } else if(data.stat === 'deny') {
                $location.path("/");
            }
        }, function() {
            $scope.cameraErr = 'fail';
            $scope.photoStyle = {
                backgroundImage:'url(/images/error.jpg)'
            };
            $scope.doAction = false;
        });
    }
    /**
     * Show menu
     */
    $scope.openMenu = function() {
        $location.path("/menu");
    }
});

// menuCtrl
remoteCamera.controller('menuCtrl', function($scope, $resource, $location) {
    if(!connected) {
        return $location.path("/");
    }
    /**
     * Take photo
     */
    $scope.takePhoto = function() {
        $location.path('/camera');
    }

    /**
     * Logout
     */
    $scope.doLogout = function() {
        $resource('/api/login').delete({}, function () {
            connected = false;
            $location.path("/");
        });
    }

});
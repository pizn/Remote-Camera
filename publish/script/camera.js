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
        }).when("/photos", {
            controller: remoteCamera.watchPhotosCtrl,
            template: document.getElementById('photosView').text
        }).when("/address", {
            controller: remoteCamera.ipAddressCtrl,
            template: document.getElementById('ipAddressView').text
        }).when("/system", {
            controller: remoteCamera.systemCtrl,
            template: document.getElementById('systemView').text
        }).when("/about", {
            controller: remoteCamera.aboutCtrl,
            template: document.getElementById('aboutView').text
        }).otherwise({
            redirectTo: "/"
    })
});

// loginCtrl
remoteCamera.controller('loginCtrl', function($scope, $resource, $location) {
    if(connected) {
        return $location.path("/menu");
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
            $location.path("/menu");
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

    $scope.photoInfo = '';
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
                $scope.photoInfo = data.id;
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
     * Watch photo
     */
    $scope.watchPhotos = function() {
        $location.path('/photos');
        return true;
    }

    /**
     * Take photo
     */
    $scope.takePhoto = function() {
        $location.path('/camera');
        return true;
    }

    /**
     * ipAddress
     */
    $scope.getIPAddress = function() {
        $location.path('/address');
        return true;
    }

    /**
     * system
     */
    $scope.showSystem = function() {
        $location.path('/system');
        return true;
    }

    /**
     * About
     */
    $scope.showAbout = function() {
        $location.path('/about');
        return true;
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

remoteCamera.controller('watchPhotosCtrl', function($scope, $resource, $location) {

    if(!connected) {
        return $location.path("/");
    }

    $scope.loadingStyle = {
        backgroundImage:'url(/images/loading.jpg)'
    }

    /**
     * Back menu
     */
    $scope.openMenu = function() {
        $location.path("/menu");
    }

    /**
     * Get photos
     */
    $resource('/api/photos').get(function(data) {
        if(data.stat === 'ok') {
            $scope.loadingStyle = {};
            $scope.photos = data.photos;
            $scope.photosLength = data.photos.length;
            if(data.photos.length === 0) {
                $scope.getPhotoResult = 'Wow, please take a photo!'
            }
        } else if(data.stat === 'fail') {
            $scope.getPhotoResult = data.msg;
        } else if(data.stat === 'deny') {
            $location.path("/");
        }
    }, function() {
        $scope.loadingStyle = {
            backgroundImage:'url(/images/error.jpg)'
        }
    });

    /**
     * Delete photo
     */
    $scope.deletePhoto = function(photo) {
        $resource('/api/photos/' + photo.name).delete({}, function(data) {
            if(data.stat === 'ok') {
                delete $scope.getPhotoResult;
                // 巧妙的删除方法
                var indexof = $scope.photos.indexOf(photo);
                $scope.photos.splice(indexof, 1);
                if($scope.photos.length === 0) {
                    $scope.getPhotoResult = 'Wow, please take a photo!'
                }
                $scope.photosLength = $scope.photos.length;
            } else if(data.stat === 'fail') {
                $scope.getPhotoResult = data.msg;
            } else if(data.stat === 'deny') {
                $location.path("/");
            }
        });
    }

});

remoteCamera.controller('ipAddressCtrl', function($scope, $resource, $location) {

    if(!connected) {
        return $location.path("/");
    }

    $scope.hostIP = "0.0.0.0";
    $scope.routerIP = "0.0.0.0";

    $scope.openMenu = function() {
        $location.path("/menu");
    }

    $scope.getHostIP = function() {
        $resource('/api/hostIP').get(function(data) {
            if(data.stat === 'ok') {
                $scope.hostIP = data.host;
            } else if(data.stat === 'fail') {
            } else if(data.stat === 'deny') {
                $location.path("/");
            }
        });
    }

    $scope.getRounterIP = function() {
        $resource('/api/rounterIP').get(function(data) {
            if(data.stat === 'ok') {
                $scope.routerIP = data.host;
            } else if(data.stat === 'fail') {
            } else if(data.stat === 'deny') {
                $location.path("/");
            }
        });
    }
});

remoteCamera.controller('aboutCtrl', function($scope, $resource, $location) {
    if(!connected) {
        return $location.path("/");
    }
    $resource('/api/version').get(function(data) {
        if(data.stat === 'ok') {
            $scope.version = data.version;
        } else if(data.stat === 'deny') {
            $location.path("/");
        }
    });

    $scope.openMenu = function() {
        $location.path('/menu');
    }
});

remoteCamera.controller('systemCtrl', function($scope, $resource, $location) {
    if(!connected) {
        return $location.path("/");
    }
    $resource('/api/system').get(function(data) {
        if(data.stat === 'ok') {
            $scope.hostname = data.info.hostname;
            $scope.platform = data.info.platform;
            $scope.totalmem = data.info.totalmem + ' KB';
            $scope.usedmem = data.info.usedmem + ' KB (' + data.info.usedmem/data.info.totalmem*100% + ')';
        } else if(data.stat === 'deny') {
            $location.path('/');
        }
    });

    $scope.openMenu = function() {
        $location.path('/menu');
    }
});
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
        }).otherwise({
            redirectTo: "/"
    })
});
remoteCamera.controller('loginCtrl', function($scope, $resource, $location) {

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
            $location.path("/camera");
        }

        loginError = function(msg) {
            $scope.errorMsg = msg;
            $scope.errorClass = "login-error-show";
        }

    }
});

remoteCamera.controller('cameraCtrl', function($scope, $resource) {

    var picture = {
        item: '123'
    }

    $scope.picture = picture;
    $scope.text = '1231313';

    $scope.cameraAction = function() {
        $scope.picture = 'loading.jpg';
        $scope.doAction = true;
        /**
         *  发起请求，拍照，返回结果
         */
        $resource('/api/take').get(function(data) {
            //塞入图片
            if(data.stat === 'ok') {
                $scope.picture = data.id + '.jpg';
                $scope.doAction = false;
            } else {
                $scope.errorMsg = 'Sorry, I can\'t get the photo';
                $scope.picture = 'thumb.jpg';
                $scope.doAction = false;
            }
        }, function(e) {
            $scope.errorMsg = 'fail';
            $scope.picture = 'thumb.jpg';
            $scope.doAction = false;
        });

    }
});
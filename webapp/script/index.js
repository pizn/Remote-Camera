angular.module('EasyCamera',['ngResource']).config(function($routeProvider) {
    $routeProvider.when("/", {
        controller: indexCtrl,
        template: document.getElementById('J-action').text
    }).otherwise({
        redirectTo: "/"
    })
});

function indexCtrl($scope, $resource,$location) {
    $scope.picture = 'me.jpg'

    $scope.cameraAction = function() {
        $resource('/api/start').get(function(data) {
            $scope.picture = 'me.jpg';
            console.log(data);
            if(data.stat === 'ok') {
                var test = setInterval(function() {
                    $resource('/api/getPhoto').get(function(data) {
                            $scope.picture = 'me.jpg';
                    }, function() {
                        console.log('123');
                    });
                }, 10000);
            }
        },function(e) {
            console.log(e);
        });
    }

    $scope.cameraCancle = function() {
        $resource('/api/cancle').get(function(data) {
            console.log(data);
        },function(e) {
            console.log(e);
        });
    }
}
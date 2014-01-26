angular.module('EasyCamera',['ngResource']).config(function($routeProvider) {
    $routeProvider.when("/", {
        controller: cameraCtrl,
        template: document.getElementById('cameraView').text
    }).otherwise({
        redirectTo: "/"
    })
});

function cameraCtrl($scope, $resource) {
    $scope.cameraAction = function() {
        /**
         *  发起请求，拍照，返回结果
         */
        $resource('/api/take').get(function(data) {
            console.log(data);
            //塞入图片
            if(data.stat === 'ok') {
                $scope.picture = data.id + '.jpg';
            } else {
                $scope.errorMsg = 'fail';
                $scope.picture = 'thumb.jpg';
            }
        }, function(e) {
            console.log(e);
        });

    }
}
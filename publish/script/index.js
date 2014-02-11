angular.module('EasyCamera',['ngResource']).config(function($routeProvider) {
    $routeProvider.when("/", {
        controller: cameraCtrl,
        template: document.getElementById('cameraView').text
    }).otherwise({
        redirectTo: "/"
    })
});

function cameraCtrl($scope, $resource) {
    $scope.picture = 'thumb.jpg';
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
}
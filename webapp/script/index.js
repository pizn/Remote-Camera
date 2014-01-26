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
    $scope.width = '320';
    $scope.height = '240';
    $scope.cameraAction = function() {
        $scope.picture = 'loading.gif';
        $scope.width = '48';
        $scope.height = '48';
        $scope.class = 'loading';
        /**
         *  发起请求，拍照，返回结果
         */
        $resource('/api/take').get(function(data) {
            //塞入图片
            if(data.stat === 'ok') {
                $scope.picture = data.id + '.jpg';
                $scope.width = '320';
                $scope.height = '240';
                $scope.class = '';
            } else {
                $scope.errorMsg = 'Sorry, I can\'t get the photo';
                $scope.picture = 'thumb.jpg';
                $scope.width = '320';
                $scope.height = '240';
                $scope.class = '';
            }
        }, function(e) {
            $scope.errorMsg = 'fail';
            $scope.picture = 'thumb.jpg';
            $scope.width = '320';
            $scope.height = '240';
            $scope.class = '';
        });

    }
}
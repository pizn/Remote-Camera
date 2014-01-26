angular.module('EasyCamera',['ngResource']).config(function($routeProvider) {
    $routeProvider.when("/", {
        controller: cameraCtrl,
        template: document.getElementById('cameraView').text
    }).otherwise({
        redirectTo: "/"
    })
});

function cameraCtrl($scope, $resource) {

    var pictureHTML = 'src="/photo/thumb.jpg"';


    $scope.cameraAction = function() {
        console.log('123');
        $scope.test = '123111';
        $scope.pictureDOM = 'src="/photo/me.jpg"';
        /**
         *  按钮不能点
         */

        /**
         *  发起请求，拍照，返回结果
         */
        $resource('/api/take').get(function(data) {
            //塞入图片

            //按钮可点
            if(data.stat === 'fail') {
                $scope.errorMsg = 'fail';
                $scope.picture = 'thumb.jpg';
            }

            console.log(data);

        }, function(e) {
            //报错
            console.log(e);
            //按钮可点
        });

    }
}
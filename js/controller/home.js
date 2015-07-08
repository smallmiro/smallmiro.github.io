angular.module('topApp', []).controller('legoController', function($scope, $http) {
  $http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;
  var url = "http://127.0.0.1:8080/gonghome/price/1?callback=JSON_CALLBACK";
  $scope.addAlert = function() {
    $http.jsonp(url)
        .success(function(data){
            console.log(data);
        });
    };

  $scope.getPrice = function(){
    console.log($scope.shopUrl);
    var callurl = "http://127.0.0.1:8080/gonghome/meta?callback=JSON_CALLBAC";
    $http.({method: "JSONP", url: callurl, data : { url : $scope.shopUrl }})
        .success(function(data){
            console.log(data);
        });
  }
});

var baseUrl = "http://ec2-54-152-124-0.compute-1.amazonaws.com:8080";
var mainHomeApp = angular.module('topApp', []);
mainHomeApp.factory('product', ['$http',  function($http) {
  var orders = [];
  return {
    getPrice: function(priceCode) {
      var priceUrl = "/gonghome/price/" + priceCode + "?callback=JSON_CALLBACK";
      return $http.jsonp(baseUrl + priceUrl)
          .success(function(data){
              console.log(data);
          });
    },
    getProduct: function(inputUrl) {
      var callurl = baseUrl + "/gonghome/meta?callback=JSON_CALLBACK";
      $http({
        method: 'JSONP',
        url: callurl,
        data  : { url : inputUrl }
      }).success(function(data, status , header, config){
           console.log(data);
      }).error(function(data, status , header, config){
           console.log('error');
      });
    }
  };
}]);

mainHomeApp.controller('legoController',  function($scope, $http, product) {
  $scope.addAlert = function() {
    product.getPrice("10218").then(function(response) {
      console.log(response);
    })
  };

  $scope.getProduct = function(){
    console.log("getProduct");
    product.getPrice($scope.shopUrl).then(function(response) {
      console.log(response);
    })
  };
});

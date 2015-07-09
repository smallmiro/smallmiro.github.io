var baseUrl = "http://127.0.0.1:8080";
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
      var callurl = baseUrl + "/gonghome/meta?callback=JSON_CALLBAC";
      return $http.({method: "JSONP", url: callurl, data : { url : inputUrl }}).success(function(data){
              console.log(data);
          });
    }
  };
}]);
mainHomeApp.controller('legoController', ['product'], function($scope, $http, product) {
  $scope.addAlert = function() {
    product.getPrice("10218").then(function(response) {
      console.log(response);
    })
  };

  $scope.getProduct = function(){
    product.getPrice($scope.shopUrl).then(function(response) {
      console.log(response);
    })

});

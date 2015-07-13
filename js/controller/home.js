var baseUrl = "http://LEGO-ELB-61416480.us-east-1.elb.amazonaws.com";
var mainHomeApp = angular.module('topApp', []);

mainHomeApp.factory('product', ['$http',  function($http) {
  var orders = [];
  return {
    getPrice: function(priceCode, callback) {
      var priceUrl = "/gonghome/price/" + priceCode + "";
      $http.get(baseUrl + priceUrl)
          .success(function(data){
              callback(data);
          });
    },
    getProduct: function(inputUrl, callback) {
      var callurl = baseUrl + "/gonghome/meta";
      $http.post(callurl ,  { url : inputUrl }, headers: {'x-requested-with': ''}
      ).success(function(data, status , header, config){
           callback(data);
      });
    }
  };
}]);

mainHomeApp.controller('legoController',  function($scope, $http, product) {
  $scope.addAlert = function() {
    product.getPrice("10218", function(data){
      console.log(data);
    });
  };

  $scope.getPrice = function(){
    product.getProduct($scope.shopUrl, function(data){
      console.log(data);
    });
  };
});

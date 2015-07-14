//var baseUrl = "http://127.0.0.1:8080";
var baseUrl = "http://LEGO-ELB-61416480.us-east-1.elb.amazonaws.com";
var mainHomeApp = angular.module('topApp', []);
mainHomeApp.filter('countryImage', ['$filter', function($filter) {
  return function(input) {
    if (! input) return;
    return input.substring( 3, 5 );
  };
}]);

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
      $http.post(callurl ,  { url : inputUrl }, {headers: {'Content-Type': 'application/json;charset=UTF-8'}}
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
    product.getProduct($scope.shopUrl, function(productInfo){
      var prodCode = productInfo.prodCode;
      product.getPrice(prodCode, function(prices){
        console.log(prices);
        productInfo.prices = prices.price;
        console.log(productInfo);
        $scope.products = [productInfo];
        console.log($scope.products);
      });
    });
  };
});

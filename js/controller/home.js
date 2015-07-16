//var baseUrl = "http://127.0.0.1:8080";
var baseUrl = "http://LEGO-ELB-61416480.us-east-1.elb.amazonaws.com";
var mainHomeApp = angular.module('topApp', ['ui.bootstrap']);
mainHomeApp.filter('countryImage', ['$filter', function($filter) {
  return function(input) {
    if (! input) return;
    var ISO31661ALPHA2= input.substring( 3, 5 );
    return "/image/country/" + ISO31661ALPHA2 + ".png"
  };
}]);

mainHomeApp.filter('shopUrl', ['$filter', function($filter) {
  return function(product, country) {
    if (! product) return;
    var baseUrl = "http://shop.lego.com/";
    var productUlr = "";
    var ISO31661ALPHA2 = country.substring( 3, 5 );
    if(ISO31661ALPHA2 == "KR") {
      productUlr = country + "/" + product.urlKoreanName + "-" + product.prodCode;
    } else {
      productUlr = country + "/" + product.urlName + "-" + product.prodCode;
    }
    return baseUrl + productUlr;
  };
}]);
mainHomeApp.filter('countryName', ['$filter', function($filter) {
  return function(country) {
    if (! country) return;
    switch (country) {
            case 'en-US' :
                    return "미국";
            case 'ko-KR' :
                    return "대한민국";
            case 'en-BE' :
                    return "벨기에";
            case 'en-CZ' :
                    return "크로아티아";
            case 'en-DK' :
                    return "덴마크";
            case 'en-DE' :
                    return "독일";
            case 'en-ES' :
                    return "";
            case 'en-FR' :
                    return "프랑스";
            case 'en-IT' :
                    return "이태리";
            case 'en-HU' :
                    return "헝가리";
            case 'en-NL' :
                    return "";
            case 'en-NO' :
                    return "노르웨이";
            case 'en-PL' :
                    return "폴란드";
            case 'en-FI' :
                    return "필란드";
            case 'en-SE' :
                    return "";
            case 'en-GB' :
                    return "영국";
            case 'en-AU' :
                    return "호주";
            case 'en-NZ' :
                    return "뉴질랜드";
            case 'en-CA' :
                    return "캐나";
    }
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

        productInfo.sum = prices.sum;
        productInfo.avg = prices.avg;
        console.log(productInfo);
        $scope.products = [productInfo];
        console.log($scope.products);
      });
    });
  };
});

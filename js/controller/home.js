//var baseUrl = "http://127.0.0.1:8080";
var baseUrl = "http://LEGO-ELB-61416480.us-east-1.elb.amazonaws.com";
var mainHomeApp = angular.module('topApp', ['ui.bootstrap']);
mainHomeApp.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});
mainHomeApp.filter('prodStatus', ['$filter', function($filter) {
  return function(price) {

    var message = price.availabilityMessage;
    if(price.saleStatus == "END") {
        return "danger"
    } else if(message.indexOf("Out of stock") >=0 || message == '일시품절' || message.indexOf("Call to check") >=0  || price.krw <= 0 || message.indexOf("불가능") >=0){
      return "warning"
    } else if(message.indexOf('Sold Out') >=0) {
        return "danger"
    } else if(message.indexOf('Coming Soon') >=0 || message.indexOf('출시예정') >=0) {
        return "info"
    } else if(message.indexOf('Retired product') >=0 ) {
        return "primary"
    } else {
      return "success"
    }

  };
}]);

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
            case 'am-US' :
                    return "미국-아마존";
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
            case 'am-DE' :
                    return "독일-아마존";
            case 'en-ES' :
                    return "스페인";
            case 'en-FR' :
                    return "프랑스";
            case 'en-IT' :
                    return "이태리";
            case 'en-HU' :
                    return "헝가리";
            case 'en-NL' :
                    return "룩셈부르크";
            case 'en-NO' :
                    return "노르웨이";
            case 'en-PL' :
                    return "폴란드";
            case 'en-FI' :
                    return "필란드";
            case 'en-SE' :
                    return "스웨덴";
            case 'en-GB' :
                    return "영국";
            case 'en-AU' :
                    return "호주";
            case 'en-NZ' :
                    return "뉴질랜드";
            case 'en-CA' :
                    return "캐나다";
            case 'am-JP' :
                    return "일본-아마존";
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

mainHomeApp.factory('list', ['$http',  function($http) {
  var orders = [];
  return {
    hardList: function(page, callback) {
      var callurl = baseUrl + "/hard/list?page="+page;
      $http.get(callurl).success(function(data, status , header, config){
            console.debug(status);
           callback(data);
      });
    }
  };
}]);

mainHomeApp.controller('legoController',  function($scope, $http, $window, $location, product, list) {

  $scope.navbarCollapsed = true;
  $scope.hardlist = [];
  $scope.checkShow = function(price){
    if(price.krw <= 0 && price.availabilityMessage != 'Retired product') {
      return true;
    } else {
      return false;
    }
  };
  $scope.moreList = function(hardList){
    if(!hardList || hardList.size > 0) {
      return true;
    } else {
      return false;
    }
  };
  $scope.getPrice = function(){
    product.getProduct($scope.shopUrl, function(productInfo){
      var prodCode = productInfo.prodCode;
      product.getPrice(prodCode, function(prices){
        productInfo.prices = prices.price;

        productInfo.sum = prices.sum;
        productInfo.avg = prices.avg;
        $scope.products = [productInfo];
      });
    });
  };
  var nextPage = 0;
  $scope.getHardList = function(){
    list.hardList(nextPage , function(dataList){
      console.debug(dataList);
      //$scope.hardlist = dataList.list;
      angular.forEach(dataList.list, function(value) {
        this.push(value);
      }, $scope.hardlist);
      nextPage = dataList.nextPage;
    });
  };
  $scope.viewDetail = function(prodCode) {
    $scope.shopUrl = prodCode;
    $scope.getPrice();
  }
  var prodCode = $location.search().prodcode;
  if(prodCode){
    $scope.viewDetail(prodCode);
  }
});

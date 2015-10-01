//var baseUrl = "http://ec2-54-173-63-112.compute-1.amazonaws.com";
var baseUrl = "http://item.getlego.me";
var mainHomeApp = angular.module('topApp', ['ui.bootstrap', "chart.js"]);
mainHomeApp.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $locationProvider.html5Mode(true).hashPrefix('!');
});
mainHomeApp.directive('errorSrc', function () {
    var errorSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.errorSrc);
            });
        }
    }
    return errorSrc;
});
mainHomeApp.filter('prodStatus', ['$filter', function($filter) {
  return function(price) {

    var message = price.availabilityMessage;
    if(price.saleStatus == "END") {
        return "danger"
    } else if(message.indexOf("Out of stock") >=0 || message.indexOf('Retired product') >=0 || message.indexOf("out of stock") >=0 || message == '일시품절' || message.indexOf("Call to check") >=0  || price.krw <= 0 || message.indexOf("불가능") >=0){
      return "warning"
    } else if(message.indexOf('Sold Out') >=0) {
        return "danger"
    } else if(message.indexOf('Coming Soon') >=0 || message.indexOf('출시예정') >=0) {
        return "primary"
    } else {
      return "success"
    }

  };
}]);
mainHomeApp.filter('maxPrice', ['$filter', function($filter) {
  return function(price, price2, price3) {

    if(price < price2 && price < price3 && price > 0) {
        return "info"
    } else if(price < price2 && price > 0 && price3 == 0) {
        return "info"
    } else if(price < price3 && price > 0 && price2 == 0) {
        return "info"
    } else {
      return "";
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
    var baseUrl = "http://shop.lego.com/"+country+"/Product?p="+product.prodCode;

    return baseUrl;
  };
}]);
mainHomeApp.filter('countryName', ['$filter', function($filter) {
  return function(country) {
    if (! country) return;
    switch (country) {
            case 'en-US' :
                    return "미국";
            case 'am-US' :
                    return "아마존";
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
    getPrice: function(priceCode, callback, errorcallback) {
      var priceUrl = "/gonghome/price/" + priceCode + "";
      ga('send', 'pageview', {
        'page': priceUrl,
        'title': 'getPrice'
      });
      $http.get(baseUrl + priceUrl)
          .success(function(data){
              callback(data);
          }).
          error(function(data, status, headers, config) {
            errorcallback(data, status);
          });
    },
    getProduct: function(inputUrl, callback, errorcallback) {
      var callurl = baseUrl + "/gonghome/meta";
      ga('send', 'pageview', {
        'page': "/gonghome/meta/" + inputUrl,
        'title': 'getProduct'
      });
      $http.post(callurl ,  { url : inputUrl }, {headers: {'Content-Type': 'application/json;charset=UTF-8'}}
      ).success(function(data, status , header, config){
           callback(data);
      }).
      error(function(data, status, headers, config) {
        errorcallback(data, status);
      });
    },
    getAd: function(callback, errorcallback) {
      var callurl = "/data/ad.json?2015090704";
      $http.get(callurl)
          .success(function(data){
              callback(data);
          }).
          error(function(data, status, headers, config) {
            errorcallback(data, status);
          });
    }
  };
}]);



mainHomeApp.factory('list', ['$http',  function($http) {
  var orders = [];
  return {
    hardList: function(category, subCategory, page, callback) {
      var callurl;

      if(category == '') {
        callurl = "/hard/list?page="+page;
      } else {
        if(subCategory == '') {
          callurl = "/hard/list/" +category +"?page="+page;
        } else {
          callurl = "/hard/list/" +category +"/" + subCategory +"?page="+page;
        }

      }
      ga('send', 'pageview', {
        'page': callurl,
        'title': category + "/" + subCategory
      });
      callurl = baseUrl + callurl
      $http.get(callurl).success(function(data, status , header, config){
           callback(data);
      });
    }
  };
}]);

mainHomeApp.controller('legoController',  function($scope, $document, $http, $window, $location, $log, $timeout, product, list) {
  $scope.isLoading = false;
  $scope.isListLoading = false;
  $scope.navbarCollapsed = true;
  $scope.hardlist = [];
  $scope.more = "more";
  $scope.isCollapsed = false;

  $scope.FBParse = function(price){
    FB.XFBML.parse();
  };
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
    $scope.isLoading = true;
    product.getProduct($scope.shopUrl, function(productInfo){
      var prodCode = productInfo.prodCode;
      $window.scrollTo(0,0);
      product.getPrice(prodCode, function(prices){
        productInfo.prices = prices.price;

        ga('send', 'event', 'button', 'click', 'get search', productInfo.prodCode);
        productInfo.sum = prices.sum;
        productInfo.avg = prices.avg;
        $scope.products = [productInfo];
        $scope.isLoading = false;
        $scope.isCollapsed = true;
        $scope.labels = prices.history.priceBass;
        $scope.data = [
          prices.history.amazonPrice,
          prices.history.usPrice
        ];

        $timeout($scope.FBParse, 1000);
      }, function(data, status){
        ga('send', 'event', 'button', 'click', 'get search deatil error', productInfo.prodCode);
        alert("조회 중 에러가 발생하였습니다.");
        $scope.isLoading = false;
      });
    }, function(data, status){
      ga('send', 'event', 'button', 'click', 'get search meta error', $scope.shopUrl);
      alert("조회 중 에러가 발생하였습니다.");
      $scope.isLoading = false;
    });
  };
  var nextPage = 0;
  var category = "";
  var subCategory = "";
  $scope.getHardList = function(){
    $scope.isListLoading = true;
    $scope.more = "Loading..."
    if(category != '') {
      category = "";
      subCategory = "";
      nextPage = 0;
      $scope.hardlist = [];
    }
    list.hardList(category, subCategory, nextPage , function(dataList){

      ga('send', 'event', 'button', 'click', 'get list', nextPage);
      //$scope.hardlist = dataList.list;
      angular.forEach(dataList.list, function(value) {
        this.push(value);
      }, $scope.hardlist);
      nextPage = dataList.nextPage;
      $scope.more = "more";
      $scope.isListLoading = false;

      $timeout($scope.FBParse, 1000);
    }, function(data, status){
      ga('send', 'event', 'button', 'click', 'get list error', nextPage);
      alert("조회 중 에러가 발생하였습니다.");
      $scope.isListLoading = false;
    });
  };

  $scope.getMoreList  = function(){
    $scope.isListLoading = true;
    $scope.more = "Loading..."
    list.hardList(category, subCategory, nextPage , function(dataList){

      ga('send', 'event', 'button', 'click', 'get morelist', nextPage);
      //$scope.hardlist = dataList.list;
      angular.forEach(dataList.list, function(value) {
        this.push(value);
      }, $scope.hardlist);
      nextPage = dataList.nextPage;
      $scope.more = "more";
      $scope.isListLoading = false;
      $timeout($scope.FBParse, 1000);
    }, function(data, status){
      ga('send', 'event', 'button', 'click', 'get morelist error', nextPage);
      alert("조회 중 에러가 발생하였습니다.");
      $scope.isListLoading = false;
    });
  };

  $scope.getCategoryList = function(iCategory, iSubCategory){
    if(category != iCategory) {
      category = iCategory;
      subCategory = iSubCategory;
      nextPage = 0;
      $scope.hardlist = [];
    }
    if(subCategory != iSubCategory) {
      category = iCategory;
      subCategory = iSubCategory;
      nextPage = 0;
      $scope.hardlist = [];
    }
    $scope.isListLoading = true;
    $scope.more = "Loading..."
    list.hardList(category, subCategory, nextPage , function(dataList){
      ga('send', 'event', 'button', 'click', 'get list', nextPage);
      //$scope.hardlist = dataList.list;
      angular.forEach(dataList.list, function(value) {
        this.push(value);
      }, $scope.hardlist);
      nextPage = dataList.nextPage;
      $scope.more = "more";
      $scope.isListLoading = false;

      $timeout($scope.FBParse, 1000);
    }, function(data, status){
      ga('send', 'event', 'button', 'click', 'get list error', nextPage);
      alert("조회 중 에러가 발생하였습니다.");
      $scope.isListLoading = false;
    });
  };
  $scope.viewDetail = function(prodCode) {
    ga('send', 'event', 'button', 'click', 'get detail', prodCode);
    $scope.shopUrl = prodCode;
    $scope.getPrice();
  }

  var prodCode = $location.search().prodcode;
  if(prodCode){
    $scope.viewDetail(prodCode);
  }
  $scope.donate = function() {
    ga('send', 'pageview', {
      'page': "paypal",
      'title': 'donate'
    });
    ga('send', 'event', 'button', 'click', 'send donate', nextPage);
    $document[0].getElementById("donateForm").submit();
  }

  $scope.viewAmazon = function(product) {
    ga('send', 'event', 'button', 'click', 'get amazon', product.prodCode);
    ga('send', 'pageview', {
      'page': product.amazoneUrl ,
      'title': 'amazon'
    });
    $window.open(product.amazoneUrl,"amazon");
  }
  $scope.closeDetail = function(){
    $scope.isCollapsed = false;
  }


  $scope.clickAdd = function(link){
    $window.open(link,"amazon");
  }

  product.getAd(function(adInfo){
    var arSize = adInfo.length - 1;
    var idx = Math.floor( (Math.random() * (arSize - 0 + 1)) + 0 );
    $scope.title = adInfo[idx].title;
    $scope.smallTitle = adInfo[idx].smallTitle;
    $scope.link = adInfo[idx].link;
    $scope.img = adInfo[idx].img;
    $scope.price = adInfo[idx].price;
    $scope.uvImage = adInfo[idx].uvImage;
    $scope.desc = adInfo[idx].desc;

  }, function(data, status){
    alert("조회 중 에러가 발생하였습니다.");
    $scope.isListLoading = false;
  });


    $scope.series = ['Amazon','Lego US'];
    $scope.colours = [
      { // grey
        fillColor: 'rgba(148,159,177,0.2)',
        strokeColor: 'rgba(148,159,177,1)',
        pointColor: 'rgba(148,159,177,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(148,159,177,0.8)'
      },
      { // dark grey
        fillColor: 'rgba(77,83,96,0.2)',
        strokeColor: 'rgba(77,83,96,1)',
        pointColor: 'rgba(77,83,96,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(77,83,96,1)'
      }
    ];
    $scope.options = {
        bezierCurve : false,
        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0,
        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    };

});

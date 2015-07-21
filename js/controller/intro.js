
var mainHomeApp = angular.module('introApp', ['ui.bootstrap']);
mainHomeApp.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

mainHomeApp.controller('introController',  function($scope, $http, $window, $location, product, list) {

  $scope.navbarCollapsed = true;
}

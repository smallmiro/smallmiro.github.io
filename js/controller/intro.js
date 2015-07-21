
var introApp = angular.module('introApp', ['ui.bootstrap']);
introApp.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

introApp.controller('introController',  function($scope) {

  $scope.navbarCollapsed = true;
}

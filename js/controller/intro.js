
var introApp = angular.module('introApp', ['ui.bootstrap']);
introApp.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

introApp.controller('introController',  function($scope, $document) {

  $scope.navbarCollapsed = true;
  $scope.donate = function() {
    ga('send', 'event', 'button', 'click', 'send donate', nextPage);
    $document[0].getElementById("donateForm").submit();
  }
  $scope.alertMe = function(a) {
    alert("click " + a );
  }
});

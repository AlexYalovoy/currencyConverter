const myApp = angular.module('myApp', []);
myApp.controller('phoneController', ['$scope', ($scope) => {
  $scope.availableCurr = [
    'USD',
    'EUR',
    'RUB',
    'UAH',
    'GBP'
  ];
}])
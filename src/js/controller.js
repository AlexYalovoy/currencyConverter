myApp.controller('currencyController', ['$scope', 'requestService', ($scope, requestService) => {
  $scope.availableCurr = [
    'USD',
    'EUR',
    'RUB',
    'UAH',
    'GBP'
  ];
  $scope.giveCurr = 'UAH';
  $scope.getCurr = 'USD';
  $scope.course = {
    sell: 1,
    reverseSell: 1
  };

  $scope.getData = () => {
    requestService.getData($scope.giveCurr, $scope.getCurr).then(d => {
      $scope.course.sell = d.data[`${$scope.giveCurr}_${$scope.getCurr}`];
      $scope.course.reverseSell = d.data[`${$scope.getCurr}_${$scope.giveCurr}`];
    });
  };

}]);

myApp.filter('excludeFrom',[function() {
  return function(array,expression) {
    return array.filter(item => !expression || !angular.equals(item,expression));
  };
}]);
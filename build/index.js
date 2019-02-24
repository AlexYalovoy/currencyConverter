(() => {
  const myApp = angular.module('myApp', []);
  window.myApp = myApp;
})();
(() => {
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

    $scope.giveAmount = null;
    $scope.getAmount = 0;

    $scope.getData = () => {
      requestService.getData($scope.giveCurr, $scope.getCurr).then(d => {
        $scope.course.sell = d.data[`${$scope.giveCurr}_${$scope.getCurr}`];
        $scope.course.reverseSell = d.data[`${$scope.getCurr}_${$scope.giveCurr}`];
      });
    };

    $scope.convert = e => {
      $scope.getAmount = e.target.value / $scope.course.sell;
    };
  }]);

  myApp.filter('excludeFrom', [function() {
    return function(array, expression) {
      return array.filter(item => !expression || !angular.equals(item, expression));
    };
  }]);
})();

(() => {
  myApp.factory('requestService', ['$http', $http => ({
    updateData: scope => {
      this.getData(scope.giveCurr, scope.getCurr).then(d => {
        scope.course.sell = d.data[`${scope.giveCurr}_${scope.getCurr}`];
        scope.course.reverseSell = d.data[`${scope.getCurr}_${scope.giveCurr}`];
      });
    },
    getData: (firstC, secondC) => $http.get(`https://free.currencyconverterapi.com/api/v6/convert?
      q=${firstC}_${secondC},${secondC}_${firstC}&compact=ultra&apiKey=63e7db78741025699029`)
  })]);
})();

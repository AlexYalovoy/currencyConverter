(() => {
  myApp.controller('currencyController', ['$scope', 'requestService', ($scope, requestService) => {
    $scope.availableCurr = [
      'USD',
      'EUR',
      'RUB',
      'UAH',
      'GBP'
    ];

    $scope.commisionList = [
      '0%',
      '1%',
      '2%',
      '3%',
      '4%',
      '5%'
    ];
    $scope.giveCurr = 'UAH';
    $scope.getCurr = 'USD';

    $scope.course = {
      sell: 1,
      reverseSell: 1
    };

    $scope.giveAmount = null;
    $scope.getAmount = null;
    $scope.comission = 'Hello';

    $scope.setData = () => requestService.getData($scope.giveCurr, $scope.getCurr)
      .then(rate => {
        $scope.course.sell = rate;
        $scope.course.reverseSell = 1 / rate;
      });

    angular.element($scope.setData);

    $scope.convert = () => {
      $scope.getAmount = ($scope.giveAmount * $scope.course.sell).toFixed(2);
    };

    $scope.reverseConvert = () => {
      $scope.giveAmount = ($scope.getAmount * $scope.course.reverseSell).toFixed(2);
    };

    $scope.swapCurrencies = () => {
      [$scope.giveCurr, $scope.getCurr] = [$scope.getCurr, $scope.giveCurr];

      $scope.setData()
        .then(() => {
          $scope.convert();
        });
    };
  }]);

  myApp.filter('excludeFrom', [function() {
    return function(array, expression) {
      return array.filter(item => !expression || !angular.equals(item, expression));
    };
  }]);
})();

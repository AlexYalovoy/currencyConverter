/* eslint-disable max-params, max-len */
(() => {
  myApp.controller('currencyController', ['$scope', 'requestService', 'availableCurr', 'commissionList', ($scope, requestService, availableCurr, commissionList) => {
    $scope.availableCurr = availableCurr;
    $scope.comissionList = commissionList;

    $scope.giveCurr = 'UAH';
    $scope.getCurr = 'USD';

    $scope.course = {
      sell: 1,
      reverseSell: 1
    };

    $scope.giveAmount = null;
    $scope.getAmount = null;
    $scope.comission = '0%';

    $scope.setData = () => requestService.getData($scope.giveCurr, $scope.getCurr)
      .then(rate => {
        $scope.course.sell = rate.toFixed(6);
        $scope.course.reverseSell = (1 / rate).toFixed(6);
      })
      .then($scope.convert);

    angular.element($scope.setData);

    $scope.convert = () => {
      const persent = (100 - parseInt($scope.comission, 10)) / 100;
      $scope.getAmount = ($scope.giveAmount * $scope.course.sell * persent).toFixed(2);
    };

    $scope.reverseConvert = () => {
      const persent = (100 - parseInt($scope.comission, 10)) / 100;
      $scope.giveAmount = ($scope.getAmount * $scope.course.reverseSell * persent).toFixed(2);
    };

    $scope.swapCurrencies = () => {
      [$scope.giveCurr, $scope.getCurr] = [$scope.getCurr, $scope.giveCurr];

      $scope.setData();
    };
  }]);
})();

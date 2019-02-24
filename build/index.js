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

    $scope.comissionList = [
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
    $scope.comission = '0%';

    $scope.setData = () => requestService.getData($scope.giveCurr, $scope.getCurr)
      .then(rate => {
        $scope.course.sell = rate;
        $scope.course.reverseSell = 1 / rate;
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

(() => {
  myApp.filter('excludeFrom', [() => (array, expression) =>
    array.filter(item => !expression || !angular.equals(item, expression))]);
})();
(() => {
  myApp.factory('requestService', ['$http', '$q', function($http, $q) {
    const API = 'https://free.currencyconverterapi.com/api/v6/convert';
    const KEY = '63e7db78741025699029';
    const HOUR = 1000 * 60 * 60;

    return {
      getData: (firstCurr, secondCurr) => {
        const pair = `${firstCurr}_${secondCurr}`;
        const reversePair = `${secondCurr}_${firstCurr}`;
        const storedRate = JSON.parse(localStorage.getItem(`myApp.${pair}`));
        const time = Date.now();

        // Get rate from localStore or do request and cache results into localstore
        if (storedRate && (time - storedRate.time < HOUR)) {
          return $q(resolve => resolve(storedRate[`${pair}`]));
        }

        return $http.get(`${API}?q=${pair},${reversePair}&compact=ultra&apiKey=${KEY}`)
          .then(response => {
            const rate = Object.assign(
              {},
              { [`${pair}`]: response.data[`${pair}`] },
              { time }
            );
            const secondRate = Object.assign(
              {},
              { [`${reversePair}`]: response.data[`${reversePair}`] },
              { time }
            );
            localStorage.setItem(`myApp.${pair}`, JSON.stringify(rate));
            localStorage.setItem(`myApp.${reversePair}`, JSON.stringify(secondRate));

            return rate[`${pair}`];
          });
      }
    };
  }]);
})();

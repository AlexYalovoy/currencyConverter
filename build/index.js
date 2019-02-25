(() => {
  const myApp = angular.module('myApp', []);
  window.myApp = myApp;
})();
(() => {
  myApp.constant('availableCurr', [
    'USD',
    'EUR',
    'RUB',
    'UAH',
    'GBP'
  ]);

  myApp.constant('feeList', [
    '0%',
    '1%',
    '2%',
    '3%',
    '4%',
    '5%'
  ]);

  myApp.constant('API', 'https://free.currencyconverterapi.com/api/v6/convert');
  myApp.constant('KEY', '63e7db78741025699029');
  myApp.constant('HOUR', 1000 * 60 * 60);
  myApp.constant('USE_CACHE', true);
})();
/* eslint-disable max-params, max-len */
(() => {
  myApp.controller('currencyController', ['requestService', 'availableCurr', 'feeList', '$scope', function(requestService, availableCurr, feeList, $scope) {
    this.availableCurr = availableCurr;
    this.feeList = feeList;
    this.giveCurr = availableCurr[0];
    this.getCurr = availableCurr[3];
    this.fee = feeList[2];

    this.course = {
      sell: 1,
      reverseSell: 1
    };

    this.money = {
      give: null,
      get: null
    };

    $scope.$watch(() => this.giveCurr, () => {
      this.setCourse();
      this.convert();
    });

    $scope.$watch(() => this.getCurr, () => {
      this.setCourse();
      this.convert();
    });

    $scope.$watch(() => this.fee, () => {
      this.setCourse();
      this.convert();
    });

    $scope.$watch(() => this.money.give, () => {
      this.convert();
    });

    this.setCourse = () => {
      this.course.sell = requestService.getRateWithFee(this.giveCurr, this.getCurr, this.fee);
      this.course.reverseSell = requestService.getReverseRate(this.course.sell);
    };

    this.convert = () => {
      this.money.get = requestService.convert(this.money.give, this.course.sell);
    };

    angular.element(this.setCourse);

    this.swapCurrencies = () => {
      [this.giveCurr, this.getCurr] = [this.getCurr, this.giveCurr];
    };
  }]);
})();

(() => {
  myApp.filter('excludeFrom', [() => (array, expression) =>
    array.filter(item => !expression || !angular.equals(item, expression))]);
})();
/* eslint-disable max-params, max-len */
(() => {
  myApp.factory('requestService', ['$http', '$q', 'API', 'KEY', 'HOUR', 'USE_CACHE', function($http, $q, API, KEY, HOUR, USE_CACHE) {
    return {
      getRateWithFee: (firstCurr, secondCurr, fee) => {
        const pair = `${firstCurr}_${secondCurr}`;
        const reversePair = `${secondCurr}_${firstCurr}`;
        const storedRate = JSON.parse(localStorage.getItem(`myApp.${pair}`));
        const time = Date.now();
        const persent = (100 - parseInt(fee, 10)) / 100;
        let sellCourse = 0;

        // Get rate from localStore or do request and cache results into localstore
        if (USE_CACHE && storedRate && (time - storedRate.time < HOUR)) {
          sellCourse = (storedRate[`${pair}`] * persent).toFixed(6);
          return sellCourse;
        }

        $http.get(`${API}?q=${pair},${reversePair}&compact=ultra&apiKey=${KEY}`)
          .then(response => {
            if (!USE_CACHE) {
              return response.data[`${pair}`];
            }

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

            sellCourse = (storedRate[`${pair}`] * persent).toFixed(6);
          });

        return sellCourse;
      },
      getReverseRate: rate => (1 / rate).toFixed(6),
      convert: (giveAmount, course) => (giveAmount * course).toFixed(2)
    };
  }]);
})();

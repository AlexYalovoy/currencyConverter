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

  myApp.constant('HOUR', 1000 * 60 * 60);
  myApp.constant('USE_CACHE', true);
})();
(() => {
  myApp.filter('excludeFrom', [() => (array, expression) =>
    array.filter(item => !expression || !angular.equals(item, expression))]);
})();
/* eslint-disable max-params, max-len */
(() => {
  myApp.provider('requestService', function requestServiceProvider() {
    let API = '';
    let KEY = '';

    this.setKEY = key => (KEY = key);
    this.setAPI = api => (API = api);

    this.$get = ['$http', 'HOUR', 'USE_CACHE', function($http, HOUR, USE_CACHE) {
      return {
        setKEY: key => (KEY = key),
        setAPI: api => (API = api),
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
    }];
  });
})();

(() => {
  myApp.component('convertor', {
    templateUrl: 'convertor.html',
    controller: 'currencyController',
    controllerAs: 'cc'
  });
})();
(() => {
  myApp.config(['requestServiceProvider', function(requestServiceProvider) {
    requestServiceProvider.setKEY('63e7db78741025699029');
    requestServiceProvider.setAPI('https://free.currencyconverterapi.com/api/v6/convert');
  }]);
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

    this.setCourse = () => {
      this.course.sell = requestService.getRateWithFee(this.giveCurr, this.getCurr, this.fee);
      this.course.reverseSell = requestService.getReverseRate(this.course.sell);
    };

    this.convert = () => {
      this.money.get = requestService.convert(this.money.give, this.course.sell);
    };

    this.swapCurrencies = () => {
      [this.giveCurr, this.getCurr] = [this.getCurr, this.giveCurr];
    };

    $scope.$watchGroup([() => this.giveCurr, () => this.getCurr, () => this.fee],
      (newV, oldV) => {
        if (newV === oldV) {
          return;
        }
        this.setCourse();
        this.convert();
      });

    $scope.$watch(() => this.money.give, () => {
      this.convert();
    });

    // To don't use ng-init use this for initial course
    angular.element(document).ready(this.setCourse);
  }]);
})();

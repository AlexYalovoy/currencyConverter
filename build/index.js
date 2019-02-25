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

  myApp.constant('commissionList', [
    '0%',
    '1%',
    '2%',
    '3%',
    '4%',
    '5%'
  ]);
})();
/* eslint-disable max-params, max-len */
(() => {
  myApp.controller('currencyController', ['requestService', 'availableCurr', 'commissionList', function(requestService, availableCurr, commissionList) {
    this.availableCurr = availableCurr;
    this.comissionList = commissionList;

    this.giveCurr = 'UAH';
    this.getCurr = 'USD';

    this.course = {
      sell: 1,
      reverseSell: 1
    };

    this.giveAmount = null;
    this.getAmount = null;
    this.comission = '0%';

    this.setData = () => requestService.getData(this.giveCurr, this.getCurr)
      .then(rate => {
        const persent = (100 - parseInt(this.comission, 10)) / 100;
        this.course.sell = (rate * persent).toFixed(6);
        this.course.reverseSell = (1 / (rate * persent)).toFixed(6);
      })
      .then(this.convert);

    angular.element(this.setData);

    this.convert = () => {
      this.getAmount = (this.giveAmount * this.course.sell).toFixed(2);
    };

    this.reverseConvert = () => {
      this.giveAmount = (this.getAmount * this.course.reverseSell).toFixed(2);
    };

    this.swapCurrencies = () => {
      [this.giveCurr, this.getCurr] = [this.getCurr, this.giveCurr];

      this.setData();
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
    const useCache = true;

    return {
      getData: (firstCurr, secondCurr) => {
        const pair = `${firstCurr}_${secondCurr}`;
        const reversePair = `${secondCurr}_${firstCurr}`;
        const storedRate = JSON.parse(localStorage.getItem(`myApp.${pair}`));
        const time = Date.now();

        // Get rate from localStore or do request and cache results into localstore
        if (useCache && storedRate && (time - storedRate.time < HOUR)) {
          return $q(resolve => resolve(storedRate[`${pair}`]));
        }

        return $http.get(`${API}?q=${pair},${reversePair}&compact=ultra&apiKey=${KEY}`)
          .then(response => {
            if (!useCache) {
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

            return response.data[`${pair}`];
          });
      }
    };
  }]);
})();

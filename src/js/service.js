/* eslint-disable max-params, max-len */
(() => {
  myApp.provider('requestService', function requestServiceProvider() {
    let API = '';
    let KEY = '';

    this.setKEY = key => (KEY = key);
    this.setAPI = api => (API = api);

    this.$get = ['$http', 'HOUR', 'USE_CACHE', '$q', 'CacheCurrService', function($http, HOUR, USE_CACHE, $q, CacheCurrService) {
      return {
        getRateWithFee: function(firstCurr, secondCurr, fee) {
          const pair = `${firstCurr}_${secondCurr}`;
          const reversePair = `${secondCurr}_${firstCurr}`;
          const storedRate = CacheCurrService.getCourse(pair);
          const time = Date.now();
          const multiplier = this.getMultiplier(fee);
          const sellCourse = {};

          // Get rate from localStore or do request and cache results into localstore
          if (USE_CACHE && storedRate && (time - storedRate.time < HOUR)) {
            // sellCourse.push(storedRate[`${pair}`] * multiplier).toFixed(6);
            sellCourse.sell = (storedRate[`${pair}`] * multiplier).toFixed(6);
            sellCourse.reverseSell = this.getReverseRate(sellCourse.sell);
            return sellCourse;
          }

          $http.get(`${API}?q=${pair},${reversePair}&compact=ultra&apiKey=${KEY}`)
            .then(response => {
              if (!USE_CACHE) {
                // sellCourse.push = (response.data[`${pair}`] * multiplier).toFixed(6);
                sellCourse.sell = (storedRate[`${pair}`] * multiplier).toFixed(6);
                sellCourse.reverseSell = this.getReverseRate(sellCourse.sell);
                return;
              }

              CacheCurrService.saveCurrencyCourse(response.data, pair, time);
              CacheCurrService.saveCurrencyCourse(response.data, reversePair, time);

              // sellCourse.push(storedRate[`${pair}`] * multiplier).toFixed(6);
              sellCourse.sell = (storedRate[`${pair}`] * multiplier).toFixed(6);
              sellCourse.reverseSell = this.getReverseRate(sellCourse.sell);
            });
          return sellCourse;
        },
        setKEY: key => (KEY = key),
        setAPI: api => (API = api),
        getReverseRate: rate => (1 / rate).toFixed(6),
        convert: (giveAmount, course) => (giveAmount * course).toFixed(2),
        getMultiplier: fee => (100 - parseInt(fee, 10)) / 100
      };
    }];
  });

  myApp.service('CacheCurrService', function() {
    this.saveCurrencyCourse = function(data, pair, time) {
      const rate = Object.assign(
        {},
        { [`${pair}`]: data[`${pair}`] },
        { time }
      );

      localStorage.setItem(`myApp.${pair}`, JSON.stringify(rate));
    };

    this.getCourse = pair => JSON.parse(localStorage.getItem(`myApp.${pair}`));
  });
})();

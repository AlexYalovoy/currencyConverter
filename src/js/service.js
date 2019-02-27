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

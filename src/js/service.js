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
            if (useCache) {
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
            }

            return response.data[`${pair}`];
          });
      }
    };
  }]);
})();

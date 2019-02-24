(() => {
  myApp.factory('requestService', ['$http', function($http) {
    const API = 'https://free.currencyconverterapi.com/api/v6/convert';
    const KEY = '63e7db78741025699029';
    const HOUR = 1000 * 60 * 60;

    return {
      updateData: scope => {
        this.getData(scope.giveCurr, scope.getCurr).then(d => {
          scope.course.sell = d.data[`${scope.giveCurr}_${scope.getCurr}`];
          scope.course.reverseSell = d.data[`${scope.getCurr}_${scope.giveCurr}`];
        });
      },
      getData: (firstCurr, secondCurr) => {
        const storedRate = JSON.parse(localStorage.getItem(`myApp.${firstCurr}_${secondCurr}`));
        const time = Date.now();

        if (storedRate && (time - storedRate.time < HOUR)) {
          return Promise.resolve(storedRate);
        }

        return $http.get(`${API}?q=${firstCurr}_${secondCurr},${secondCurr}_${firstCurr}&compact=ultra&apiKey=${KEY}`)
          .then(response => {
            const rate = Object.assign(
              {},
              { [`${firstCurr}_${secondCurr}`]: response.data[`${firstCurr}_${secondCurr}`] },
              { time }
            );
            const secondRate = Object.assign(
              {},
              { [`${secondCurr}_${firstCurr}`]: response.data[`${secondCurr}_${firstCurr}`] },
              { time }
            );
            localStorage.setItem(`myApp.${firstCurr}_${secondCurr}`, JSON.stringify(rate));
            localStorage.setItem(`myApp.${secondCurr}_${firstCurr}`, JSON.stringify(secondRate));
            return rate;
          });
      }
    };
  }]);
})();

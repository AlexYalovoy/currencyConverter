(() => {
  myApp.factory('requestService', ['$http', $http => ({
    updateData: scope => {
      this.getData(scope.giveCurr, scope.getCurr).then(d => {
        scope.course.sell = d.data[`${scope.giveCurr}_${scope.getCurr}`];
        scope.course.reverseSell = d.data[`${scope.getCurr}_${scope.giveCurr}`];
      });
    },
    getData: (firstC, secondC) => {
      const host = 'https://free.currencyconverterapi.com/';
      const key = '63e7db78741025699029';

      return $http.get(`${host}api/v6/convert?q=${firstC}_${secondC},${secondC}_${firstC}&compact=ultra&apiKey=${key}`);
    }
  })]);
})();

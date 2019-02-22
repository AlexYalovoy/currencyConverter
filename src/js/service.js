myApp.factory('requestService', ['$http', ($http) => {
  return {
    updateData: function (scope) {
      this.getData(scope.giveCurr, scope.getCurr).then(d => {
        scope.course.sell = d.data[`${scope.giveCurr}_${scope.getCurr}`];
        scope.course.reverseSell = d.data[`${scope.getCurr}_${scope.giveCurr}`];
      });
    }, 
    getData: (firstC, secondC) => {
      console.log(firstC, secondC)
      return $http.get(`https://free.currencyconverterapi.com/api/v6/convert?q=${firstC}_${secondC},${secondC}_${firstC}&compact=ultra&apiKey=63e7db78741025699029`)
    }
  }
}])
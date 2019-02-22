myApp.factory('requestService', ['$http', ($http) => {
  return {
    getData: (firstC, secondC) => {
      console.log(firstC, secondC)
      return $http.get(`https://free.currencyconverterapi.com/api/v6/convert?q=${firstC}_${secondC},${secondC}_${firstC}&compact=ultra&apiKey=63e7db78741025699029`)
    }
  }
}])
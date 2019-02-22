myApp.factory('requestService', ['$http', ($http) => {
  return {
    getData: () => {
      return $http.get('https://free.currencyconverterapi.com/api/v6/convert?q=USD_PHP,PHP_USD&compact=ultra&apiKey=63e7db78741025699029')
    }
  }
}])
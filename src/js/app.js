(() => {
  const myApp = angular.module('myApp', []);
  window.myApp = myApp;

  myApp.config(['requestServiceProvider', function(requestServiceProvider) {
    requestServiceProvider.setKEY('63e7db78741025699029');
    requestServiceProvider.setAPI('https://free.currencyconverterapi.com/api/v6/convert');
  }]);
})();
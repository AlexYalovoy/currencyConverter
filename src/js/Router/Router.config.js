(() => {
  myApp.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state({
      name: 'converter',
      url: '/converter',
      templateUrl: 'currency-converter.template.html',
      resolve: {
        initialCourse: function(requestService, availableCurr, feeList) {
          return requestService.getRateWithFee(availableCurr[0], availableCurr[3], feeList[2]);
        }
      },
      controller: 'currencyController',
      controllerAs: 'cc'
    })
      .state({
        name: 'home',
        url: '',
        template: '<h3>Its the UI-Router hello world app!</h3>'
      });
  }]);
})();
(() => {
  myApp.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state({
      name: 'converter',
      url: '/converter',
      templateUrl: 'currency-converter.template.html'
    }).state({
      name: 'home',
      url: '/',
      template: '<h3>Its the UI-Router hello world app!</h3>'
    });
  }]);
})();
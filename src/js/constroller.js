myApp.controller('phoneController', ['$scope', 'requestService', ($scope, requestService) => {
  $scope.availableCurr = [
    'USD',
    'EUR',
    'RUB',
    'UAH',
    'GBP'
  ]
  // requestService.getData().then(d => $scope.currency = d.data)
}])
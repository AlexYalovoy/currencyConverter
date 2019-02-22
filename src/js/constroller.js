myApp.controller('phoneController', ['$scope', 'requestService', ($scope, requestService) => {
  $scope.availableCurr = [
    'USD',
    'EUR',
    'RUB',
    'UAH',
    'GBP'
  ];

}])

myApp.filter('excludeFrom',[function(){
  return function(array,expression,comparator){
    return array.filter(function(item){
  return !expression || !angular.equals(item,expression)
});
};
}])
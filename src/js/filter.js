(() => {
  myApp.filter('excludeFrom', [() => (array, expression) =>
    array.filter(item => !expression || !angular.equals(item, expression))]);
})();
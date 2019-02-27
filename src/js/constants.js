(() => {
  myApp.constant('availableCurr', [
    'USD',
    'EUR',
    'RUB',
    'UAH',
    'GBP'
  ]);

  myApp.constant('feeList', [
    '0%',
    '1%',
    '2%',
    '3%',
    '4%',
    '5%'
  ]);

  myApp.constant('HOUR', 1000 * 60 * 60);
  myApp.constant('USE_CACHE', true);
})();
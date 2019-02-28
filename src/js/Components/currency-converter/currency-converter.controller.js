/* eslint-disable max-params, max-len */
(() => {
  myApp.controller('currencyController', ['requestService', 'availableCurr', 'feeList', '$scope', function(requestService, availableCurr, feeList, $scope) {
    this.availableCurr = availableCurr;
    this.feeList = feeList;
    this.giveCurr = availableCurr[0];
    this.getCurr = availableCurr[3];
    this.fee = feeList[2];

    this.course = {
      sell: 1,
      reverseSell: 1
    };

    this.money = {
      give: null,
      get: null
    };

    this.setCourse = () => {
      requestService.getRateWithFee(this.giveCurr, this.getCurr, this.fee)
        .then(d => (this.course.sell = d))
        .then(() => (this.course.reverseSell = requestService.getReverseRate(this.course.sell)));
    };

    this.convert = () => {
      this.money.get = requestService.convert(this.money.give, this.course.sell);
    };

    this.swapCurrencies = () => {
      [this.giveCurr, this.getCurr] = [this.getCurr, this.giveCurr];
    };

    $scope.$watchGroup([() => this.giveCurr, () => this.getCurr, () => this.fee],
      (newV, oldV) => {
        if (newV === oldV) {
          return;
        }
        this.setCourse();
        this.convert();
      });

    $scope.$watch(() => this.money.give, () => {
      this.convert();
    });

    // To don't use ng-init use this for initial course
    angular.element(document).ready(this.setCourse);
  }]);
})();

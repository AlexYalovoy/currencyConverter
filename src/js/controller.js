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

    $scope.$watch(() => this.giveCurr, () => {
      this.setCourse();
      this.convert();
    });

    $scope.$watch(() => this.getCurr, () => {
      this.setCourse();
      this.convert();
    });

    $scope.$watch(() => this.fee, () => {
      this.setCourse();
      this.convert();
    });

    $scope.$watch(() => this.money.give, () => {
      this.convert();
    });

    this.setCourse = () => {
      this.course.sell = requestService.getRateWithFee(this.giveCurr, this.getCurr, this.fee);
      this.course.reverseSell = requestService.getReverseRate(this.course.sell);
    };

    this.convert = () => {
      this.money.get = requestService.convert(this.money.give, this.course.sell);
    };

    angular.element(this.setCourse);

    this.swapCurrencies = () => {
      [this.giveCurr, this.getCurr] = [this.getCurr, this.giveCurr];
    };
  }]);
})();

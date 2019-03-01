/* eslint-disable max-params, max-len */
(() => {
  myApp.controller('currencyController', ['requestService', 'availableCurr', 'feeList', '$scope', 'initialCourse', function(requestService, availableCurr, feeList, $scope, initialCourse) {
    this.availableCurr = availableCurr;
    this.feeList = feeList;
    this.giveCurr = availableCurr[0];
    this.getCurr = availableCurr[3];
    this.fee = feeList[2];

    this.course = initialCourse;

    this.money = {
      give: null,
      get: null
    };

    this.setCourse = () => {
      this.course = requestService.getRateWithFee(this.giveCurr, this.getCurr, this.fee);
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
  }]);
})();

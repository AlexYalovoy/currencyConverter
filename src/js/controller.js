/* eslint-disable max-params, max-len */
(() => {
  myApp.controller('currencyController', ['requestService', 'availableCurr', 'commissionList', function(requestService, availableCurr, commissionList) {
    this.availableCurr = availableCurr;
    this.comissionList = commissionList;

    this.giveCurr = 'UAH';
    this.getCurr = 'USD';

    this.course = {
      sell: 1,
      reverseSell: 1
    };

    this.money = {
      give: null,
      get: null
    };

    this.comission = '0%';

    this.setData = () => requestService.getData(this.giveCurr, this.getCurr)
      .then(rate => {
        const persent = (100 - parseInt(this.comission, 10)) / 100;
        this.course.sell = (rate * persent).toFixed(6);
        this.course.reverseSell = (1 / (rate * persent)).toFixed(6);
      })
      .then(this.convert);

    angular.element(this.setData);

    this.convert = () => {
      requestService.convert(this.money, this.course);
    };

    this.reverseConvert = () => {
      requestService.reverseConvert(this.money, this.course);
    };

    this.swapCurrencies = () => {
      [this.giveCurr, this.getCurr] = [this.getCurr, this.giveCurr];

      this.setData();
    };
  }]);
})();

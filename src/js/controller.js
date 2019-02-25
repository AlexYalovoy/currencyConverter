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

    this.giveAmount = 0;
    this.getAmount = 0;
    this.comission = '0%';

    this.setData = () => requestService.getData(this.giveCurr, this.getCurr)
      .then(rate => {
        this.course.sell = rate.toFixed(6);
        this.course.reverseSell = (1 / rate).toFixed(6);
      })
      .then(this.convert);

    angular.element(this.setData);

    this.convert = () => {
      const persent = (100 - parseInt(this.comission, 10)) / 100;
      this.getAmount = (this.giveAmount * this.course.sell * persent).toFixed(2);
    };

    this.reverseConvert = () => {
      const persent = (100 - parseInt(this.comission, 10)) / 100;
      this.giveAmount = (this.getAmount * this.course.reverseSell * persent).toFixed(2);
    };

    this.swapCurrencies = () => {
      [this.giveCurr, this.getCurr] = [this.getCurr, this.giveCurr];

      this.setData();
    };
  }]);
})();

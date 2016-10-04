import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ReviewCtrl extends Controller {
  constructor() {
    super(...arguments);

  }
}

ReviewCtrl.$inject = ['$state', '$log'];
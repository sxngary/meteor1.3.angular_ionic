import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class FeedCtrl extends Controller {
  constructor() {
    super(...arguments);

  }
  
  suggestions(){
    
  }
}

FeedCtrl.$inject = ['$state', '$log'];
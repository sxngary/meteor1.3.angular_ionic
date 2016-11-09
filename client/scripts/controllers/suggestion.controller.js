import { Controller } from 'angular-ecmascript/module-helpers';

export default class SuggestionCtrl extends Controller {
  constructor() {
    super(...arguments);

  }
  
  suggestions(){
    
  }

  redirectTo(){
  	this.$state.go('dish_detail');
  }
}

SuggestionCtrl.$inject = ['$state', '$ionicPopup', '$log'];
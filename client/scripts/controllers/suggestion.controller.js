import { Controller } from 'angular-ecmascript/module-helpers';

export default class SuggestionCtrl extends Controller {
  constructor() {
    super(...arguments);

  	console.log(this.$state)
  }
  
  suggestions(){
    
  }

  redirectToDish(){
	this.$location.url('/dish_detail');
  }
}

SuggestionCtrl.$inject = ['$state', '$ionicPopup', '$location'];
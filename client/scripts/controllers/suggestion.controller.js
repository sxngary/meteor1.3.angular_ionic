import { Controller } from 'angular-ecmascript/module-helpers';

export default class SuggestionCtrl extends Controller {
  constructor() {
    super(...arguments);

  }
  
  suggestions(){
    
  }

  openModal(){
  	this.Tag.showModal();
  }

  redirectToDish(){
	   this.$location.url('/dish_detail');
  }
}

SuggestionCtrl.$inject = ['Tag', '$state', '$ionicPopup', '$location'];
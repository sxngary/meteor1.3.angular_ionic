import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class HomeCtrl extends Controller {
  	constructor() {
	    super(...arguments);

	   	
  	}

	handleError(err) {
	    //this.$log.error('Login error ', err);

	    this.$ionicPopup.alert({
	      title: err.reason || 'Facebook login failed!',
	      okType: 'button-positive button-clear'
	    });
	}

	slideChanged(index){
		
	}

	next(){
		this.$ionicSlideBoxDelegate.next();
	}

	previous(){
		this.$ionicSlideBoxDelegate.previous();
	}
}

HomeCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log', '$ionicSlideBoxDelegate', '$scope'];
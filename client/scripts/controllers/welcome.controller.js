import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class HomeCtrl extends Controller {
  	constructor() {
	    super(...arguments);

	    this.$scope.myActiveSlide = 0;
  		_this = this;
		_this.$scope.$watch(function(scope) { return scope.myActiveSlide },
			function(newValue, oldValue) {
			  	switch(newValue) {
			    	case 0:
			    	case 2:      _this.$ionicSlideBoxDelegate.enableSlide(false);
			      		break;
	  			}
			}
		);
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

	enableSlide(){
		this.$ionicSlideBoxDelegate.enableSlide(true);
	}
}

HomeCtrl.$inject = ['$ionicPopup', '$ionicSlideBoxDelegate', '$scope'];
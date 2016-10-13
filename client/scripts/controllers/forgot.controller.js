import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ForgotCtrl extends Controller {
  	constructor() {
    	super(...arguments);
    
  	}

  	forgotPassword(form, data) {
	    _this = this;
	    _this.$validation.validate(form)
	      	.success(function(){
	        	Accounts.forgotPassword(options, function(err){
	        		
	        	});
	      	})
	      	.error(function(err){
	         	console.log("Entered input is not valid!");
	      	});
  	}

  	handleError(err) {
      	//this.$log.error('Login error ', err);

  	}
}

ForgotCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log', '$validation'];
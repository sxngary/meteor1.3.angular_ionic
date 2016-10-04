import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class SignupCtrl extends Controller {
  	constructor() {
	    super(...arguments);

        //Add custom validation function for zip code.
        this.$validation
            .setExpression({
                isstring: function (value, scope, element, attrs, param) {
                    if(value) return (value.toString().length <= Number(param) &&  value.toString().length >= 3);
                }
            })
            .setDefaultMsg({
                isstring: {
                    error: 'This is not what we wanted!',
                    success: ''
                }
            });
	}
  	signupUser(form, data) {
  		_this = this;
  		_this.$validation.validate(form)
	    .success(function(){
	      	Accounts.createUser(data, (err) => {
		    	if (err) return _this.handleError(err);

		    	_this.$validation.reset(form);
		    	_this.$state.go('tab.suggestion');
		  	});
	    })
	    .error(function(err){
	      	console.log("validation " + err);
	    });
  	}

	handleError(err) {
	    //this.$log.error('Login error ', err);

	    this.$ionicPopup.alert({
	      title: err.reason || 'Registration failed',
	      okType: 'button-positive button-clear'
	    });
	}
}

SignupCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log', "$validation"];
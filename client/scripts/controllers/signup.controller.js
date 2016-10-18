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
                    error: 'Enter atleast 3 digits and not greater than 6 digits!',
                    success: ''
                }
            });

        //Add custom validation function for password.
        this.$validation
            .setExpression({
                isvalidate: function (value, scope, element, attrs, param) {
                	if(value){
                		var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
						var nv =  re.test(value);
                		if(nv){
                			return true;
                		}
                	}
                }
            })
            .setDefaultMsg({
                isvalidate: {
                    error: "At least 1 digit, 1 lowercase, 1 uppercase and min length 6",
                    success: ''
                }
            });


        //Add custom validation function for confirm password.
        this.$validation
            .setExpression({
                isconfirm: function (value, scope, element, attrs, param) {
                	if(value) return (value === scope.data.password);
                }
            })
            .setDefaultMsg({
                isconfirm: {
                    error: "Passwords don't match",
                    success: ''
                }
            });
	       
        this.helpers({
            registerErr(){
                if(Session.get('registerErr'))
                  return Session.get('registerErr');
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
		    	_this.$state.go('suggestion');
		  	});
	    })
	    .error(function(err){
	      	//console.log("validation " + err);
	    });
  	}

	handleError(err) {
        Session.set('registerErr', err.reason || 'Registration failed');
	}
}

SignupCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log', "$validation"];
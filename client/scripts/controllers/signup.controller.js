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

        //Add custom validation function for first & last name.
        this.$validation
            .setExpression({
                nameValidate: function (value, scope, element, attrs, param) {
                    if(value){
                        var re = /^[a-z ,.'-]+$/i;
                        var nv =  re.test(value);
                        if(nv){
                            return true;
                        }
                    }
                }
            })
            .setDefaultMsg({
                nameValidate: {
                    error: "This should be valid",
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

        //Add custom validation function for username.
        this.$validation
            .setExpression({
                usernameValidate: function (value, scope, element, attrs, param) {
                    if(value){
                        var illegalChars = /\W/; // allow letters, numbers, and underscores
                        startWith = /[a-zA-Z]/
                        doubleUnder = value.indexOf('__');
                        if ((value.length < 4) || (value.length > 15)) {
                            return false;
                        } else if (illegalChars.test(value)) {
                            return false;                     
                        }else if(!startWith.test(value)){
                            return false;
                        }else if(doubleUnder > -1){
                            return false;
                        }else{
                            return true;
                        }
                    }
                }
            })
            .setDefaultMsg({
                usernameValidate: {
                    error: "Username should start with letter, min length 4 and max length 15",
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
            data.email = _this.data.email.toLowerCase();
            data.username = _this.data.username.toLowerCase();
	      	Accounts.createUser(data, (err) => {
		    	if (err) return _this.handleError(err);

                _this.$validation.reset(form);
		  	    _this.$ionicLoading.show({ template: 'Registered successfully!', noBackdrop: true, duration:2500});
                _this.$state.go('tab.suggestion');
            });
	    })
	    .error(function(err){
	      	//console.log("validation " + err);
	    });
  	}

	handleError(err) {
        this.$ionicScrollDelegate.scrollTop();
        Session.set('registerErr', err.reason || 'Registration failed');
	}

    lowerCase(type){
        if(type == 'email'){
            if(this.data){
                if(this.data.email){
                    trimValue = this.data.email.trim();
                    if (trimValue.length === 1) {
                        this.data.email = trimValue.toLowerCase();
                    }
                }
            }
        }else{
            if(this.data){
                if(this.data.username){
                    trimValue = this.data.username.trim();
                    if (trimValue.length === 1) {
                        this.data.username = trimValue.toLowerCase();
                    }
                }
            }
        }
    }
}

SignupCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$state', "$validation", "$ionicLoading", '$ionicScrollDelegate'];
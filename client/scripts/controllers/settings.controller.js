import { Controller } from 'angular-ecmascript/module-helpers';

export default class SettingsCtrl extends Controller {
  	constructor() {
	    super(...arguments);

		const profile = this.currentUser && this.currentUser.profile;
	    this.profile = profile;

		this.formData = {
			firstname: profile.firstname,
			lastname: profile.lastname,
			zip_code: profile.zip_code
		}

		//Add custom validation function for zip code.
        this.$validation
            .setExpression({
                zipValidator: function (value, scope, element, attrs, param) {
                    if(value) return (value.toString().length <= Number(param) &&  value.toString().length >= 3);
                }
            })
            .setDefaultMsg({
                zipValidator: {
                    error: 'Enter atleast 3 digits and not greater than 6 digits!',
                    success: ''
                }
            });

		//Add custom validation function for first & last name.
        this.$validation
            .setExpression({
                nameValidator: function (value, scope, element, attrs, param) {
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
                nameValidator: {
                    error: "Name should be valid!",
                    success: ''
                }
            });
  	}

	update(form) {
		let currentUser = this.currentUser;
		let formData = this.formData;
		let $ionicLoading = this.$ionicLoading;

		_this = this;
		_this.$validation.validate(form)
		.success(function(){
			Meteor.users.update({_id: currentUser._id}, {$set: {
				"profile.firstname": formData.firstname,
				"profile.lastname": formData.lastname,
				"profile.zip_code": formData.zip_code
			}});
			$ionicLoading.show({ template: 'Profile updated successfully.', noBackdrop: true });
			Meteor.setTimeout(function(){
				$ionicLoading.hide();
			}, 1000);
		})
		.error(function(err){
			//console.log("validation " + err);
			_this.$ionicLoading.show({ template: 'Invalid form data.', noBackdrop: true });
			Meteor.setTimeout(function(){
			_this.$ionicLoading.hide();
			}, 1000);
		});
	}

	logout() {
		this.$ionicLoading.show({ template: 'Logging out. Please wait ...', noBackdrop: true });
        Meteor.logout((err) => {
	      	if (err){ 
	      		this.$ionicLoading.hide(); 
	      		//console.log(err);
	      	}else{
	      		this.$ionicLoading.hide(); 
	      		this.$state.go('login');
	      	}
	    });
	}
}

SettingsCtrl.$inject = ['$state', '$ionicLoading', '$validation'];
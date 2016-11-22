import { Controller } from 'angular-ecmascript/module-helpers';

export default class SettingsCtrl extends Controller {
  	constructor() {
	    super(...arguments);

		const profile = this.currentUser && this.currentUser.profile;
	    this.profile = profile;
	    if(profile.avatar){
	    	Session.set('userImage', profile.avatar);
	    }else{
	    	Session.set('userImage', '');
	    }
		this.formData = {
			firstname: profile.firstname,
			lastname: profile.lastname,
			username: (this.currentUser.username ? this.currentUser.username : ''),
			bio: (this.profile.bio ? this.profile.bio : ''),
			zip_code: profile.zip_code,
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
  			avatar(){
  				if(Session.get('userImage')){
  					return Meteor.absoluteUrl() + Session.get('userImage');
  				}
  			}
  		})
  	}

	update(form) {
		let currentUser = this.currentUser;
		let formData = this.formData;
		let $ionicLoading = this.$ionicLoading;

		_this = this;
		_this.$validation.validate(form)
		.success(function(){
			_this.callMethod('updateUsername', formData, (err, data) => {
		      	if (!err){
		      		$ionicLoading.show({ template: 'Profile updated successfully.', noBackdrop: true, duration:1000 });
		      	}else{
		      		_this.formData.username = _this.currentUser.username;
		      		$ionicLoading.show({ template: err.reason, noBackdrop: true, duration:1000 });
		      	}
		    });
		})
		.error(function(err){
			_this.$ionicLoading.show({ template: 'Invalid form data.', noBackdrop: true });
			Meteor.setTimeout(function(){
			_this.$ionicLoading.hide();
			}, 1000);
		});
	}

	uploadPhoto(){
		if(Meteor.isCordova){
			let _this = this;
			MeteorCameraUI.getPicture({correctOrientation: true, quality: 75, cancel:'Cancel', takeImage:'Take photo', imageLibrary:'Image Library'}, (err, data) => {
		      	if (!err) {
			      	if(data){
			      		_this.$ionicLoading.show({ template: 'Uploading ...', noBackdrop: true});
				    	Meteor.call('uploadUserImage', data, function(err, res){
				    		if(!err){
				    			if(res){
				    				_this.$ionicLoading.hide();
				    				Session.set('userImage', res);
				    			}
				    		}
				    	});
				    }
			  	}else{
			  		_this.$ionicLoading.show({ template: err.reason, duration:1500, noBackdrop: true});
			  	}
		    });
		}
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
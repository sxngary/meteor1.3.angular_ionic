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
			Meteor.users.update({_id: currentUser._id}, {$set: {
				"profile.firstname": formData.firstname,
				"profile.lastname": formData.lastname,
				"profile.bio": formData.bio,
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
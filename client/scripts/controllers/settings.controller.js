import { Controller } from 'angular-ecmascript/module-helpers';

export default class SettingsCtrl extends Controller {
  	constructor() {
	    super(...arguments);

  	}

	logout() {
		this.$ionicLoading.show({ template: 'Logging out. Please wait ...', noBackdrop: true });
        Meteor.logout((err) => {
	      	if (err){ 
	      		this.$ionicLoading.hide(); 
	      		console.log(err);
	      	}else{
	      		this.$ionicLoading.hide(); 
	      		this.$state.go('login');
	      	}
	    });
	}
}

SettingsCtrl.$inject = ['$state', '$ionicLoading'];
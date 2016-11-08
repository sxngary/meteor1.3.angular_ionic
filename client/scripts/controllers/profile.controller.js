import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ProfileCtrl extends Controller {
  	constructor() {
	    super(...arguments);

	    const profile = this.currentUser && this.currentUser.profile;
	    this.profile = profile;
	    this.halfFirstname = profile.firstname.charAt(0).toUpperCase();
	    this.firstname = profile.firstname.charAt(0).toUpperCase() + profile.firstname.slice(1).toLowerCase();
	    this.lastname = profile.lastname.charAt(0).toUpperCase() + profile.lastname.slice(1).toLowerCase();
	    this.email = this.currentUser && this.currentUser.emails[0].address;
  	}

  	redirectTo(){
    	this.$state.go('settings');
  	}
}

ProfileCtrl.$inject = ['$state'];
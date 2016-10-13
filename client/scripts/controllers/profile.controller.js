import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ProfileCtrl extends Controller {
  	constructor() {
	    super(...arguments);

	    const profile = this.currentUser && this.currentUser.profile;
	    this.name = profile ? profile.name : '';
	  
	    this.helpers({
	   
	    });

  	}

	captureVideo(){
		if(Meteor.isCordova){
	  		navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
		}else{
			return false;
		}
	}

	clickPicture(){
		if(Meteor.isCordova){
	  		navigator.device.capture.captureImage(captureSuccess, captureError, {limit:1});
		}else{
			return false;
		}
	}

}

ProfileCtrl.$inject = ['$state', '$log'];

// capture callback
var captureSuccess = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        alert(path)
        // do something interesting with the file
    }
};

// capture error callback
captureError = function(error) {
	console.log(error.code)
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};
import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ReviewCtrl extends Controller {
  	constructor() {
    	super(...arguments);

		this.helpers({
	   		image(){
	   			/*if(Session.get('clickedImage'))
	   				return Session.get('clickedImage');*/
	   		}
	    });
  	}

  	previousView(){
  		if(this.$ionicHistory.backView())
  			this.$ionicHistory.goBack(-1);
  		else
  			this.$state.go('tab.suggestion');
  	}

	openGallery(e){
		if(Meteor.isCordova){
	  		/*var options = {  
				correctOrientation: true,
				quality: 100,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			}
			MeteorCamera.getPicture(options, function(err, data) {  
			  	if (err) {
			    	console.log('error', err);
			  	}
			  	if (data) {
			    	alert(data);
			  	}
			});*/
		}
	}

	clickPicture(){
		if(Meteor.isCordova){
	  		/*var options = {  
				correctOrientation: true,
				quality: 100
			}
			MeteorCamera.getPicture(options, function(err, data) {  
			  	if (err) {
			    	console.log('error', err);
			  	}
			  	if (data) {
			    	Meteor.call('uploadImage', data, function(err, res){
			    		if(!err){
			    			alert('image uploaded!')
			    		}
			    	});

			    	Session.set('clickedImage', data);
			  	}
			});*/

			var tapEnabled = false; //enable tap take picture
			var dragEnabled = false; //enable preview box drag across the screen
			var toBack = false; //send preview box to the back of the webview
			var rect = {x: 0, y: 250, width: 400, height:350};
			cordova.plugins.camerapreview.startCamera(rect, "back", tapEnabled, dragEnabled, toBack)
		}
	}

	clickPhoto(){
		if(Meteor.isCordova){
			cordova.plugins.camerapreview.takePicture();
		}
	}

	switchCamera(){
		cordova.plugins.camerapreview.switchCamera();
	}

	captureVideo(){
		if(Meteor.isCordova){
	  		
		}
	}

}

ReviewCtrl.$inject = ['$state', '$log', '$ionicHistory', '$scope'];

if(Meteor.isCordova){
	cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
		document.getElementById('originalPicture').src = result[0];//originalPicturePath;
		document.getElementById('previewPicture').src = result[1];//previewPicturePath;
	});
}
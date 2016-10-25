import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ReviewCtrl extends Controller {
  	constructor() {
    	super(...arguments);

		this.helpers({
	   		image(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage');
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
			imgWidth = $(window).width();
			windowHeight = $(window).height();
			headerHeight = $(".rev-header").height();
			btnHeight = $(".round-btn").outerHeight();
			tabsHeight = $(".rev-tabs").height();
			imgHeight = parseInt(windowHeight) - (parseInt(headerHeight) + parseInt(btnHeight) + parseInt(tabsHeight));

	  		var options = {  
				correctOrientation: true,
				quality: 100,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			}
			MeteorCamera.getPicture(options, function(err, data) {  
			  	if (!err) {
			    	if (data) {
				    	Meteor.call('uploadImage', data, imgWidth, imgHeight, function(err, res){
				    		if(!err){
				    			Session.set('clickedImage', 'uploads/dishes/' + res + '.jpeg');
				    		}
				    	});
				  	}
			  	}
			});
		}
	}

	clickPicture(){
		if(Meteor.isCordova){
			imgWidth = $(window).width();
			windowHeight = $(window).height();
			headerHeight = $(".rev-header").height();
			btnHeight = $(".round-btn").outerHeight();
			tabsHeight = $(".rev-tabs").height();
			imgHeight = parseInt(windowHeight) - (parseInt(headerHeight) + parseInt(btnHeight) + parseInt(tabsHeight));
	  		var options = {  
				correctOrientation: true,
				quality: 100
			}
			MeteorCamera.getPicture(options, function(err, data) {  
			  	if (!err) {
			    	if (data) {
				    	Meteor.call('uploadImage', data, imgWidth, imgHeight, function(err, res){
				    		if(!err){
				    			Session.set('clickedImage', 'uploads/dishes/' + res + '.jpeg');
				    		}
				    	});
				  	}
			  	}
			});
		}
	}


	captureVideo(){
		if(Meteor.isCordova){
	  		navigator.device.capture.captureVideo(captureSuccess, captureError);
		}
	}

}

ReviewCtrl.$inject = ['$state', '$log', '$ionicHistory', '$scope'];

if(Meteor.isCordova){
	// capture callback
	var captureSuccess = function(mediaFiles) {
	    var i, path, len;
	    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
	        path = mediaFiles[i].fullPath;
	        alert(path);
	    }
	};

	// capture error callback
	var captureError = function(error) {
	    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	};
}
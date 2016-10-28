import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ReviewCtrl extends Controller {
  	constructor() {
    	super(...arguments);

  	}

  	previousView(){
  		if(this.$ionicHistory.backView())
  			this.$ionicHistory.goBack(-1);
  		else
  			this.$state.go('tab.suggestion');
  	}

	openGallery(e){
		if(Meteor.isCordova){
			Session.set('clickedImage', '');
			Session.set('videoPath', '');
			Session.set('videoImagePath', '');
			_this= this;
			dimension = getDimension();
	  		var options = {  
				correctOrientation: true,
				quality: 100,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			}
			MeteorCamera.getPicture(options, function(err, data) {  
			  	if (!err) {
			    	if (data) {
			    		_this.$ionicLoading.show({ template: 'Uploading ...'});
				    	Meteor.call('uploadImage', data, dimension.width, dimension.height, function(err, res){
				    		if(!err){
				    			Session.set('clickedImage', { bigger: 'uploads/dishes/' + res + '.jpeg', small: 'uploads/dishes/' + res + '_sqaure.jpeg'});
				    			_this.$state.go('filter');
				    		}
				    	});
				  	}
			  	}else{
			  		_this.$ionicLoading.hide();
			  	}
			});
		}
	}

	clickPicture(){
		if(Meteor.isCordova){
			Session.set('clickedImage', '');
			Session.set('videoPath', '');
			Session.set('videoImagePath', '');
			_this= this;
			dimension = getDimension();
	  		var options = {  
				correctOrientation: true,
				quality: 100
			}
			MeteorCamera.getPicture(options, function(err, data) {  
			  	if (!err) {
			    	if (data) {
			    		_this.$ionicLoading.show({ template: 'Uploading ...'});
				    	Meteor.call('uploadImage', data, dimension.width, dimension.height, function(err, res){
				    		if(!err){
				    			Session.set('clickedImage', {bigger: 'uploads/dishes/' + res + '.jpeg', small: 'uploads/dishes/' + res + '_sqaure.jpeg'});
				    			_this.$state.go('filter');
				    		}
				    	});
				  	}
			  	}else{
			  		_this.$ionicLoading.hide();
			  	}
			});
		}
	}

	captureVideo(){
		if(Meteor.isCordova){
			_this= this;
			Session.set('clickedImage', '');
			Session.set('videoPath', '');
			Session.set('videoImagePath', '');
			dimension = getDimension();
	  		navigator.device.capture.captureVideo(
	  			function(mediaFiles){
	  				_this.$ionicLoading.show({ template: 'Uploading ...'});
	  				var i, path, len;
				    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				        var fileURL = mediaFiles[i].fullPath;
					    var uri = encodeURI(Meteor.absoluteUrl() + "upload");
					    var options = new FileUploadOptions();
					    options.fileKey = "dish";
					    options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
					    options.mimeType = "video/mp4";
					    options.params = { width: dimension.width, height: dimension.height};
					   	var ft = new FileTransfer();
					   	ft.upload(fileURL, uri, 
					   		function(res){
								parseObj = JSON.parse(res.response);
								videoType = parseObj.mimetype.split('/');
								Session.set('videoPath', {server: 'uploads/video/' + parseObj.filename, local: fileURL});
								Session.set('videoImagePath', parseObj.image);
								_this.$state.go('filter');
							}, function(err) {
								console.log(err);
							}, options
						);	        
				    }
	  			}, 
	  			function(error) {
				    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
				}
	  		);
		}
	}

}

ReviewCtrl.$inject = ['$state', '$ionicHistory', '$ionicLoading'];

function getDimension(){
	imgWidth = $(window).width();
	windowHeight = $(window).height();
	headerHeight = $(".rev-header").height();
	btnHeight = $(".round-btn").outerHeight();
	tabsHeight = $(".rev-tabs").height();
	imgHeight = parseInt(windowHeight) - (parseInt(headerHeight) + parseInt(btnHeight) + parseInt(tabsHeight));
	return { width: imgWidth, height: imgHeight };
}
import { Controller } from 'angular-ecmascript/module-helpers';

export default class PostReviewCtrl extends Controller {
  	constructor() {
    	super(...arguments);
    	
    	this.helpers({
	   		dishImage(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage').bigger;
	   		},
	   		videoImage(){
	          if(Session.get('videoImagePath'))
	            return Meteor.absoluteUrl() + Session.get('videoImagePath');
	        },
	   		dishData(){
	   			if(Session.get('dishData')){
		   			return {
		   				restaurant : Session.get('restaurant').name + ', ' + Session.get('restaurant').address,
			    		dishName :(Session.get('dishData').name ? Session.get('dishData').name : ''),
			    		comment :(Session.get('dishData').comment ? Session.get('dishData').comment : '')
	   				}
	   			}
	   		},
	   		rating(){
	   			return (Session.get('dishData') ? Session.get('dishData').rating : 0)
	   		}
	   	});
  	}

  	postAndSave(isChecked){
  		dishData = Session.get('dishData');
  		dishData['restaurant'] = Session.get('restaurant');
	  	if(Session.get('clickedImage')){
	  		dishData['imageId'] = Session.get('clickedImage').imageId;
	  		dishData['extension'] = 'jpeg';
	  	}else{
	  		dishData['videoThumb'] = Session.get('videoImagePath');
	  		dishData['video'] = Session.get('videoPath').server;
	  		dishData['extension'] = 'jpg';
	  	}
	  	dishData['uploadedBy'] = this.currentUser._id;
	  	dishData['averageReview'] = Session.get('dishData').rating;
  		dishData['dateMillisecond'] = new Date().getTime();
  		dishData['offset'] = new Date().getTimezoneOffset()/ 60;
  		dishData['createdAt'] = new Date();
  		if(Session.get('clickedImage')){
  			imageShare = Meteor.absoluteUrl() + Session.get('clickedImage').bigger;
  		}else{
  			imageShare = Meteor.absoluteUrl() + Session.get('videoImagePath');
  		}
  		 _this = this
		if(isChecked){
			window.plugins.socialsharing.shareViaFacebook(
				dishData.comment,
				imageShare,
				null,
				function() {
					
				},function(errormsg){
					
				}
			);
			Meteor.call('save', dishData, function(err, res){
	  			if(!err){
	  				Session.set('dishData', '');
	  				_this.$ionicLoading.show({ template: 'Uploaded successfully!', noBackdrop: true, duration:1000});
	  				_this.$state.go('tab.profile');
	  			}
	  		});
		}else{
	  		Meteor.call('save', dishData, function(err, res){
	  			if(!err){
	  				Session.set('dishData', '');
	  				_this.$ionicLoading.show({ template: 'Uploaded successfully!', noBackdrop: true, duration:1000});
	  				_this.$state.go('tab.profile');
	  			}
	  		});
  		}
  	}
}

PostReviewCtrl.$inject = ['$state', '$ionicLoading'];
import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class FilterCtrl extends Controller {
  	constructor() {
    	super(...arguments);

  		Meteor.setTimeout(function(){
  			$('.responsive').slick({
		      	infinite: true,
			  	slidesToShow: 3,
			  	slidesToScroll: 3
		    });
  		}, 0);
  		
      //hide loading template
      this.$ionicLoading.hide();
      this.$scope.number = 5;
      this.squareImg = Session.get('clickedImage') ? Meteor.absoluteUrl() + Session.get('clickedImage').small : ''; 
  		this.helpers({
	   		image(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage').bigger;
	   		},
        videoImage(){
          if(Session.get('videoImagePath'))
            return Meteor.absoluteUrl() + Session.get('videoImagePath');
        }
	    });
  	}

  	playVideo(){
      if(Session.get('videoPath')){
        var videoUrl = Session.get('videoPath').local;
        // Just play a video
        window.plugins.streamingMedia.playVideo(videoUrl, {
            initFullscreen: false
        });
      }
    }

    getNumber(){
      return [1, 2, 3, 4, 5, 6];   
    }

    setFilter(){
  		
  	}
}

FilterCtrl.$inject = ['$state', '$ionicLoading', '$scope'];
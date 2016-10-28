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

  		this.helpers({
	   		image(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage');
	   		},
        videoImage(){
          if(Session.get('videoImagePath'))
            return Meteor.absoluteUrl() + Session.get('videoImagePath');
        }
	    });
  	}

  	playVideo(){
      alert(1);
      if(Session.get('videoPath')){
        var videoUrl = Meteor.absoluteUrl() + Session.get('videoPath');
        // Just play a video
        window.plugins.streamingMedia.playVideo(videoUrl, {
            initFullscreen: false
        });
      }
    }

    setFilter(){
  		
  	}
}

FilterCtrl.$inject = ['$state', '$ionicLoading'];
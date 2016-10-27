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
  		
      if(Session.get('videoPath')){
        this.$ionicLoading.hide();
      }

  		this.helpers({
	   		image(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage');
	   		},
        video(){
          if(Session.get('videoPath'))
            return Meteor.absoluteUrl() + Session.get('videoPath');
        }
	    });
  	}

  	playVideo(){
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
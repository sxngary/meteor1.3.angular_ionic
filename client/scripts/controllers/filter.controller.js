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

  		this.helpers({
        //hide loading template
        hideLoading(){
          this.$ionicLoading.hide();
        },
	   		image(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage').bigger;
	   		},
        videoImage(){
          if(Session.get('videoImagePath'))
            return Meteor.absoluteUrl() + Session.get('videoImagePath');
        },
        thumb(){
          if(Session.get('clickedImage'))
            return Meteor.absoluteUrl() + Session.get('clickedImage').small;
        },
        effects(){
          return  [
            { 
              color: ""
            },{ 
              color: "vignette:0.6;sepia:true;contrast:-64"
            },{ 
              color: "brightness:20;sepia:true;contrast:-20"
            },{ 
              color: "lighten:0.3;contrast:-5"
            },{ 
              color: "desaturate:0.9;contrast:-10"
            },{ 
              color: "noise:120;contrast:-10"
            }
          ];   
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

    setFilter(){
  
  	}

    redirectTo(){
      if(Session.get('clickedImage') || Session.get('videoImagePath')){
        this.$state.go('location');
      }
    }
}

FilterCtrl.$inject = ['$state', '$ionicLoading', '$scope'];
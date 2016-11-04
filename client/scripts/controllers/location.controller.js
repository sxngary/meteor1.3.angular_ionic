import { Controller } from 'angular-ecmascript/module-helpers';

export default class LocationCtrl extends Controller {
  	constructor() {
    	super(...arguments);

		this.autorun(function () {
		    if (GoogleMaps.loaded()) {
		    	$("#restaurant").
		    		geocomplete({types: ['geocode', 'establishment']}).
		    		bind("geocode:result", function(event, result){
						//console.log(result, result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}));
						Session.set('restaurant', result);
					});
		    }
		});
    	
    	this.helpers({
	   		image(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage').bigger;
	   		}
	   	});

  	}

  	dishData(data){
  		if(data){
  			if(data.dishname && data.rating && Session.get('restaurant')){
  				Session.set('dishData', data);
  				this.$state.go('post_review');
  			}
  		}
  	}

}

LocationCtrl.$inject = ['$state', '$scope', '$reactive'];
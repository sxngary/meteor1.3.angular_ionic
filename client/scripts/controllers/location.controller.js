import { Controller } from 'angular-ecmascript/module-helpers';

export default class LocationCtrl extends Controller {
  	constructor() {
    	super(...arguments);

		this.autorun(function () {
		    if (GoogleMaps.loaded()) {
		    	$("#restaurant").
		    		geocomplete({types: ['geocode', 'establishment']}).
		    		bind("geocode:result", function(event, result){
						console.log(result.types /*,result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})*/);
						photo = (result.photos ? result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : '')
						var restauData = 
							{
					  			name: (result.name ? result.name : ''),
					  			lat: result.geometry.location.lat(),
					  			long: result.geometry.location.lng(),
					  			rating: (result.rating ? result.rating : ''),
					  			distance: '',
					  			address: result.formatted_address,
					  			city: '',
					  			Country: '',
					  			image: photo,
					  		};
				  		Session.set('restaurant', restauData);
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
  			if(data.name && data.rating && Session.get('restaurant')){
  				Session.set('dishData', data);
  				this.$state.go('post_review');
  			}
  		}
  	}

}

LocationCtrl.$inject = ['$state', '$scope', '$reactive'];
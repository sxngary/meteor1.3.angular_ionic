import { Controller } from 'angular-ecmascript/module-helpers';

export default class LocationCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	//Calculate image dimension according to screen.
    	header = $('.bar-positive').outerHeight();
    	r1 = $('.r-one').outerHeight();
    	r2 = $('.r-two').outerHeight();
    	link = $('.r-button').outerHeight();
    	//console.log(r1, r2, link, header);

    	//Set autocomplete option.
        this.autocompleteOptions = {
            types: ['establishment']
        };
        //On select event.
        this.$scope.$on('g-places-autocomplete:select', function (event, param) {
			console.log(param);
		});
    	
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

  	dishData(){
  		if(this.data){
  			if(this.data.name && this.data.rating && this.rt.restaurantdata){
				let tagslistarr = this.data.comment.split(' ');
				let arr=[];
				$.each(tagslistarr,function(i,val){
				    if(tagslistarr[i].indexOf('#') == 0){
				      arr.push(tagslistarr[i]);  
				    }
				});
				if(arr.length){
					this.data.tags = arr;
				}
				
	  			var restaurant = this.rt.restaurantdata;
	  			if(_.contains(restaurant.types, 'restaurant')){
	  				var country = '', city = '', postal_code= '';
	  				if(restaurant.address_components){
	  					address = restaurant.address_components;
	  					for (var i = 0; i < address.length; i++) {
		                  	for (address2 in address[i]) {
		                     	if (address2 == "types") {
		                        	var types = address[i][address2];
		                        	if (types[0] == "country") {
		                            	country = address[i].long_name;
		                        	} 
		                        	if (types[0] == "locality") {
		                           		city = address[i].long_name;
		                       		} 
		                     		if (types[0] == "postal_code") {
		                           		postal_code = address[i].long_name;
		                       		} 
		                     	}	
		                  	}          
		                }
	  				}
	  				console.log(restaurant.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000}));
	  				photo = (restaurant.photos ? restaurant.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000}) : '');
					var restauData = 
						{
				  			placeId: restaurant.place_id,
				  			name: (restaurant.name ? restaurant.name : ''),
				  			location: { coordinates: [restaurant.geometry.location.lng(), restaurant.geometry.location.lat()], type: "Point" },
				  			rating: (restaurant.rating ? restaurant.rating : ''),
				  			address: restaurant.formatted_address,
				  			city: city,
				  			country: country,
				  			postal_code: postal_code,
				  			image: photo,
				  		};
			  		Session.set('restaurant', restauData);
	  				Session.set('dishData', this.data);
	  				this.$state.go('post_review');
  				}else{
  					this.$ionicLoading.show({ template: 'Add restaurant only', noBackdrop: true, duration:2000});
  					delete this.rt.restaurantdata;
  				}
  			}
  		}
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

}

LocationCtrl.$inject = ['$state', '$scope', '$ionicLoading'];
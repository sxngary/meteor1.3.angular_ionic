import { Controller } from 'angular-ecmascript/module-helpers';
import { Dishes } from '../../../lib/collections';

export default class LocationCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	this.subscribe('dish-search');

    	//Displayed selected values on back
    	if(Session.get('dishData')){
    		this.data = Session.get('dishData');
    	}

    	//Calculate image dimension according to screen.
    	header = $('.bar-positive').outerHeight();
    	r1 = $('.r-one').outerHeight();
    	r2 = $('.r-two').outerHeight();
    	link = $('.r-button').outerHeight();
    	//initialize autocomplete for dish name input.
    	AutoCompletion.init("#searchBox");
    	//clear sessions
    	Session.set('placeId', '');
    	//Set autocomplete option.
        this.autocompleteOptions = {
            types: ['establishment']
        };
        //On select event.
        _this = this;
        this.$scope.$on('g-places-autocomplete:select', function (event, param) {
			Session.set('placeId', param.place_id);
			_this.$ionicLoading.show({ template: 'Loading associated dishes', noBackdrop: true});
			_this.subscribe('dish-search', () => [param.place_id], {
			    onStart: function () {
			      	//console.log("New subscribtion has been started");
			    },
			    onReady: function () {
			      	_this.$ionicLoading.hide();
			    }
			});
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
  		if(this.data && this.rt){
  			if(this.data.name && this.data.rating && this.rt.restaurantdata){
 				if(this.data.comment){
 					this.data.name = $("#searchBox").val();
	 				let tagslistarr = this.data.comment.split(' ');
					let arr=[];
					$.each(tagslistarr,function(i,val){
					    if(tagslistarr[i].indexOf('#') == 0){
					    	let tag = tagslistarr[i].substring(1, tagslistarr[i].length);
					      	arr.push(tag);  
					    }
					});
					if(arr.length){
						this.data.tags = arr;
					}
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
	  				//console.log(restaurant.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000}));
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
	  				let _this = this;
	  				Meteor.call('checkInappropriate', this.data, function(err, res){
	  					if(!err){
	  						if(res){
	  							_this.$state.go('post_review');
	  						}else{
	  							_this.$ionicLoading.show({ template: 'Please enter appropriate words.', noBackdrop: true, duration:1500});	
	  						}
	  					}
	  				});
  				}else{
  					this.$ionicLoading.show({ template: 'Add restaurant only', noBackdrop: true, duration:1500});
  					delete this.rt.restaurantdata;
  				}
  			}else{
  				this.$ionicLoading.show({ template: 'All fields are required except comment!', noBackdrop: true, duration:1000});
  			}
  		}else{
  			this.$ionicLoading.show({ template: 'All fields are required except comment!', noBackdrop: true, duration:1000});
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

 	search(){
 		if(Session.get('placeId')){
	 		AutoCompletion.autocomplete({
			    element: '#searchBox',       		// DOM identifier for the element
			    collection: Dishes,              	// MeteorJS collection object
			    field: 'name',                    	// Document field name to search for
			    limit: 6,                         	// Max number of elements to show
				filter: { 'restaurant.placeId': Session.get('placeId') }
			});             
 		}
 	}
}

LocationCtrl.$inject = ['$state', '$scope', '$ionicLoading'];
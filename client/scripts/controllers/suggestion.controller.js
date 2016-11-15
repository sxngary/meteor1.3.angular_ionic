import { Controller } from 'angular-ecmascript/module-helpers';

export default class SuggestionCtrl extends Controller {
  constructor() {
    super(...arguments);

    //To get user location
    _this = this;
    _this.$ionicLoading.show({ template: 'Loading ...', noBackdrop: true});
    navigator.geolocation.getCurrentPosition(
    	// success callback with current GPS coordinates 
    	function(position) {
			_this.callMethod('getSuggestions', position.coords.latitude, position.coords.longitude, (err, data) => {
		      	if (!err){
		      		Session.set('suggestions', data);
		      		_this.$ionicLoading.hide();
		      	}else{
		      		console.log(err);
		      	}
		    });
		}, 
		// onError Callback receives a PositionError object
		function onError(error) {
			_this.$ionicLoading.hide();
		    _this.$ionicLoading.show({ template: error.message, noBackdrop: true, duration:2000});
			Session.set('suggestions', []);
		});

	  	this.helpers({
	   		suggestions(){
	   			if (typeof(Session.get('suggestions')) != "undefined"){
	   				return Session.get('suggestions');
	   			}
	   		},
  			rootUrl(){
  				return Meteor.absoluteUrl();
  			}
	  	})

  	}
  	
	getNumber(num) {
		if(num){
			if(num % 1 != 0){
				num = parseInt(num);
			}
			return new Array(num); 
		}
	}

	checkHalfStar(num){
		if(num != 5){
			if(num % 1 != 0){
				return true;
			}
		}
	}

	printEmptyStar(num){
		if(num % 1 != 0){			
			num = parseInt(5 - num);
		}else{
			num = 5 - num; 
		}
		if(!num){
			return [];
		}else{
			return new Array(num); 
		}
	}

	uptoDecimal(value){
		if(value % 1 != 0){
			return value.toFixed(1);
		}else{
			return value;
		}
	}

  	redirectToDish(){
	  this.$location.url('/dish_detail');
  	}
}

SuggestionCtrl.$inject = ['$state', '$ionicLoading', '$location'];



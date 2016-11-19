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
		      		alert(err.reason);
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
		return this.Rating.getNumber(num);
	}

	checkHalfStar(num){
		return this.Rating.checkHalfStar(num);
	}

	printEmptyStar(num){
		return this.Rating.printEmptyStar(num);
	}

	uptoDecimal(value){
		return this.Rating.uptoDecimal(value);
	}

  	redirectToDish(dishId, mile){
	  	this.$location.url('/dish_detail/' + dishId + '/' + mile);
  	}
}

SuggestionCtrl.$inject = ['$state', 'Rating', '$ionicLoading', '$location'];



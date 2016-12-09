import { Controller } from 'angular-ecmascript/module-helpers';

export default class SuggestionCtrl extends Controller {
  constructor() {
    super(...arguments);

    //To get user location
    this.$reactive(this).attach(this.$scope);
	this.$scope.moredata = false;
    this.limit = 15;
    this.skip = 0;
    let _this = this;
    _this.$ionicLoading.show({ template: 'Loading ...', noBackdrop: true});
    navigator.geolocation.getCurrentPosition(
    	// success callback with current GPS coordinates 
    	function(position) {
			_this.callMethod('getSuggestions', position.coords.latitude, position.coords.longitude, _this.limit, _this.skip, (err, data) => {
		      	if (!err){
		      		Session.set('suggestions', data.res);
		      		_this.$scope.limitValue = data.limit;
		      		_this.$scope.lat = position.coords.latitude;
		      		_this.$scope.lng = position.coords.longitude;
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

  	redirectToDish(dishId){
	  	this.$location.url('/dish_detail/' + dishId);
  	}

  	loadMore(){
  		let limit = this.$scope.limitValue;
  		let skip = limit - 15;
  		_this = this;
      	this.callMethod('getSuggestions', this.$scope.lat, this.$scope.lng, limit, skip, (err, data) => {
	      	if (!err){
	      		let SessionData = Session.get('suggestions');
				let latest = SessionData.concat(data.res);
				Session.set('suggestions', latest);
				_this.$scope.limitValue = data.limit;
				if(data.count == latest.length){
		            _this.$scope.moredata=true;
		        }
				_this.$timeout(function() {
		        	_this.$scope.$broadcast('scroll.infiniteScrollComplete');
		  		}, 1500);
	      	}else{
	      		console.log(err);
	      	}
	    });
      	
  	}
}

SuggestionCtrl.$inject = ['$state', 'Rating', '$ionicLoading', '$timeout', '$location', '$reactive'];



import { Controller } from 'angular-ecmascript/module-helpers';

export default class DishDetailCtrl extends Controller {
  	constructor() {
    	super(...arguments);

	    //To get user location
	    Session.set('dishData', '');
	    this.$ionicLoading.show({ template: 'Loading...', noBackdrop: true});
	    this.dishId = this.$stateParams.dishId;
	    _this = this;
	    navigator.geolocation.getCurrentPosition(
	    	// success callback with current GPS coordinates 
	    	function(position) {
			    _this.callMethod('getDish', _this.dishId, position.coords.latitude, position.coords.longitude, (err, data) => {
			      	if (!err){
			      		Session.set('dishData', data);
			      		_this.$ionicLoading.hide();
			      	}else{
			      		console.log(err);
			      	}
			    });
			}, 
			// onError Callback receives a PositionError object
			function onError(error) {
				_this.$ionicLoading.hide();
			    _this.$ionicLoading.show({ template: error.message, noBackdrop: true, duration:1000});
				Session.set('dishData', []);
			});
  		this.helpers({
  			dishDetail(){
  				return Session.get('dishData');
  			},
	  		rootUrl(){
  				return Meteor.absoluteUrl();
  			}
  		});
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

	/*addReview(){
		this.OtherReview.showModal();
	}

	reviewGiven(reviews){
		if(reviews){
			reviewGiven = _.where(reviews, {userId: this.currentUserId});
			if(reviewGiven.length){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}*/

	uptoDecimal(value){
		return this.Rating.uptoDecimal(value);
	}

	redirectTo(placeId){
		this.$location.url('/restaurant/' + placeId);
	}

	redirectToUser(id){
		if(this.currentUser._id == id)
  			this.$location.url('/tab/profile');
  		else
  			this.$location.url('/user/' + id);
	}

	cardNumber(num) {
		return this.Rating.getNumber(num);
	}

	cardCheckHalfStar(num){
		return this.Rating.checkHalfStar(num);
	}

	cardPrintEmptyStar(num){
		return this.Rating.printEmptyStar(num);
	}

	postedTime(date){
    	return this.Rating.postedDate(date);
  	}

  	previousView(){
  		if(this.$ionicHistory.backView())
  			this.$ionicHistory.goBack(-1);
  		else
  			this.$state.go('tab.suggestion');
  	}
}

DishDetailCtrl.$inject = ['$state', 'OtherReview', 'Rating', '$stateParams', '$location', '$ionicLoading', '$ionicHistory'];
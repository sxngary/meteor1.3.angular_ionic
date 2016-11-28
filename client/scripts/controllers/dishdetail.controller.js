import { Controller } from 'angular-ecmascript/module-helpers';

export default class DishDetailCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	this.dishId = this.$stateParams.dishId;
    	this.miles = this.$stateParams.mile;
    	this.callMethod('getDish', this.dishId, (err, data) => {
	      	if (!err){
	      		Session.set('dishData', data.dish);
	      		Session.set('dishReviews', data.reviews);
	      	}else{
	      		console.log(err);
	      	}
	    });
  		this.helpers({
  			dishDetail(){
  				return Session.get('dishData');
  			},
  			miles(){
  				return this.miles;
  			},
	  		rootUrl(){
  				return Meteor.absoluteUrl();
  			},
  			reviews(){
  				return Session.get('dishReviews');
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
}

DishDetailCtrl.$inject = ['$state', 'OtherReview', 'Rating', '$stateParams', '$location'];
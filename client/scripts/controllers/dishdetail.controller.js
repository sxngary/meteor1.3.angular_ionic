import { Controller } from 'angular-ecmascript/module-helpers';

export default class DishDetailCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	this.dishId = this.$stateParams.dishId;
    	this.miles = this.$stateParams.mile;
    	this.callMethod('getDish', this.dishId, (err, data) => {
	      	if (!err){
	      		Session.set('dishData', data);
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

	addReview(){
		this.OtherReview.showModal();
	}
}

DishDetailCtrl.$inject = ['$state', 'OtherReview', '$stateParams', '$location'];
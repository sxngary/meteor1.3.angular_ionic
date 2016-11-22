import { Controller } from 'angular-ecmascript/module-helpers';

export default class RestaurantCtrl extends Controller {
	constructor() {
  	super(...arguments);

  	this.placeId = this.$stateParams.id;
  	Session.set('restaurantData', '');
  	//Get restaurant data with associated dishes.
  	this.callMethod('dishWithRestaurant', this.placeId, (err, data) => {
      	if (!err){
      		Session.set('restaurantData', data);
      	}else{
      		console.log(err);
      	}
    });
		this.helpers({
			restaurantDishes(){
				return Session.get('restaurantData');
			},
  		rootUrl(){
				return Meteor.absoluteUrl();
			}
		});
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
  postedTime(date){
    return this.Rating.postedDate(date);
  }
}

RestaurantCtrl.$inject = ['$state', 'Rating', '$stateParams'];

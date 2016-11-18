import { Controller } from 'angular-ecmascript/module-helpers';

export default class RestaurantCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	this.placeId = this.$stateParams.id;
    	Session.set('restaurantData', '');
    	//Get restaurant data with associated dishes.
    	this.callMethod('dishWithRestaurant', this.placeId, (err, data) => {
	      	if (!err){
	      		console.log(data, 'data');
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
}

RestaurantCtrl.$inject = ['$state', '$stateParams'];
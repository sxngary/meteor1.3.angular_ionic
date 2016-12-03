import { Controller } from 'angular-ecmascript/module-helpers';
import { Dishes } from '../../../lib/collections';

export default class SearchCtrl extends Controller {
  	constructor() {
    	super(...arguments);

	  	this.selectList = [
			{
				value: 'restaurant',
				label: 'by restaurant'
			}, {
				value: 'dish',
				label: 'by dish'
			}
		];
		this.selectedBy = this.selectList[0];
		Session.set("searchValue", '');
		Session.set('searchFrom', 'restaurant');
		Session.set('latlng', '');
		_this = this;
		navigator.geolocation.getCurrentPosition(
	    	// success callback with current GPS coordinates 
	    	function(position) {
				Session.set('latlng', {lng: position.coords.longitude, lat: position.coords.latitude});
			}, 
			// onError Callback receives a PositionError object
			function onError(error) {
			    _this.$ionicLoading.show({ template: error.message, noBackdrop: true, duration:2000});
			}
		);

	  	this.helpers({
	  		searchList(){
	  			if(Session.get("searchValue") && Session.get('latlng')){
		  			Meteor.subscribe('nearest-locations-data', Session.get('latlng').lng, Session.get('latlng').lat, Session.get("searchValue"), Session.get('searchFrom'));
				  	return Dishes.find({}).fetch();
			  	}
	  		},
	  		rootUrl(){
  				return Meteor.absoluteUrl();
  			}
	  	});
  	}

    changedValue(){
    	Session.set('searchFrom', this.selectedBy.value);
    }

    keyupevt(){
    	Session.set("searchValue", this.textValue);
    }

    uptoDecimal(value){
    	return this.Rating.uptoDecimal(value);
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

	redirectToDish(dishId){
		this.$location.url('/dish_detail/' + dishId);
	}
}

SearchCtrl.$inject = ['$state', 'Rating', '$ionicLoading', '$location'];
import { Accounts } from 'meteor/accounts-base';
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
	  			if(Session.get("searchValue")){
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
		if(value % 1 != 0){
			return value.toFixed(1);
		}else{
			return value;
		}
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

}

SearchCtrl.$inject = ['$state', '$ionicLoading'];
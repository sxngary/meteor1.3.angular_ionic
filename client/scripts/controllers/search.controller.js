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
			Session.set('suggestions', []);
		});

	  	this.helpers({
	  		serverUrl(){
	  			return Meteor.absoluteUrl() + 'api/search';
	  		}
	  	});
  	}
  	selectedData(selected) {
      	if (selected) {
        	//console.log(selected);
      	} else {
        	//console.log('cleared');
      	}
    }

    changedValue(){
    	Session.set('searchFrom', this.selectedBy.value);
    }

    remoteUrlRequestFn (str) {

    	return {q: str, by: Session.get('searchFrom'), lat: Session.get('latlng').lat , lng: Session.get('latlng').lng};
    }
}

SearchCtrl.$inject = ['$state', '$ionicLoading'];
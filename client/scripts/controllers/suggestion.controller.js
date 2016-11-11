import { Controller } from 'angular-ecmascript/module-helpers';

export default class SuggestionCtrl extends Controller {
  constructor() {
    super(...arguments);

    //To get user location
    /*
    navigator.geolocation.getCurrentPosition(
    	// success callback with current GPS coordinates 
    	function(position) {
	    	alert('Latitude: '        + position.coords.latitude          + '\n' +
	          	'Longitude: '         + position.coords.longitude         + '\n' +
	          	'Altitude: '          + position.coords.altitude          + '\n' +
	          	'Accuracy: '          + position.coords.accuracy          + '\n' +
	          	'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	          	'Heading: '           + position.coords.heading           + '\n' +
	          	'Speed: '             + position.coords.speed             + '\n' +
	          	'Timestamp: '         + position.timestamp                + '\n');
		}, 
		// onError Callback receives a PositionError object
		function onError(error) {
		    alert('code: '    + error.code    + '\n' +
		          'message: ' + error.message + '\n');
		});
    */
  }
  
  suggestions(){
    
  }

  redirectToDish(){
	  this.$location.url('/dish_detail');
  }
}

SuggestionCtrl.$inject = ['$state', '$ionicPopup', '$location'];



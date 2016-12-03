import Ionic from 'ionic-scripts';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class RestaurantCtrl extends Controller {
	constructor() {
  	super(...arguments);

    this.placeId = this.$stateParams.id;
  	//Get restaurant information
    _this = this;
    var service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({
        placeId: this.placeId
      }, function(place, status) {
        //console.log(place, "place");
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          _this.results = {website: place.website, phone: place.international_phone_number};
        }
    });

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
  previousView(){
    if(this.$ionicHistory.backView())
      this.$ionicHistory.goBack(-1);
    else
    this.$state.go('tab.suggestion');
  }
  redirectTo(id){
    this.$location.url('/dish_detail/' + id);
  }
  openMap(coord){
    if(coord){
      let addressLongLat = coord.reverse();
      launchnavigator.navigate(addressLongLat);
    }
  }
}

RestaurantCtrl.$inject = ['$state', 'Rating', '$stateParams', '$ionicHistory', '$location'];

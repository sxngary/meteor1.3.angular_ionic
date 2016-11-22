import { Controller } from 'angular-ecmascript/module-helpers';
import { Dishes } from '../../../lib/collections';

export default class FeedCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	this.subscribe('users-feed');
		this.helpers({
			posts(){
				return Dishes.find({}).fetch();
			},
	  		rootUrl(){
  				return Meteor.absoluteUrl();
  			}
		});
  	}
  	getUser(uploadedBy){
  		user = Meteor.users.find({_id: uploadedBy}).fetch();
  		console.log(user)
  	}
	userName(uploadedBy){
		user = Meteor.users.findOne({_id: uploadedBy});
		return { 
					fname: user.profile.firstname.charAt(0).toUpperCase(), 
					lname: user.profile.lastname.charAt(0).toUpperCase() + user.profile.lastname.slice(1).toLowerCase(),
					avatar: (user.profile.avatar ? user.profile.avatar : '')
				};
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

FeedCtrl.$inject = ['$state', 'Rating', '$log'];
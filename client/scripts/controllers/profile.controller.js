import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Dishes, userDishes } from '../../../lib/collections';

export default class ProfileCtrl extends Controller {
	constructor() {
	    super(...arguments);

	    Session.set('postLoading', false);
	    this.subscribe('dishes', () => [] , {
	    	onStart: function () {
  		      	
  		    },
  		    onReady: function () {
  		    	Session.set('postLoading', true);
  		    }
	   	});
	    const profile = this.currentUser && this.currentUser.profile;
	    this.profile = profile;
	    //this.halfFirstname = profile.firstname.charAt(0).toUpperCase();
	    //this.firstname = profile.firstname.charAt(0).toUpperCase() + profile.firstname.slice(1).toLowerCase();
	    //this.lastname = profile.lastname.charAt(0).toUpperCase() + profile.lastname.slice(1).toLowerCase();
		this.helpers({
			reviews(){
				data =  userDishes.find({uploadedBy: this.currentUser._id, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }}).fetch();
				return data.length;
			},
			followers(){
				return (this.currentUser.profile.followers ? this.currentUser.profile.followers.length : 0);
			},
			following(){
				return (this.currentUser.profile.following ? this.currentUser.profile.following.length : 0);
			},
			posts(){
				return userDishes.find({uploadedBy: this.currentUser._id , active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},{ sort: { createdAt: -1 } }).fetch();
			},
			rootUrl(){
				return Meteor.absoluteUrl();
			},
			postLoading(){
				return Session.get('postLoading');
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

  toUserReview(id){
  	this.$location.url('/user_review/' + id);
  }
}

ProfileCtrl.$inject = ['$state', 'Rating', '$location'];
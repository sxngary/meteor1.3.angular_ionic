import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Dishes, userDishes } from '../../../lib/collections';

export default class ProfileCtrl extends Controller {
	constructor() {
    super(...arguments);

    this.subscribe('dishes');
    const profile = this.currentUser && this.currentUser.profile;
    this.profile = profile;
    this.halfFirstname = profile.firstname.charAt(0).toUpperCase();
    this.firstname = profile.firstname.charAt(0).toUpperCase() + profile.firstname.slice(1).toLowerCase();
    this.lastname = profile.lastname.charAt(0).toUpperCase() + profile.lastname.slice(1).toLowerCase();
    this.email = (profile.bio ? profile.bio : '');
		this.helpers({
			reviews(){
				data =  userDishes.find({uploadedBy: this.currentUser._id}).fetch();
				return data.length;
			},
			followers(){
				return (this.currentUser.profile.followers ? this.currentUser.profile.followers.length : 0);
			},
			following(){
				return (this.currentUser.profile.following ? this.currentUser.profile.following.length : 0);
			},
			posts(){
				return userDishes.find({uploadedBy: this.currentUser._id},{ sort: { createdAt: -1 } }).fetch();
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
}

ProfileCtrl.$inject = ['$state', 'Rating', '$location'];
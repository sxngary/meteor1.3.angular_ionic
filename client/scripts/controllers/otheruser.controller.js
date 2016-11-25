import { Controller } from 'angular-ecmascript/module-helpers';
import { Dishes } from '../../../lib/collections';

export default class OtherUserCtrl extends Controller {
	constructor() {
	    super(...arguments);

	    this.userID = this.$stateParams.id;
	    this.subscribe('other-user', () => [this.userID], {});
		this.helpers({
			reviews(){
				let data =  Dishes.find({uploadedBy: this.userID}).fetch();
				return data.length;
			},
			userData(){
				let user =  Meteor.users.findOne(this.userID);
				if(user){
					following = Meteor.user().profile.following;
					followingText = 'Follow';
					if(following){
						checkFollowing = _.where(following, {userId: this.userID});
						if(checkFollowing.length){
							followingText = 'Following';
						}
					}
					return 	{
								halfFirstname:  user.profile.firstname.charAt(0).toUpperCase(),
								firstname: user.profile.firstname.charAt(0).toUpperCase() + user.profile.firstname.slice(1).toLowerCase(),
								lastname: user.profile.lastname.charAt(0).toUpperCase() + user.profile.lastname.slice(1).toLowerCase(),
								followers: (user.profile.followers ? user.profile.followers.length : 0),
								following: (user.profile.following ? user.profile.following.length : 0),
								bio: (user.profile.bio ? user.profile.bio : ''),
								avatar: (user.profile.avatar ? user.profile.avatar : ''),
								followingText: followingText
							}
				}
			},
			posts(){
				return Dishes.find({uploadedBy: this.userID},{ sort: { createdAt: -1 } }).fetch();
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

  	previousView(){
  		if(this.$ionicHistory.backView())
  			this.$ionicHistory.goBack(-1);
  		else
  			this.$state.go('tab.suggestion');
  	}

  	followUser(){
  		if(this.userID){
  			following = Meteor.user().profile.following;
			followingCheck = false;
			if(following){
				checkFollowing = _.where(following, {userId: this.userID});
				if(checkFollowing.length){
					followingCheck = true;
				}
			}
			if(!following){
	  			this.callMethod('followUser', this.userID, (err, data) => {
			      	if (!err){
			      		//console.log(data);
			      	}else{
			      		console.log(err);
			      	}
			    });
  			}else{
  				let user =  Meteor.users.findOne(this.userID);
  				if(user.profile.avatar){
  					url = Meteor.absoluteUrl() + user.profile.avatar;
  					userImg = '<img src="'+ url + '" alt="" />';
  				}else{
  					userImg = '<img src="/user_none.png" alt="" />';
  				}
  				let firstname = user.profile.firstname.charAt(0).toUpperCase() + user.profile.firstname.slice(1).toLowerCase();
				let lastname = user.profile.lastname.charAt(0).toUpperCase() + user.profile.lastname.slice(1).toLowerCase();
  				let _this = this;
	  			var myPopup = _this.$ionicPopup.show({
				    template: '<div class="user-image unfollow-image">'+ userImg + '</div><span class="unfollow-text"><b>'+ firstname + ' '+ lastname +'</b></span>',
				    scope: _this.$scope,
				    buttons: [
				      { text: '<b>Cancel</b>' },
				      {
				        text: '<b>Unfollow</b>',
				        onTap: function(e) {
				           _this.callMethod('UnFollowUser', _this.userID, (err, data) => {
						      	if (!err){
						      		//console.log(data);
						      	}else{
						      		console.log(err);
						      	}
						    });
				        }
				      }
				    ]
				});
  			}
  		}
  	}
}

OtherUserCtrl.$inject = ['Rating', '$stateParams', '$ionicHistory', '$state', '$ionicPopup'];
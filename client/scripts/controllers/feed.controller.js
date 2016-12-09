import { Controller } from 'angular-ecmascript/module-helpers';
import { Dishes } from '../../../lib/collections';

export default class FeedCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	this.$reactive(this).attach(this.$scope);
   		this.$scope.moredata = false;
   		_this = this;
    	this.call('getLength', function(err, totalLength){
    		if(!err){
    			_this.$scope.total = totalLength;
    		}
    	});

    	this.limit = 8;
    	this.skip = 0;
    	Session.set('feedLoading', false);
  		this.subscribe('users-feed', () => [this.limit, this.skip], {
  		    onStart: function () {
  		      	//console.log("New subscribtion has been started");
  		    },
  		    onReady: function () {
  		    	Session.set('feedLoading', true);
  		    }
  		});

		this.helpers({
			posts(){
				if(Session.get('feedLoading')){
					return Dishes.find({},{ sort: { createdAt: -1 } }).fetch();
				}else{
					return 'Loading';
				}
			},
  		rootUrl(){
				return Meteor.absoluteUrl();
			}
		});
  	}

	userName(uploadedBy){
		user = Meteor.users.findOne({_id: uploadedBy});
		if(user){
			return { 
				fname: user.profile.firstname.charAt(0).toUpperCase(), 
				lname: user.profile.lastname.charAt(0).toUpperCase() + user.profile.lastname.slice(1).toLowerCase(),
				avatar: (user.profile.avatar ? user.profile.avatar : '')
			};
		}
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

  	redirectTo(id){
  		if(this.currentUser._id == id)
  			this.$location.url('/tab/profile');
  		else
  			this.$location.url('/user/' + id);
  	}
  	
  	redirect(id, type){
  		if(type == 'dish')
  			this.$location.url('/dish_detail/' + id);
  		else
  			this.$location.url('/restaurant/' + id);
  	}

    toUserReveiw(id){
      this.$location.url('/user_review/' + id);
    }

  	loadMore(){
  		prevCount = Dishes.find().count();
  		if(this.$scope.total == prevCount){
            this.$scope.moredata=true;
        }
      this.subscribe('users-feed', () => [this.limit, prevCount], {});
      _this = this;
      _this.$timeout(function() {
        _this.$scope.$broadcast('scroll.infiniteScrollComplete');
  		}, 1500);
  	}
}

FeedCtrl.$inject = ['$state', '$scope', 'Rating', '$timeout', '$reactive', '$location'];
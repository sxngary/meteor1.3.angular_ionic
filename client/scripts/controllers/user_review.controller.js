import { Controller } from 'angular-ecmascript/module-helpers';

export default class UserReviewCtrl extends Controller {
  	constructor() {
    	super(...arguments);

    	Session.set('userDish', '');
    	this.$ionicLoading.show({ template: 'Loading...', noBackdrop: true});
	  	this.id = this.$stateParams.id;
	  	if(this.id){
	  		let _this = this;
	  		_this.callMethod('userDish', this.id, (err, dish) => {
		      	if (!err){
		      		Session.set('userDish', dish);
		      		_this.$ionicLoading.hide();
		      	}else{
		      		console.log(err);
		      		_this.$ionicLoading.hide();
		      	}
		    });
	  	}
  		
  		this.helpers({
			dish(){
				if(Session.get('userDish')) {
					return Session.get('userDish');
				}
			},
			rootUrl(){
				return Meteor.absoluteUrl();
			}
		});
  	}	

  	cardNumber(num) {
		return this.Rating.getNumber(num);
	}

	cardCheckHalfStar(num){
		return this.Rating.checkHalfStar(num);
	}

	cardPrintEmptyStar(num){
		return this.Rating.printEmptyStar(num);
	}

  	previousView(){
  		if(this.$ionicHistory.backView())
  			this.$ionicHistory.goBack(-1);
  		else
  			this.$state.go('tab.suggestion');
  	}

  	redirectTo(id){
  		if(this.currentUser._id == id)
  			this.$location.url('/tab/profile');
  		else
  			this.$location.url('/user/' + id);
  	}
}

UserReviewCtrl.$inject = ['$state', 'Rating', '$stateParams', '$ionicHistory', '$ionicLoading', '$location'];
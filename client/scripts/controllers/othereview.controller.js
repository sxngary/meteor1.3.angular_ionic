import { Controller } from 'angular-ecmascript/module-helpers';

export default class OtherReviewCtrl extends Controller {
  constructor() {
    super(...arguments);

  	this.dish_id = this.$stateParams.dishId;
  }
  
  closeTagModal() {
    this.OtherReview.hideModal();
  }

  saveReview(){
  	if(this.data.comment && this.data.rating){
  		_this = this;
	  	_this.callMethod('saveOtherUserReview', _this.dish_id, _this.data, (err, res) => {
	      	if (!err){
	      		_this.OtherReview.hideModal();
	      	}else{
	      		console.log(err);
	      	}
	    });
  	}
  }
}

OtherReviewCtrl.$inject = ['OtherReview', '$state', '$stateParams'];
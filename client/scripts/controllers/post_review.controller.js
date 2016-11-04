import { Controller } from 'angular-ecmascript/module-helpers';

export default class PostReviewCtrl extends Controller {
  	constructor() {
    	super(...arguments);
    	
    	this.helpers({
	   		dishData(){
	   			if(Session.get('dishData')){
		   			return {
		   				restaurant : (Session.get('restaurant').name ? Session.get('restaurant').name : ''),
			    		dishName :(Session.get('dishData').dishname ? Session.get('dishData').dishname : ''),
			    		comment :(Session.get('dishData').comment ? Session.get('dishData').comment : '')
	   				}
	   			}
	   		},
	   		rating(){
	   			return (Session.get('dishData').rating ? Session.get('dishData').rating : 0)
	   		}
	   	});
  	}

  	postAndSave(){
  		alert(1)
  	}
}

PostReviewCtrl.$inject = ['$state'];
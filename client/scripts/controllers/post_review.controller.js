import { Controller } from 'angular-ecmascript/module-helpers';

export default class PostReviewCtrl extends Controller {
  	constructor() {
    	super(...arguments);
    	
    	this.helpers({
	   		dishImage(){
	   			if(Session.get('clickedImage'))
	   				return Meteor.absoluteUrl() + Session.get('clickedImage').bigger;
	   		},
	   		dishData(){
	   			if(Session.get('dishData')){
		   			return {
		   				restaurant : Session.get('restaurant').name,
			    		dishName :(Session.get('dishData').name ? Session.get('dishData').name : ''),
			    		comment :(Session.get('dishData').comment ? Session.get('dishData').comment : '')
	   				}
	   			}
	   		},
	   		rating(){
	   			return (Session.get('dishData') ? Session.get('dishData').rating : 0)
	   		}
	   	});
  	}

  	postAndSave(isChecked){
  		dishData = Session.get('dishData');
  		dishData['restaurant'] = [Session.get('restaurant')];
	  	if(Session.get('clickedImage')){
	  		dishData['imageId'] = Session.get('clickedImage').imageId;
	  	}else{
	  		dishData['videoThumb'] = Session.get('videoImagePath');
	  		dishData['video'] = Session.get('videoPath').server;
	  	}
	  	dishData['uploadedBy'] = this.currentUser._id;
	  	dishData['shared_on_facebook'] = false;	  	
  		//if share on facebook
  		if(isChecked){
  			dishData['shared_on_facebook'] = isChecked;
  		}
  		dishData['dateMillisecond'] = new Date().getTime();
  		dishData['offset'] = new Date().getTimezoneOffset()/ 60;
  		dishData['createdAt'] = new Date();
  		Meteor.call('save', dishData,function(err, res){
  			if(!err){

  			}else{

  			}
  		});
  	}
}

PostReviewCtrl.$inject = ['$state'];
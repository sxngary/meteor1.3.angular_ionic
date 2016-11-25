import { Meteor } from 'meteor/meteor';
import { Dishes } from '../lib/collections';

//Publish user posts.
Meteor.publish("dishes", function(){
    Mongo.Collection._publishCursor( Dishes.find({uploadedBy: this.userId},{ sort: { createdAt: -1 } }), this, 'userDishes'); 
    this.ready();
});

//Publish user posts.
Meteor.publishComposite('users-feed', function (limit, skip) {
  return {
    find: function () {
      return Dishes.find({},{ skip: skip, limit: limit, sort: { createdAt: -1 } });
    },
    children: [{
      	find: function (dish) {
        	return Meteor.users.find({_id: dish.uploadedBy}, { fields: { profile: 1} });
      	}
    }]
  }
});

//Publish other users post with profile data.
Meteor.publishComposite('other-user', function (userId) {
  return {
    find: function () {
      return Dishes.find({uploadedBy: userId},{ sort: { createdAt: -1 } });
    },
    children: [{
      	find: function (dish) {
        	return Meteor.users.find({_id: userId}, { fields: { profile: 1} });
      	}
    }]
  }
});

//Publish nearest dishes and restairant based data for user.
Meteor.publish('nearest-locations-data', function (longitude, latitude, searchText, searchFrom ) {
  	var parts = searchText.trim().split(/[ \-\:]+/);
	exp = new RegExp("(" + parts.join('|') + ")", "ig");
	//{ $regex: searchText, $options: 'i' }
	if(searchFrom == 'dish'){
	  	ReactiveAggregate(this, Dishes, [
		    { 
		    	"$geoNear": {
				    "near": {
			            "type": "Point",
			            "coordinates": [ Number(longitude), Number(latitude) ]
			        }, 
			        "maxDistance": 20 * 1609.34,
			        "query": {name:{ $regex: exp, $options: 'i' }, name: 1},
			        "spherical": true,
			        "distanceField": "distance",
			        "distanceMultiplier": 0.000621371
				}
			}
		]);
	}else{
		ReactiveAggregate(this, Dishes, [
		    { 
		    	"$geoNear": {
				    "near": {
			            "type": "Point",
			            "coordinates": [ Number(longitude), Number(latitude) ]
			        }, 
			        "maxDistance": 20 * 1609.34,
			        "query": {'restaurant.name':{ $regex: exp, $options: 'i' }, 'restaurant.name': 1},
			        "spherical": true,
			        "distanceField": "distance",
			        "distanceMultiplier": 0.000621371
				}
			}
		]);
	}
});
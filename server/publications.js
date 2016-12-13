import { Meteor } from 'meteor/meteor';
import { Dishes } from '../lib/collections';

Dishes._ensureIndex( { tags: 1 } );
//Publish user posts.
Meteor.publish("dishes", function(){
    Mongo.Collection._publishCursor( Dishes.find({uploadedBy: this.userId, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},{ sort: { createdAt: -1 } }), this, 'userDishes'); 
    this.ready();
});

//Dish name search using publish.
Meteor.publish('dish-search', function(placeId){
	return Dishes.find({'restaurant.placeId': placeId},{sort: { createdAt: -1 }, fields: {name:1, 'restaurant.placeId': 1} });
});

//Publish user posts.
Meteor.publishComposite('users-feed', function (limit, skip) {
  	return {
    	find: function () {
    		var user = Meteor.users.findOne(this.userId);
       		if(user.profile.following){
       			following = _.pluck(user.profile.following, 'userId');
       			return Dishes.find({uploadedBy: {$in: following}, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},{ skip: skip, limit: limit, sort: { createdAt: -1 } });
       		}
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
      return Dishes.find({uploadedBy: userId, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},{ sort: { createdAt: -1 } });
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
			        "maxDistance": MILES * METERS_PER_MILE,
			        "query": {name:{ $regex: exp, $options: 'i' }, name: 1, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},
			        "spherical": true,
			        "distanceField": "distance",
			        "distanceMultiplier": DISTANCEMULTIPLIER,
			        "num": 50
				}
			}
		]);
	}else if(searchFrom == 'restaurant'){
		ReactiveAggregate(this, Dishes, [
		    { 
		    	"$geoNear": {
				    "near": {
			            "type": "Point",
			            "coordinates": [ Number(longitude), Number(latitude) ]
			        }, 
			        "maxDistance": MILES * METERS_PER_MILE,
			        "query": {'restaurant.name':{ $regex: exp, $options: 'i' }, 'restaurant.name': 1, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},
			        "spherical": true,
			        "distanceField": "distance",
			        "distanceMultiplier": DISTANCEMULTIPLIER,
			        "num": 50
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
			        "maxDistance": MILES * METERS_PER_MILE,
			        "query": {'tags':{ $regex: exp, $options: 'i' }, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},
			        "spherical": true,
			        "distanceField": "distance",
			        "distanceMultiplier": DISTANCEMULTIPLIER,
			        "num": 50
				}
			}
		]);
	}
});
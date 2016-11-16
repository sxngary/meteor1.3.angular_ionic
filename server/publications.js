import { Meteor } from 'meteor/meteor';
import { Dishes } from '../lib/collections';

Meteor.publish('dishes', function() {
  	return Dishes.find({uploadedBy: this.userId},{ sort: { createdAt: 1 } });
});

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
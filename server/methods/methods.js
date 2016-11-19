import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dishes, Restaurants } from '../../lib/collections';

Dishes._ensureIndex({'restaurant.location':'2dsphere'});
Restaurants._ensureIndex({'location':'2dsphere'});

Meteor.methods({
	//This function is used to convert image from base64string and save created image in uploads folder.
  	uploadImage(base64String, width, height){
  		var _dirPath  = base + 'media/uploads/dishes';
  		var myFuture = new Future();
  		// declare a regexp to match the non base64 first characters
		var dataUrlRegExp = /^data:image\/\w+;base64,/;
		// remove the "header" of the data URL via the regexp
		var base64Data = base64String.replace(dataUrlRegExp, "");
		// declare a binary buffer to hold decoded base64 data
		var imageBuffer = new Buffer(base64Data, "base64");
		uniqueStr = new Meteor.Collection.ObjectID()._str;
		if(!fs.existsSync(_dirPath)){	
			fs.mkdir(_dirPath, 0766, function(error){
				if(!error){
					fs.writeFile(_dirPath + '/' + uniqueStr + '_original.jpeg', imageBuffer, function(err) {
					    if (!err) {
					        gm(_dirPath + '/' + uniqueStr + '_original.jpeg')
					            .resize(width, height, '^')
					            .gravity('Center')
					            .crop(width, height)
					            .quality(100)
					            .write(_dirPath + '/' + uniqueStr + '.jpeg', function(err) {
					                if (!err) {
					                	gm(_dirPath + '/' + uniqueStr + '_original.jpeg')
								            .resize(105, 105, '^')
								            .gravity('Center')
								            .crop(105, 105)
								            .quality(100)
								            .write(_dirPath + '/' + uniqueStr + '_square.jpeg', function(err) {
								                if (!err) {
								                	return myFuture.return(uniqueStr);
								            	}
								            });
					                	
					            	}
					            });
					    } else {
					        myFuture.throw(err);
					    }
					});
  				}
  			});
  		}else{
  			Fiber(function() {
	  			fs.writeFile(_dirPath + '/' + uniqueStr + '_original.jpeg', imageBuffer, function(err) {
				    if (!err) {
				        gm(_dirPath + '/' + uniqueStr + '_original.jpeg')
				            .resize(width, height, '^')
				            .gravity('Center')
				            .crop(width, height)
				            .quality(100)
				            .write(_dirPath + '/' + uniqueStr + '.jpeg', function(err) {
				                if (!err) {
				                	gm(_dirPath + '/' + uniqueStr + '_original.jpeg')
							            .resize(105, 105, '^')
							            .gravity('Center')
							            .crop(105, 105)
							            .quality(100)
							            .write(_dirPath + '/' + uniqueStr + '_square.jpeg', function(err) {
							                if (!err) {
							                	return myFuture.return(uniqueStr);
							            	}
							            });
				            	}
				            });
				    } else {
				        myFuture.throw(err);
				    }
				});
  			}).run();
  		}
  		return myFuture.wait();
  	},
  	save(data){
  		dish_id = Dishes.insert(data);
  		if(dish_id){
  			checkExistsRe = Restaurants.findOne({placeId: data.restaurant.placeId});
  			if(checkExistsRe){
  				return Restaurants.update({_id:checkExistsRe._id}, { $push: { dishes: {dishId: dish_id} } });
  			}else{
	  			data.restaurant['dishes'] = [{dishId: dish_id}];
	  			data.restaurant['uploadedBy'] = data.uploadedBy;
	  			data.restaurant['offset'] = data.offset;
	  			data.restaurant['createdAt'] = data.createdAt;
	  			return Restaurants.insert(data.restaurant);
  			}
  		}
  	},
  	getSuggestions(lat, lng){
  		var METERS_PER_MILE = 1609.34
		// return Dishes.find({ 'restaurant.location': { $nearSphere: { $geometry: { type: "Point", coordinates: [ lng, lat ] }, $maxDistance: 10 * METERS_PER_MILE, distanceField: 'distance',  distanceMultiplier: 0.000621371} } }).fetch();
  		checKDishes = Dishes.find().count();
	  	if(checKDishes){
	  		return Dishes.aggregate([
			    { "$geoNear": {
			        "near": {
			            "type": "Point",
			            "coordinates": [ Number(lng), Number(lat) ]
			        }, 
			        "maxDistance": 20 * METERS_PER_MILE,
			        "spherical": true,
			        "distanceField": "distance",
			        "distanceMultiplier": 0.000621371
			    }}
			]);
  		}else{
  			return [];
  		}
  	},
  	getDish(dishId){
  		return Dishes.findOne(dishId);
  	},
  	dishWithRestaurant(placeId){
  		return Dishes.find({'restaurant.placeId': placeId}).fetch();
  	},
  	saveOtherUserReview(id, data){
  		checkDish = Dishes.findOne(id);
  		checkUser = _.where(checkDish.reviews, {userId: Meteor.userId()});
	  	if(!checkUser.length){
	  		if(checkDish.reviews){
	  			preReviews = checkDish.reviews;
	  			updated = Dishes.update({_id:id}, { $push: { reviews: { userId: Meteor.userId(), rating: data.rating, comment: data.comment} } });
	  		}else{
	  			preReviews = [];
	  			updated = Dishes.update({_id:id}, { $set: { reviews: [{ userId: Meteor.userId(), rating: data.rating, comment: data.comment}] } });
	  		}
  			if(updated && preReviews.length){
  				revSum = Dishes.aggregate([
  					{ $match: { _id: id } },
				    { $unwind: "$reviews" },
				    { $group: {
				        _id: '$_id', 
				        sum: { $sum: '$reviews.rating' }
				    } } 
				]);
				if(revSum.length){
					otherUsersRv = Dishes.findOne(id);
					totalRv = Number(revSum[0].sum) + Number(checkDish.rating);
					totalusr = Number(otherUsersRv.reviews.length)  + 1 ;
					average = totalRv/totalusr;
					if(average % 1 != 0){
						toFix = average.toFixed(1);
						NumberIs = roundAbout(toFix);
					}else{
						NumberIs = average;
					}
					return Dishes.update({_id: id}, {$set: {averageReview: Number(NumberIs)}});
				}	
  			}else{
  				totalRv = Number(checkDish.rating) + Number(data.rating)
				average = totalRv/2;
				if(average % 1 != 0){
					toFix = average.toFixed(1);
					NumberIs = roundAbout(toFix);
				}else{
					NumberIs = average;
				}
  				return Dishes.update({_id: id}, {$set: {averageReview: Number(NumberIs)}});
  			}
  		}
  	}
});

function roundAbout(num){
	n = (num + "").split(".");
	if(parseInt(n[1]) == 5){
		NumberIs = num;
	}else{
		roundAb = Math.round(num);
		if(roundAb > num){
			NumberIs = roundAb;
		}else{
			NumberIs = roundAb + 0.5;
		}
	}	
	return NumberIs;
}

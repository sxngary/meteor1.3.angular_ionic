import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
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
  		let dish_id = Dishes.insert(data);
  		if(dish_id){
  			let checkExistsRe = Restaurants.findOne({placeId: data.restaurant.placeId});
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
  	getSuggestions(lat, lng, limit, skip){
  		let checKDishes = Dishes.find({ active:{ $ne: 1 }, isDeleted:{ $ne: 1 } }).count();
	  	if(checKDishes){
	  		let data = Dishes.aggregate([
			    { "$geoNear": {
			        "near": {
			            "type": "Point",
			            "coordinates": [ Number(lng), Number(lat) ]
			        }, 
			        "maxDistance": MILES * METERS_PER_MILE,
			        "query": { active:{ $ne: 1 }, isDeleted:{ $ne: 1 } },
			        "spherical": true,
			        "distanceField": "distance",
			        "num": limit,
			        "distanceMultiplier": DISTANCEMULTIPLIER
			    }}, {
				    "$skip": skip
				}
			]);
			return {res: data, count: checKDishes, limit: limit + 15 };
  		}else{
  			return {res: [], count: checKDishes};
  		}
  	},
  	getDish(dishId,lat,lng){
  		//let dish = Dishes.findOne(dishId);
  		let dishData = Dishes.aggregate([
		    { "$geoNear": {
		        "near": {
		            "type": "Point",
		            "coordinates": [ Number(lng), Number(lat) ]
		        }, 
		        "query": {_id: dishId},
		        "spherical": true,
		        "distanceField": "distance",
		        "distanceMultiplier": DISTANCEMULTIPLIER
		    }}
		]);
  		if(dishData.length){
  			let dish = dishData[0];
  			reviews = Dishes.find({name: dish.name, 'restaurant.placeId': dish.restaurant.placeId, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},{ sort: { createdAt: -1 } }).fetch();
  			if(reviews.length > 0){
  				reviews.map(function(review, index){
  					userData = Meteor.users.findOne(review.uploadedBy);
  					reviews[index]['firstname'] = userData.profile.firstname.charAt(0).toUpperCase();
  					reviews[index]['lastname'] = userData.profile.lastname.charAt(0).toUpperCase() + userData.profile.lastname.slice(1).toLowerCase();
  					reviews[index]['avatar'] = (userData.profile.avatar ? userData.profile.avatar : '');
  				});
  			}
  			return { dish:dish, reviews: reviews};
	  	}else {
	  		return { dish:[], reviews: []};
	  	}
  	},
  	dishWithRestaurant(placeId){
  		return Dishes.find({'restaurant.placeId': placeId, active:{ $ne: 1 }, isDeleted:{ $ne: 1 }},{ sort: { createdAt: -1 } }).fetch();
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
  	},
  	uploadUserImage(base64String){
  		var _dirPath  = base + 'media/uploads/user';
  		var myFuture = new Future();
  		// declare a regexp to match the non base64 first characters
		var dataUrlRegExp = /^data:image\/\w+;base64,/;
		// remove the "header" of the data URL via the regexp
		var base64Data = base64String.replace(dataUrlRegExp, "");
		// declare a binary buffer to hold decoded base64 data
		var imageBuffer = new Buffer(base64Data, "base64");
		userId = new Meteor.Collection.ObjectID()._str;
		uId = Meteor.userId();
		if(!fs.existsSync(_dirPath)){	
			fs.mkdir(_dirPath, 0766, function(error){
				if(!error){
					fs.writeFile(_dirPath + '/' + userId + '.jpeg', imageBuffer, function(err) {
					    if (!err) {
					        gm(_dirPath + '/' + userId + '.jpeg')
					            .resize(150, 150, '^')
					            .gravity('Center')
					            .crop(150, 150)
					            .quality(100)
					            .write(_dirPath + '/' + userId + '_resize.jpeg', function(err) {
					                if (!err) {
					                	Fiber(function() {
						               		updated = Accounts.users.update({_id: uId}, {$set: {'profile.avatar': 'uploads/user/' + userId + '_resize.jpeg', 'profile.avatarId': userId}});
						        			return myFuture.return('uploads/user/'+ userId + '_resize.jpeg'); 	
					            		}).run();
					            	}
					            });
					    } else {
					        myFuture.throw(err);
					    }
					});
  				}
  			});
			
  		}else{
  			if(Meteor.user().profile.avatarId){
	  			var files = [base + 'media/uploads/user/' + Meteor.user().profile.avatarId + '.jpeg', base + '/media/' + Meteor.user().profile.avatar];
	  			deleteFiles(files, function(err) {
			        if(err) return console.log(err);
			      	
			      	fs.writeFile(_dirPath + '/' + userId + '.jpeg', imageBuffer, function(err) {
					    if (!err) {
					    	gm(_dirPath + '/' + userId + '.jpeg')
					            .resize(150, 150, '^')
					            .gravity('Center')
					            .crop(150, 150)
					            .quality(100)
					            .write(_dirPath + '/' + userId + '_resize.jpeg', function(err) {
					                if (!err) {
					                	Fiber(function() {
						               		updated = Accounts.users.update({_id: uId}, {$set: {'profile.avatar': 'uploads/user/' + userId + '_resize.jpeg', 'profile.avatarId': userId}});
						        			return myFuture.return('uploads/user/'+ userId + '_resize.jpeg'); 
					            		}).run();
					            	}
					            });
					    } else {
					        myFuture.throw(err);
					    }
					});  
			   	});
  			}else{
  				fs.writeFile(_dirPath + '/' + userId + '.jpeg', imageBuffer, function(err) {
				    if (!err) {
				    	gm(_dirPath + '/' + userId + '.jpeg')
				            .resize(150, 150, '^')
				            .gravity('Center')
				            .crop(150, 150)
				            .quality(100)
				            .write(_dirPath + '/' + userId + '_resize.jpeg', function(err) {
				                if (!err) {
				                	Fiber(function() {
					               		updated = Accounts.users.update({_id: uId}, {$set: {'profile.avatar': 'uploads/user/' + userId + '_resize.jpeg', 'profile.avatarId': userId}});
					        			return myFuture.return('uploads/user/'+ userId + '_resize.jpeg'); 
				            		}).run();
				            	}
				            });
				    } else {
				        myFuture.throw(err);
				    }
				});
  			}
  		}
  		return myFuture.wait();
  	},
  	updateUsername(data){
  		let user = Meteor.users.findOne({username: data.username, _id: { $ne: Meteor.userId()}});
  		if(!user){
	  		return Meteor.users.update({_id: Meteor.userId()}, {$set: {
				"username": data.username,
				"profile.firstname": data.firstname,
				"profile.lastname": data.lastname,
				"profile.bio": data.bio,
				"profile.zip_code": data.zip_code
			}});
  		}else{
  			throw new Meteor.Error( 404, 'Username already exists.' );
  		}
  	},
  	getLength(){
  		var user = Meteor.user();
       	if(user.profile.following){
       		following = _.pluck(user.profile.following, 'userId');
  			count = Dishes.find({uploadedBy: {$in: following}}).count();
  		}else{
  			count = 0
  		}
  		return count;
  	},
  	followUser(otherUserId){
		if(!Meteor.user().profile.following){
			updateMe = Meteor.users.update({_id: Meteor.userId()}, {$set:{ 'profile.following': [{userId: otherUserId}]}});
		}else{
			updateMe = Meteor.users.update({_id: Meteor.userId()}, { $push: { 'profile.following': { userId: otherUserId }}});
		}
		if(updateMe){
			otherUser = Meteor.users.findOne({_id: otherUserId});
			if(!otherUser.profile.followers){
	  			updateOther = Meteor.users.update({_id: otherUser._id}, {$set:{ 'profile.followers': [{userId: Meteor.userId()}]}});
	  		}else{
	  			updateOther = Meteor.users.update({_id: otherUser._id}, { $push: { 'profile.followers': { userId: Meteor.userId()}}});
	  		}
			return updateOther;
		}
  	},
  	UnFollowUser(otherUserId){
  		if(Meteor.user().profile.following){
  			checkFollowing = Meteor.user().profile.following;
  			if(checkFollowing.length == 1){
  				checkUserId = _.where(checkFollowing, { userId: otherUserId});
  				if(checkUserId.length){
  					updateMe = Meteor.users.update({_id: Meteor.userId()}, {$unset:{ 'profile.following': 1}}, false, true);
  				}
  			}else if(checkFollowing.length > 1){
  				updateMe = Meteor.users.update({ _id: Meteor.userId()}, {$pull : { "profile.following" : { "userId": otherUserId}}});
  			}
  			if(updateMe){
  				otherUser = Meteor.users.findOne({_id: otherUserId});
  				checkFollowers = otherUser.profile.followers;
				if(checkFollowers.length == 1){
					checkUser = _.where(checkFollowers, { userId: Meteor.userId()});
		  			if(checkUser.length){
		  				updateOther = Meteor.users.update({_id: otherUserId}, {$unset:{ 'profile.followers': 1}}, false, true);
		  			}
		  		}else if(checkFollowers.length > 1){
		  			updateOther = Meteor.users.update({_id: otherUserId}, {$pull : { "profile.followers" : { "userId": Meteor.userId()}}});
		  		}
				return updateOther;
  			}
  		}
  	},
  	userDish(dishId){
  		let dish = Dishes.findOne(dishId);
  		if(dish){
  			let user = Meteor.users.findOne({_id: dish.uploadedBy}, { fields: { profile: 1} });
  			if(user){
	  			if(user.profile.firstname){
		  			user.profile.firstname = user.profile.firstname.charAt(0).toUpperCase() + user.profile.firstname.slice(1).toLowerCase();
		  			//user.profile.lastname = user.profile.lastname.charAt(0).toUpperCase() + user.profile.lastname.slice(1).toLowerCase();
		  		}
		  		return {dish: dish, user: user};
		  	}
  		}
  	}
});

function deleteFiles(files, callback){
  var i = files.length;
  files.forEach(function(filepath){
    fs.unlink(filepath, function(err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

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

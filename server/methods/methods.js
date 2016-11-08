import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dishes } from '../../lib/collections';

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
  		return Dishes.insert(data);
  	}
});
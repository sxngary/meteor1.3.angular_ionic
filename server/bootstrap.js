import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration'
import { Dishes, Restaurants } from '../lib/collections';

Meteor.startup(function() {
	//Configuration settings for facebook login
	ServiceConfiguration.configurations.remove({
	    service: 'facebook'
	});
 
	ServiceConfiguration.configurations.insert({
	    service: 'facebook',
	    appId: '1699875387003760',
	    secret: '86f1da6750162686eaff73f0831cd44b'
	});

	//include node modules here.
	fs = Npm.require('fs');
  	path = Npm.require('path');
	fs = Npm.require('fs');
	Fiber = Npm.require('fibers');
	Future = Npm.require('fibers/future');
	multer  = require('multer');
	exec = Npm.require('child_process').exec;
	mime = Npm.require('mime');
	base = path.resolve('.').split('.meteor')[0];


	WebApp.connectHandlers.use(function(req, res, next) {
	    var re = /^\/uploads\/(.*)$/.exec(req.url);
	    if (re !== null) {   // Only handle URLs that start with /url_path/*
	    	var filePath = process.env.PWD + '/media' + re[0];
	        var data = fs.readFileSync(filePath);
	        res.writeHead(200, {
                'Content-Type': 'image'
            });
	        res.write(data);
	        res.end();
	    }else {  // Other urls will have default behaviors
	        next();
	    }
	});

	//Storage folder in which file saved.
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
		    cb(null, base + 'media/uploads/video/');
		},
		filename: function (req, file, cb) {
		    cb(null, new Meteor.Collection.ObjectID()._str + '.' + mime.extension(file.mimetype));
		}
	});


	uploadMulter = multer({ storage: storage })
	Picker.middleware(uploadMulter.single('dish'));

	//Defined server routes
	Picker.route('/upload', function(params, req, res, next) {
		var name = req.file.filename.split('.');
		videoPath = base + 'media/uploads/video/' + req.file.filename;
	  	exec("ffmpeg  -itsoffset -1  -i " + videoPath + " -vcodec mjpeg -vframes 1 -an -f rawvideo -s " + req.body.width + "x" + req.body.height + " " + base + "/media/uploads/video_thumb/"+ name[0] +".jpg", function(err, resp){
	  		if(!err) {
	  			req.file['image'] = 'uploads/video_thumb/' + name[0] + '.jpg';
	  			res.end(JSON.stringify(req.file));
	  		}else{
	  			console.log(err);
	  		}
	  	});
	});

	//api to search for dishes
	/*Picker.route('/search', function(params, req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		if(params.query.by && params.query.q && params.query.lat){
			searchFrom = params.query.by;
			searchText = params.query.q;
			if(searchFrom == 'restaurant'){
				//data = Restaurants.find({'name':{ $regex: searchText, $options: 'i' }, name:1}).fetch();
				data = Dishes.aggregate([
				    { "$geoNear": {
				        "near": {
				            "type": "Point",
				            "coordinates": [ Number(params.query.lng), Number(params.query.lat) ]
				        }, 
				        "maxDistance": 20 * 1609.34,
				        "query": {'restaurant.name':{ $regex: searchText, $options: 'i' }, 'restaurant.name': 1},
				        "spherical": true,
				        "distanceField": "distance",
				        "distanceMultiplier": 0.000621371
				    }}
				]);
			}else{
				//data = Dishes.find({'name':{ $regex: searchText, $options: 'i' }, name:1}).fetch();
				data = Dishes.aggregate([
				    { "$geoNear": {
				        "near": {
				            "type": "Point",
				            "coordinates": [ Number(params.query.lng), Number(params.query.lat) ]
				        }, 
				        "maxDistance": 20 * 1609.34,
				        "query": {name:{ $regex: searchText, $options: 'i' }, name: 1},
				        "spherical": true,
				        "distanceField": "distance",
				        "distanceMultiplier": 0.000621371
				    }}
				]);
			}
			res.end(JSON.stringify({result: true, items: data}));
		}else{
			res.end(JSON.stringify({result: true, items: []}));
		}
	});*/

	//Dish name search.
	Picker.route('/api/search', function(params, req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		searchText = params.query.q, placeId = params.query.place;
		if(searchText && placeId){
			var parts = searchText.trim().split(/[ \-\:]+/);
			exp = new RegExp("(" + parts.join('|') + ")", "ig");
			data = Dishes.find({name: { $regex: exp, $options: 'i' }, 'restaurant.placeId': placeId}).fetch();
			res.end(JSON.stringify(data));
		}else{
			res.end(JSON.stringify([]));
		}
	});
	
});
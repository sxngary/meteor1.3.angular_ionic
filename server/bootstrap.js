import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration'

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
		    cb(null, new Meteor.Collection.ObjectID()._str + '.' + file.mimetype.split('/')[1]);
		}
	});

	uploadMulter = multer({ storage: storage })

	Picker.middleware(uploadMulter.single('dish'));

	//Defined server routes
	Picker.route('/upload', function(params, req, res, next) {
	  	res.end(JSON.stringify(req.file));
	});

});
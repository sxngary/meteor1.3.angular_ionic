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

	fs = Npm.require('fs');
  	path = Npm.require('path');
	fs = Npm.require('fs');
	Fiber = Npm.require('fibers');
	Future = Npm.require('fibers/future');
	
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
});
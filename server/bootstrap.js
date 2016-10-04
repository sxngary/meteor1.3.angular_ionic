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
});
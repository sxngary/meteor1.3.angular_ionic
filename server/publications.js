import { Meteor } from 'meteor/meteor';
import { Dishes } from '../lib/collections';

Meteor.publish('dishes', function() {
  	return Dishes.find({uploadedBy: this.userId},{ sort: { createdAt: 1 } });
});
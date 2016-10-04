import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';

Meteor.publish('users', function() {
  return Meteor.users.find({}, { fields: { profile: 1 } });
});
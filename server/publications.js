import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from './collections/collections';

Meteor.publish('users', function() {
  return Meteor.users.find({}, { fields: { profile: 1 } });
});
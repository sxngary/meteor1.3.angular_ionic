import { Mongo } from 'meteor/mongo';

export const Dishes = new Mongo.Collection('dishes');
export const Restaurants = new Mongo.Collection('restaurants');
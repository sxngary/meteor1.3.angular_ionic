import { Mongo } from 'meteor/mongo';

export const Dishes = new Mongo.Collection('dishes');
export const Restaurants = new Mongo.Collection('restaurants');
export const Setting = new Mongo.Collection('setting');
export const Inappropriate = new Mongo.Collection('inappropriate');
// partial collections
export const userDishes = new Mongo.Collection('userDishes');
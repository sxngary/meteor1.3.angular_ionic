import { Mongo } from 'meteor/mongo';

export const Dishes = new Mongo.Collection('dishes');
export const Restaurants = new Mongo.Collection('restaurants');
// partial collections
export const userDishes = new Mongo.Collection('userDishes');
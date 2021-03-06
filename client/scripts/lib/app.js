// Libs
import 'angular-animate';
import 'angular-meteor';
import 'angular-meteor-auth';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import 'ng-infinite-scroll';
import 'angular-validation/dist/angular-validation';
import 'angular-validation/dist/angular-validation-rule';
import './angular-validation-schema.min';
import './autocomplete.min';
import './ng-rateit';
import 'vintagejs/dist/angular.vintage';
import Angular from 'angular';
import Loader from 'angular-ecmascript/module-loader';
import { Meteor } from 'meteor/meteor';

// Modules
import HomeCtrl from '../controllers/welcome.controller';
import SignupCtrl from '../controllers/signup.controller';
import LoginCtrl from '../controllers/login.controller';
import ForgotCtrl from '../controllers/forgot.controller';
import SuggestionCtrl from '../controllers/suggestion.controller';
import SearchCtrl from '../controllers/search.controller';
import ReviewCtrl from '../controllers/review.controller';
import FeedCtrl from '../controllers/feed.controller';
import ProfileCtrl from '../controllers/profile.controller';
import SettingsCtrl from '../controllers/settings.controller';
import DishDetailCtrl from '../controllers/dishdetail.controller';
import FilterCtrl from '../controllers/filter.controller';
import LocationCtrl from '../controllers/location.controller';
import PostReviewCtrl from '../controllers/post_review.controller';
import ChangePasswordCtrl from '../controllers/change_password.controller';
import RestaurantCtrl from '../controllers/restaurant.controller';
import OtherReviewCtrl from '../controllers/othereview.controller';
import OtherUserCtrl from '../controllers/otheruser.controller';
import UserReviewCtrl from '../controllers/user_review.controller';
import ReviewService from '../services/review.service';
import RatingService from '../services/rating.service';

import Routes from '../routes';

const App = 'The Dish';

// App
app = Angular.module(App, [
  'angular-meteor',
  'angular-meteor.auth',
  'ionic',
  'validation', 
  'validation.rule',
  'validation.schema',
  'vintagejs',
  'ngRateIt',
  'google.places',
  'infinite-scroll'
]);

// you might call this after your module initalization
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250)

//Load modules
new Loader(App)
  .load(RatingService)
  .load(SuggestionCtrl)
  .load(HomeCtrl)
  .load(LoginCtrl)
  .load(ForgotCtrl)
  .load(SignupCtrl)
  .load(SearchCtrl)
  .load(ReviewCtrl)
  .load(FeedCtrl)
  .load(ProfileCtrl)
  .load(SettingsCtrl)
  .load(DishDetailCtrl)
  .load(FilterCtrl)
  .load(LocationCtrl)
  .load(PostReviewCtrl)
  .load(ChangePasswordCtrl)
  .load(OtherReviewCtrl) 
  .load(OtherUserCtrl)
  .load(ReviewService)
  .load(RestaurantCtrl)
  .load(UserReviewCtrl)
  .load(Routes);

  // Using config phase to add Schema's to schemaProvider
  app.config(function(validationSchemaProvider){
    //Registeration form and login form validation rules.
    var Register = {
      email:{
        'validations': 'required,email',
        'validate-on': 'submit',
        'messages':{
          'required': {
            'error':'This field is required!'
          },
          'email': {
            'error': 'This should be valid email!'
          }
        }
      }
    };
    validationSchemaProvider.set("Register", Register);
  });

  //Add directive for image not found.
  app.directive('errSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    }
  });

// Startup
if (Meteor.isCordova) {
  Angular.element(document).on('deviceready', onReady);
}
else {
  Angular.element(document).ready(onReady);
}

function onReady() {
  Angular.bootstrap(document, [App]);
}
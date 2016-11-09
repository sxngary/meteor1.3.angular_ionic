// Libs
import 'angular-animate';
import 'angular-meteor';
import 'angular-meteor-auth';
import 'angular-moment';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
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

import Routes from '../routes';

const App = 'The Dish';

// App
app = Angular.module(App, [
  'angular-meteor',
  'angular-meteor.auth',
  'angularMoment',
  'ionic',
  'validation', 
  'validation.rule',
  'validation.schema',
  'vintagejs',
  'ngRateIt',
  'google.places'
]);

//Load modules
new Loader(App)
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
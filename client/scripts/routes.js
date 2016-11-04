import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

class RoutesConfig extends Config {
  constructor() {
    super(...arguments);

    this.isAuthorized = ['$auth', this.isAuthorized.bind(this)];
    //Disable success messages.
    this.$validationProvider.showSuccessMessage = false;
  }

  configure() {
    //Displayed tabs in bottom for android.
    this.$ionicConfigProvider.tabs.position('bottom');

    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'client/templates/tabs.html',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('tab.suggestion', {
        url: '/suggestion',
        views: {
          'suggestion-tab': {
            templateUrl: 'client/templates/suggestion.html',
            controller: 'SuggestionCtrl as suggestion'
          }
        }
      })
      .state('tab.search', {
        url: '/search',
        views: {
          'search-tab': {
            templateUrl: 'client/templates/search.html',
            controller: 'SearchCtrl as search',
          }
        }
      })
      .state('review', {
        url: '/review',
        templateUrl: 'client/templates/review.html',
        controller: 'ReviewCtrl as review',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('tab.feed', {
        url: '/feed',
        views: {
          'feed-tab': {
            templateUrl: 'client/templates/feed.html',
            controller: 'FeedCtrl as feed'
          }
        }
      })
      .state('tab.profile', {
        url: '/profile',
        views: {
          'profile-tab': {
            templateUrl: 'client/templates/profile.html',
            controller: 'ProfileCtrl as profile'
          }
        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'client/templates/settings.html',
        controller: 'SettingsCtrl as settings',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('dish_detail', {
        url: '/dish_detail',
        templateUrl: 'client/templates/dishdetail.html',
        controller: 'DishDetailCtrl as dish',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('filter', {
        url: '/filter',
        templateUrl: 'client/templates/filter.html',
        controller: 'FilterCtrl as filter',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('location', {
        url: '/location',
        templateUrl: 'client/templates/location.html',
        controller: 'LocationCtrl as location',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('post_review', {
        url: '/post_review',
        templateUrl: 'client/templates/post_review.html',
        controller: 'PostReviewCtrl as content',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'client/templates/welcome.html',
        controller: 'HomeCtrl as home',
        resolve: {
          currentUser($q) {
            if (Meteor.userId()) {
              return $q.reject('CANT_ACCESS');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'client/templates/login.html',
        controller: 'LoginCtrl as login',
        resolve: {
          currentUser($q) {
            $( "input[name='email'], input[name='password'] " ).next().empty();
            Session.set('loginErr', '');
            if (Meteor.userId()) {
              return $q.reject('CANT_ACCESS');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'client/templates/register.html',
        controller: 'SignupCtrl as signup',
        resolve: {
          currentUser($q) {
            $( "input[name='firstname'], input[name='lastname'], input[name='email'], input[name='password'], input[name='confirmpassword'], input[name='zip_code']" ).next().empty();
            Session.set('registerErr', '');
            if (Meteor.userId()) {
              return $q.reject('CANT_ACCESS');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('forgot_password', {
        url: '/forgot_password',
        templateUrl: 'client/templates/forgot.html',
        controller: 'ForgotCtrl as forgot',
        resolve: {
          currentUser($q) {
            $( "input[name='email']" ).next().empty();
            if (Meteor.userId()) {
              return $q.reject('CANT_ACCESS');
            } else {
              return $q.resolve();
            }
          }
        }
      });

    this.$locationProvider.html5Mode({enabled: true,requireBase: false});
    this.$urlRouterProvider.otherwise('/tab/suggestion');
  }

  isAuthorized($auth) {
    return $auth.awaitUser();
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$validationProvider', '$ionicConfigProvider'];

class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
      const err = _.last(args);

      if (err === 'AUTH_REQUIRED') {
        this.$state.go('welcome');
      }else if(err === 'CANT_ACCESS'){
        this.$state.go('suggestion');
      }
    });

  this.$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  }
}

RoutesRunner.$inject = ['$rootScope', '$state', '$ionicPlatform'];

export default [RoutesConfig, RoutesRunner];

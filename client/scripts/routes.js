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
          'tab-suggestions': {
            templateUrl: 'client/templates/suggestion.html',
            controller: 'SuggestionCtrl as suggestion',
            resolve: {
              user: this.isAuthorized
            }
          }
        }
      })
      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'client/templates/search.html',
            controller: 'SearchCtrl as search',
          }
        }
      })
      .state('tab.review', {
        url: '/review',
        views: {
          'tab-review': {
            templateUrl: 'client/templates/review.html',
            controller: 'ReviewCtrl as review',
          }
        }
      })
      .state('tab.feed', {
        url: '/feed',
        views: {
          'tab-feed': {
            templateUrl: 'client/templates/feed.html',
            controller: 'FeedCtrl as feed',
          }
        }
      })
      .state('tab.profile', {
        url: '/profile',
        views: {
          'tab-profile': {
            templateUrl: 'client/templates/profile.html',
            controller: 'ProfileCtrl as profile',
          }
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

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$validationProvider'];

class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
      const err = _.last(args);

      if (err === 'AUTH_REQUIRED') {
        this.$state.go('welcome');
      }else if(err === 'CANT_ACCESS'){
        this.$state.go('tab.suggestion');
      }
    });

  this.$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    /*if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }*/
  });

  }
}

RoutesRunner.$inject = ['$rootScope', '$state', '$ionicPlatform'];

export default [RoutesConfig, RoutesRunner];
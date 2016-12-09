import { Accounts } from 'meteor/accounts-base';
//import { facebookConnectPlugin } from "meteor/jsep:facebook-native-login"
import { Controller } from 'angular-ecmascript/module-helpers';

export default class LoginCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      loginErr(){
        if(Session.get('loginErr'))
          return Session.get('loginErr');
      }
    });
  }

  userLogin(form) {
    _this = this;
      _this.$validation.validate(form)
      .success(function(){
        Meteor.loginWithPassword(_this.data.email, _this.data.password, (err) => {
          if (err) return _this.handleError(err);
          _this.$validation.reset(form);
          _this.$state.go('tab.suggestion');
        });
      })
      .error(function(err){
          //console.log("validation " + err);
      });
  }

  loginWithFacebook(form, data) {
    /*_this = this;
    Meteor.loginWithFacebook({
      requestPermissions: ['user_friends', 'public_profile', 'email']
      }, (err) => {
        if (err) {
          if (err) return _this.handleError(err);
        }else {
          _this.$state.go('tab.suggestion');
        }
    });*/
    if(Meteor.isCordova) {
      /*facebookConnectPlugin.login(['email'],
        function(){
        console.log('success');
      },
        function() {
        console.log('error');
      });*/
    }
  }

  handleError(err) {
    Session.set('loginErr', err.reason || 'Login failed');
    //this.$log.error('Login error ', err);

    // this.$ionicPopup.alert({
    //   title: err.reason || 'Login failed',
    //   okType: 'button-positive button-clear'
    // });
  }
  lowerCase(type){
    if(this.data.email){
      trimValue = this.data.email.trim();
      if (trimValue.length === 1) {
        this.data.email = trimValue.toLowerCase();
      }
    }
  }

}

LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log', '$validation', '$scope'];
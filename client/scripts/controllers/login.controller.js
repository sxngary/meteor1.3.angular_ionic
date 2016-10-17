import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class LoginCtrl extends Controller {
  constructor() {
    super(...arguments);
    
  }

  userLogin(form, data) {
    _this = this;
      _this.$validation.validate(form)
      .success(function(){
        Meteor.loginWithPassword(data.email, data.password, (err) => {
          if (err) return _this.handleError(err);
          _this.$validation.reset(form);
          _this.$state.go('suggestion');
        });
      })
      .error(function(err){
          console.log("validation " + err);
      });
  }

  loginWithFacebook(form, data) {
    _this = this;
    Meteor.loginWithFacebook({
      requestPermissions: ['user_friends', 'public_profile', 'email']
      }, (err) => {
        if (err) {
          if (err) return _this.handleError(err);
        }else {
          _this.$state.go('suggestion');
        }
    });
  }

  handleError(err) {
      //this.$log.error('Login error ', err);

      this.$ionicPopup.alert({
        title: err.reason || 'Login failed',
        okType: 'button-positive button-clear'
      });
  }
}

LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log', '$validation'];
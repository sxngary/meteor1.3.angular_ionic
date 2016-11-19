import { Controller } from 'angular-ecmascript/module-helpers';

export default class ChangePasswordCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.formData = {
      curr_passwd: null,
      new_passwd: null,
      repeat_passwd: null
    }

    //Add custom validation function for password.
    this.$validation
        .setExpression({
            passwdValidator: function (value, scope, element, attrs, param) {
              if(value){
                var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
                var nv =  re.test(value);
                if(nv){
                  return true;
                }
              }
            }
        })
        .setDefaultMsg({
            passwdValidator: {
                error: "At least 1 digit, 1 lowercase, 1 uppercase and min length 6.",
                success: ''
            }
        });


    //Add custom validation function for confirm password.
    this.$validation
        .setExpression({
            confirmPasswd: function (value, scope, element, attrs, param) {
              if(value) return (value === scope.password.formData.new_passwd);
            }
        })
        .setDefaultMsg({
            confirmPasswd: {
                error: "Passwords don't match.",
                success: ''
            }
        });
  }

  update(form) {
    let _this = this;
    _this.$validation.validate(form)
    .success(function(){
        let formData = _this.formData;
        //console.log("formData:", formData);

        Accounts.changePassword(formData.curr_passwd, formData.new_passwd, function(err) {
          if (err) {
            _this.$ionicLoading.show({ template: 'Incorrect current password.', noBackdrop: true , duration: 1500});
            return;
          }
          _this.$ionicLoading.show({ template: 'Password updated successfully.', noBackdrop: true });
          Meteor.setTimeout(function(){
            _this.$ionicLoading.hide();
          }, 1000);
        })
    })
    .error(function(err){
        //console.log("validation " + err);
        _this.$ionicLoading.show({ template: 'Invalid form data.', noBackdrop: true });
        Meteor.setTimeout(function(){
          _this.$ionicLoading.hide();
        }, 1000);
    });
  }
}

ChangePasswordCtrl.$inject = ['$state', '$ionicLoading', '$validation'];
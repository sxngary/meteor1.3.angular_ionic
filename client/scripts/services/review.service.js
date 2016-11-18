import { Service } from 'angular-ecmascript/module-helpers';

export default class ReviewService extends Service {
  constructor() {
    super(...arguments);

    this.templateUrl = 'client/templates/review_modal.html';
  }

  showModal() {
    this.scope = this.$rootScope.$new();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      scope: this.scope
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show();
      /*this.modal.show().then(() => {
        if(check === 'register'){
          this.$state.go('tab.suggestion');
        }
      });*/
    });
  }

  hideModal() {
    this.scope.$destroy();
    this.modal.remove();
  }
}

ReviewService.$name = 'OtherReview';
ReviewService.$inject = ['$rootScope', '$ionicModal'];
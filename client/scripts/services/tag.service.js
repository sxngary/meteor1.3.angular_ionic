import { Service } from 'angular-ecmascript/module-helpers';

export default class TagService extends Service {
  constructor() {
    super(...arguments);

    this.templateUrl = 'client/templates/tag_modal.html';
  }

  showModal(check) {
    this.scope = this.$rootScope.$new();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      scope: this.scope
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show().then(() => {
        if(check === 'register'){
          this.$state.go('tab.suggestion');
        }
      });
    });
  }

  hideModal() {
    this.scope.$destroy();
    this.modal.remove();
  }
}

TagService.$name = 'Tag';
TagService.$inject = ['$rootScope', '$ionicModal', '$state'];
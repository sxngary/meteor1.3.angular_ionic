import { Controller } from 'angular-ecmascript/module-helpers';

export default class TagCtrl extends Controller {
  constructor() {
    super(...arguments);

  }
  
  closeTagModal() {
    this.Tag.hideModal();
  }
}

TagCtrl.$inject = ['Tag', '$state'];
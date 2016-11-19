import { Service } from 'angular-ecmascript/module-helpers';

export default class RatingService extends Service {
  constructor() {
    super(...arguments);

  }

  getNumber(num) {
    if(num){
      if(num % 1 != 0){
        num = parseInt(num);
      }
      return new Array(num); 
    }
  }

  checkHalfStar(num){
    if(num != 5){
      if(num % 1 != 0){
        return true;
      }
    }
  }

  printEmptyStar(num){
    if(num % 1 != 0){     
      num = parseInt(5 - num);
    }else{
      num = 5 - num; 
    }
    if(!num){
      return [];
    }else{
      return new Array(num); 
    }
  }

  uptoDecimal(value){
    if(value % 1 != 0){
      return value.toFixed(1);
    }else{
      return value;
    }
  }
}

RatingService.$name = 'Rating';
RatingService.$inject = ['$rootScope'];
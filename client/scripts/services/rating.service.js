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

  postedDate(date){
    //To calculate hours ad minutes
    var postedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
    var currentDate = moment();
    hours = moment.utc(currentDate.diff(postedDate)).hours();
    minutes = moment.utc(currentDate.diff(postedDate)).minutes();
    //To calculate days, weeks , years
    postedDateN = moment(date);
    var timelineDate = moment(postedDateN, "MM-DD-YYYY");
    var day = timelineDate.date(), month = timelineDate.month(), year = timelineDate.year();
    var day1 = currentDate.date(), month1 = currentDate.month(), year1 = currentDate.year();
    var currentD = moment([year1, month1, day1]);
    var TimelineD = moment([year, month, day]);
    var days = currentD.diff(TimelineD, 'days');
    var daysInMonth =  timelineDate.daysInMonth();
    if(hours == 0 && minutes == 0 &&  days == 0){
      return 'Just now';
    }else if(hours == 0 && minutes > 0 && days == 0){
      return minutes + 'm ago';
    }else if(hours>= 1 && hours < 23 && days == 0){
      return hours + 'hr ago';
    }else{
      if(days == 1){
        return "Yesterday";
      }else if( days >1 && days < 7 ){
        return days + 'days ago';
      }else if(days >= 7 && days <= daysInMonth){
        weeks = currentD.diff(TimelineD, 'weeks');
        if(weeks == 1){
            changeText  = 1 + 'week ago';
        }else{
            changeText  = weeks + 'weeks ago';
        }
        return changeText;
      }else{
        return moment([year, month, day]).fromNow();
      }
    }
  }

}

RatingService.$name = 'Rating';
RatingService.$inject = ['$rootScope'];
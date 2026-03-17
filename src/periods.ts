// @TODO

import dayjs from 'npm:dayjs';
import isLeapYear from 'npm:dayjs/plugin/isLeapYear.js';
import weekOfYear from 'npm:dayjs/plugin/weekOfYear.js';
import { getForYear } from './dates.ts';
import type { Calendar } from './utils.ts';

// Enable dayjs plugins
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);

export function getPeriodsForDate(date: string, calendar: Calendar): string[] {
  // Parse the input date
  const requestDate = dayjs(date);
  const year = requestDate.year();
  const matchingPeriods: string[] = [];

  // Get all periods for the request year
  const orthodoxDates = getForYear(year, calendar);

  // Run through periods objects
  for (const key in orthodoxDates) {
    const periodValue = orthodoxDates[key];

    // Skip boolean values
    if (typeof periodValue === 'boolean') {
      continue;
    }

    // Check if it's a range (has start/end properties)
    if (typeof periodValue === 'object' && periodValue !== null && 'start' in periodValue && 'end' in periodValue) {
      const periodStart = dayjs(periodValue.start);
      const periodEnd = dayjs(periodValue.end);

      // Special handling for nativityFast which spans two years
      if (key === 'nativityFast' && 'followingYear' in periodValue) {
        const followingPeriodStart = dayjs(periodValue.followingYear.start);
        const followingPeriodEnd = dayjs(periodValue.followingYear.end);

        // Check if date falls in either the current year period or following year period
        if (
          ((requestDate.isAfter(periodStart) || requestDate.isSame(periodStart)) && 
           (requestDate.isBefore(periodEnd) || requestDate.isSame(periodEnd))) ||
          ((requestDate.isAfter(followingPeriodStart) || requestDate.isSame(followingPeriodStart)) && 
           (requestDate.isBefore(followingPeriodEnd) || requestDate.isSame(followingPeriodEnd)))
        ) {
          matchingPeriods.push(key);
        }
      } else {
        // Regular range check
        if ((requestDate.isAfter(periodStart) || requestDate.isSame(periodStart)) && 
            (requestDate.isBefore(periodEnd) || requestDate.isSame(periodEnd))) {
          matchingPeriods.push(key);
        }
      }
    } else {
      // Not a range, exact date comparison
      const periodDate = dayjs(periodValue as Date);
      if (requestDate.isSame(periodDate, 'day')) {
        matchingPeriods.push(key);
      }
    }
  }

  return matchingPeriods;
}

export function getWeekAfterPentecost(date: string, calendar: Calendar): { week: number | null; sundayAfterPentecost: number | null } {
  // Parse the input date
  const requestDate = dayjs(date);
  const year = requestDate.year();
  const month = requestDate.month() + 1; // dayjs months are 0-indexed
  const isSunday = requestDate.day() === 0;
  let weekOfYear = requestDate.week();
  let weekAfterPentecost: number | false = false;

  // Get this year's dates
  const thisYearDates = getForYear(year, calendar);
  const pentecostDate = dayjs(thisYearDates.pentecost as Date);
  const publicanPhariseeDate = dayjs(thisYearDates.publicanPharisee as Date);
  
  const dateIsBeforePentecost = requestDate.isBefore(pentecostDate);
  const dateIsAfterPentecost = requestDate.isAfter(pentecostDate);

  if (dateIsBeforePentecost) {
    // Get previous year dates
    const previousYearDates = getForYear(year - 1, calendar);
    
    if (requestDate.isBefore(publicanPhariseeDate)) {
      // Adjust for bizarre week of year handling of first week
      if (month === 1 && weekOfYear >= 52) {
        weekOfYear = 0;
      }

      // Get total number of weeks in previous year
      const previousYearLastDay = dayjs(`12-31-${year - 1}`);
      const totalWeeksInPreviousYear = previousYearLastDay.week();
      const previousYearPentecostWeek = dayjs(previousYearDates.pentecost as Date).week();

      // Calculates week from the next year. Year - previous year pentecost num + current year week num
      weekAfterPentecost = (totalWeeksInPreviousYear - previousYearPentecostWeek) + weekOfYear;

      // Sunday after pentecost is minus 1 because moment starts the week at Sunday
      return {
        week: weekAfterPentecost,
        sundayAfterPentecost: isSunday ? weekAfterPentecost - 1 : null
      };
    } else {
      return { week: null, sundayAfterPentecost: null };
    }
  } else if (dateIsAfterPentecost) {
    // Get following year dates
    const followingYearDates = getForYear(year + 1, calendar);
    const followingYearPublicanPharisee = dayjs(followingYearDates.publicanPharisee as Date);
    
    if (requestDate.isBefore(followingYearPublicanPharisee)) {
      // current week num - pentecost week num = weeks after pentecost
      // Add 1 because the first week counts as week 1
      weekAfterPentecost = weekOfYear - pentecostDate.week();

      // Sunday after pentecost is minus 1 because moment starts the week at Sunday
      return {
        week: weekAfterPentecost,
        sundayAfterPentecost: isSunday ? weekAfterPentecost : null
      };
    } else {
      return { week: null, sundayAfterPentecost: null };
    }
  } else {
    // Same day as pentecost
    return { week: 1, sundayAfterPentecost: null };
  }
}

export function getWeekAfterPascha(date: string, calendar: Calendar): { week: number | null; sundayAfterPascha: number | null } {
  // Parse the input date
  const requestDate = dayjs(date);
  const year = requestDate.year();
  const isSunday = requestDate.day() === 0;
  const weekOfYear = requestDate.week();

  // Get this year's Orthodox dates
  const orthodoxDates = getForYear(year, calendar);
  const paschaDate = dayjs(orthodoxDates.pascha as Date);
  const pentecostDate = dayjs(orthodoxDates.pentecost as Date);
  
  const paschaWeek = paschaDate.week();
  const weekAfterPascha = weekOfYear - paschaWeek;

  // Return weekAfterPascha if request date is before pentecost but after pascha
  if (requestDate.isAfter(paschaDate) && requestDate.isBefore(pentecostDate)) {
    return {
      week: weekAfterPascha,
      sundayAfterPascha: isSunday ? (weekAfterPascha + 1) : null
    };
  } else {
    return { week: null, sundayAfterPascha: null };
  }
}

// export default class Periods {
//   /**
//   * get from dates
//   *
//   * @param req
//   * @param callback | function
//   */
//   getPeriodsForDate(args) { 
//     const self= this;
//     return new Promise(function(resolve,reject) {
//       const calendar = args.calendar;
//       args = utils.dateObj(args);
//       var matchingPeriods = [];

//       // Get all periods for request date
//       self.dates.getForYear({year:args.year,calendar})
//         .then(orthodoxDates=>{

//         //Run through periods objects
//         for(var key in orthodoxDates) {
//           var periodDate = moment(new Date(orthodoxDates[key]));

//           //Check in range
//           if (orthodoxDates[key].hasOwnProperty('start')) {
//             var periodStart = moment(new Date(orthodoxDates[key].start));
//             var periodEnd = moment(new Date(orthodoxDates[key].end));

//             //console.log('OD',key,orthodoxDates[key]);

//             if(key === 'nativityFast'){// Nativity fast pops up at 2 separte times per year, the beginning and end
//               const followingPeriodStart = moment(new Date(orthodoxDates[key].followingYear.start)),
//                 followingPeriodEnd = moment(new Date(orthodoxDates[key].followingYear.end));

//               //Is our request after a period start and before its end (or same day as)
//               if ( ((periodStart.isBefore(args.momentDate) || periodStart.isSame(args.momentDate)) && (periodEnd.isAfter(args.momentDate) || periodEnd.isSame(args.momentDate)))
//                   ||
//                 ( (followingPeriodStart.isBefore(args.momentDate) || followingPeriodStart.isSame(args.momentDate)) && (followingPeriodEnd.isAfter(args.momentDate) || followingPeriodEnd.isSame(args.momentDate) )) ){

//                 matchingPeriods.push(key);
//               }
//             }else{
//               //Is our request after a period start and before its end (or same day as)
//               if ((periodStart.isBefore(args.momentDate) || periodStart.isSame(args.momentDate))
//                 && (periodEnd.isAfter(args.momentDate) || periodEnd.isSame(args.momentDate) )) {

//                 matchingPeriods.push(key);
//               }
//             }
//           } else {// not a range, exact date
//             //Is Same
//             if (periodDate.isSame(args.momentDate)) {
//               matchingPeriods.push(key);
//             }
//           }
//         }

//         resolve(matchingPeriods);
//       });
//     });
//   }


//   /**
//   * Returns the Week after Pentecost
//   * Format the date: "12-3-2015" (December 3 2015)
//   *
//   * @param date string
//   * @param callback | function
//   */
//   getWeekAfterPentecost(args) { 

//     const self = this;
//     return new Promise(function(resolve,reject){
//       const calendar = args.calendar;
//       args = utils.dateObj(args);
//       let weekAfterPentecost = false;

//       self.dates.getForYear({year:args.year,calendar})
//         .then(thisYearDates=>{
//           const pentecostDate      	= thisYearDates.pentecost,
//             dateIsBeforePentecost 	= args.momentDate.isBefore(moment(pentecostDate)),
//             dateIsAfterPentecost 	= args.momentDate.isAfter(moment(pentecostDate));

//           if(dateIsBeforePentecost){

//             // Get previous year dates
//             self.dates.getForYear({year:(args.year-1),calendar})
//               .then(previousYearDates=>{

//                 if(args.momentDate.isBefore(thisYearDates.publicanPharisee)){

//                   // Adjust for bizarre moment week of year handling of first week
//                   if(args.month === 1 && args.weekOfYear >= 52){
//                     args.weekOfYear = 0;
//                   }

//                   // GEt total number of weeks in previous year
//                   // Calculates week from the next year. Year - previous year pentecost num + current year week num
//                   weekAfterPentecost = (utils.dateObj(`${args.month}-${args.dayOfMonth}-${args.year-1}`).totalWeeksInYear - utils.dateObj(previousYearDates.pentecost).weekOfYear) + args.weekOfYear;

//                   // Sunday after pentecost is minus 1 because moment starts the week at Sunday
//                   resolve({
//                     week : weekAfterPentecost,
//                     sundayAfterPentecost :  args.isSunday ? weekAfterPentecost - 1 : false
//                   });
//                 }else{
//                   resolve({week:false});
//                 }
//               });

//           }else if(dateIsAfterPentecost){

//             // Get following year dates
//             self.dates.getForYear({year:(args.year+1),calendar})
//               .then(followingYearDates=>{
//                 if(moment(args.momentDate).isBefore(followingYearDates.publicanPharisee)){

//                   // current week num - pentecost week num = weeks after pentecost
//                   // Add 1 because the first week counts as week 1
//                   weekAfterPentecost = (args.weekOfYear - utils.dateObj(thisYearDates.pentecost).weekOfYear);

//                   // Sunday after pentecost is minus 1 because moment starts the week at Sunday
//                   resolve({
//                     week : weekAfterPentecost,
//                     sundayAfterPentecost :  args.isSunday ? weekAfterPentecost : false
//                   });
//                 }else{
//                   resolve({week:false});
//                 }
//               });
//           }else{
//             //same day as pentecost
//             resolve({week: 1});
//           }
//       });
//     });
//   }



//   /**
//    * Retrieve what week after Pascha this is
//    * @param args
//    */
//   getWeekAfterPascha(args) { 
//     const self = this;
//     return  new Promise(function(resolve,reject){
//       const calendar = args.calendar;
//       args = utils.dateObj(args);

//       self.dates.getForYear({year:args.year,calendar})
//         .then(orthodoxDates=>{
//         const pd = utils.dateObj(orthodoxDates.pascha),
//           weekAfterPascha = args.weekOfYear - pd.weekOfYear,
//           //pentecostDate = utils.makeGregorian(orthodoxDates.pentecost);
//           pentecostDate = orthodoxDates.pentecost;

//         // Return weekAfterPascha if request date is before pentecost but after pascha
//         if(args.momentDate.isAfter(pd.momentDate) && args.momentDate.isBefore(moment(pentecostDate))){
//           resolve({
//             week : weekAfterPascha,
//             sundayAfterPascha :  args.isSunday ? (weekAfterPascha+1) : false
//           });
//         }else{
//           resolve({week:false});
//         }
//       });
//     });
//   }
// }

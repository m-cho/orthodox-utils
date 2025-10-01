// 'use strict'
// const moment  = require('moment');

// let utils = {
// 	/**
// 	 * Function for formatting the arguments date
// 	 * @param req
// 	 * @returns {{fullDate: Date, date: Date, julian: Date, dayOfMonth: number, dayOfWeek: number, humanDayOfWeek: string, month: number, year: number, weekOfYear: number, momentDate: *, isWeekday: (*|boolean), isSaturday: (*|boolean), isSunday: (*|boolean)}}
// 	 */
// 	dateObj(req) {
// 		if(!req.hasOwnProperty('date') && req.hasOwnProperty('year')){
// 			return req;
// 		}else{
// 			const date = req.hasOwnProperty('date') ? req.date : req,
// 				  d = new Date(date);

// 			return {
// 				fullDate      : d, // Refactor all that use this to use date prop
// 				date          : d, // Duplicate
// 				julian        : utils.makeJulian(d),
// 				dayOfMonth    : d.getDate(), // Day of Month
// 				dayOfWeek     : d.getDay(), //Sunday = 0
// 				humanDayOfWeek: utils.convertDayNumToString(d.getDay()), //Sunday = 0
// 				month         : d.getMonth() + 1, //January = 0 - Added 1 to match normal
// 				year          : d.getFullYear(),
// 				weekOfYear    : moment(d).isoWeek(),
// 				momentDate    : moment(d),
// 				isWeekday     : utils.isWeekday(d),
// 				isSaturday    : utils.isSaturday(d),
// 				isSunday      : utils.isSunday(d),
// 				totalWeeksInYear : moment(d).isoWeeksInYear()
// 				//totalWeeksInYear : utils.weeksInYear(d.getFullYear())
// 			};
// 		}
// 	},

// 	/**
// 	 * Used to get the total number of iso weeks in a year 52 or 53
// 	 * @param year
// 	 * @returns {number}
// 	 */
// 	weeksInYear(year) {
// 		return  weeksInYear(year);

// 		/**
// 		 * From: http://stackoverflow.com/questions/18478741/get-weeks-in-year
// 		 * @param year
// 		 * @returns {*}
// 		 */
// 		function weeksInYear(year) {
// 			var d = new Date(year, 11, 31);
// 			var week = getWeekNumber(d)[1];
// 			return week == 1? getWeekNumber(d.setDate(24))[1] : week;
// 		}

// 		function getWeekNumber(d) {
// 			// Copy date so don't modify original
// 			d = new Date(+d);
// 			d.setHours(0,0,0);
// 			// Set to nearest Thursday: current date + 4 - current day number
// 			// Make Sunday's day number 7
// 			d.setDate(d.getDate() + 4 - (d.getDay()||7));
// 			// Get first day of year
// 			var yearStart = new Date(d.getFullYear(),0,1);
// 			// Calculate full weeks to nearest Thursday
// 			var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
// 			// Return array of year and week number
// 			return [d.getFullYear(), weekNo];
// 		}
// 	},

// 	/**
// 	 * COnvert a date to a Julian Date
// 	 * @param gregorianDate
// 	 * @returns {Date}
// 	 */
// 	makeJulian(gregorianDate) {
// 		const d = new Date(gregorianDate);
// 		d.setDate(d.getDate() - 13);

// 		return d;
// 	},


// 	/**
// 	 * Convert a date from julian to Gregorian
// 	 * @param julianDate
// 	 * @returns {Date}
// 	 */
// 	makeGregorian(julianDate) {
// 		const d = new Date(julianDate);
// 		d.setDate(d.getDate() + 13);

// 		return d;
// 	},

// 	/**
// 	 * COnvert a Date object day int to a string value specifying day of the week
// 	 * @param day
// 	 * @returns {string}
// 	 */
// 	convertDayNumToString(day) {
// 		switch (day) {
// 			case 0:
// 				return 'Sunday';
// 				break;
// 			case 1:
// 				return 'Monday';
// 				break;
// 			case 2:
// 				return 'Tuesday';
// 				break;
// 			case 3:
// 				return 'Wednesday';
// 				break;
// 			case 4:
// 				return 'Thursday';
// 				break;
// 			case 5:
// 				return 'Friday';
// 				break;
// 			case 6:
// 				return 'Saturday';
// 				break;
// 		}
// 	},

// 	/**
// 	 * Converts a day of week string to a number
// 	 * @param inputDayOfWeek
// 	 * @returns {number}
// 	 */
// 	convertStringToDayNum(inputDayOfWeek){
// 		switch(inputDayOfWeek){
// 			case 'Sun' :
// 				return 0;
// 				break;
// 			case 'Mon' :
// 				return 1;
// 				break;
// 			case 'Tue' :
// 				return 2;
// 				break;
// 			case 'Wed' :
// 				return 3;
// 				break;
// 			case 'Thu' :
// 				return 4;
// 				break;
// 			case 'Fri' :
// 				return 5;
// 				break;
// 			case 'Sat' :
// 				return 6;
// 				break;
// 			default :
// 				return false;
// 		}
// 	},

// 	/**
// 	 * Make a human readable month
// 	 * @param month
// 	 * @returns {*}
// 	 */
// 	convertMonthNumToString(month) {
// 		switch (+month) {
// 			case 1:
// 				return 'January';
// 				break;
// 			case 2:
// 				return 'February';
// 				break;
// 			case 3:
// 				return 'March';
// 				break;
// 			case 4:
// 				return 'April';
// 				break;
// 			case 5:
// 				return 'May';
// 				break;
// 			case 6:
// 				return 'June';
// 				break;
// 			case 7:
// 				return 'July';
// 				break;
// 			case 8:
// 				return 'August';
// 				break;
// 			case 9:
// 				return 'September';
// 				break;
// 			case 10:
// 				return 'October';
// 				break;
// 			case 11:
// 				return 'November';
// 				break;
// 			case 12:
// 				return 'December';
// 				break;
// 		}
// 	},

// 	/**
// 	 * Return the week of the year
// 	 * @param dt
// 	 * @returns {string}
// 	 */
// 	getWeekNum(dt) {
// 		const d = new Date(dt);
// 		return moment(d).week();
// 	},

// 	/**
// 	 * For checking if a date string or day of week word is a weekday
// 	 * @param day
// 	 * @param isDateString
// 	 * @returns {boolean}
// 	 */
// 	isWeekday(day, isDateString = true) {
// 		let wkDay = String(day).toLowerCase();

// 		if (isDateString) {
// 			const d = new Date(String(day));
// 				wkDay = d.getDay();
// 		}

// 		var is = false;

// 		switch (wkDay) {
// 			case 'sun':
// 			case 0:
// 				is = false;
// 				break;
// 			case 'mon':
// 			case 1:
// 				is = true;
// 				break;
// 			case 'tue':
// 			case 2:
// 				is = true;
// 				break;
// 			case 'wed':
// 			case 3:
// 				is = true;
// 				break;
// 			case 'thurs':
// 			case 4:
// 				is = true;
// 				break;
// 			case 'fri':
// 			case 5:
// 				is = true;
// 				break;
// 			case 'sat':
// 			case 6:
// 				is = false;
// 				break;
// 			case 'sunday':
// 				is = false;
// 				break;
// 			case 'monday':
// 				is = true;
// 				break;
// 			case 'tuesday':
// 				is = true;
// 				break;
// 			case 'wednesday':
// 				is = true;
// 				break;
// 			case 'thursday':
// 				is = true;
// 				break;
// 			case 'friday':
// 				is = true;
// 				break;
// 			case 'saturday':
// 				is = false;
// 				break;
// 		}

// 		return is;
// 	},

// 	/**
// 	 * For determining if date string or day of week word is a sunday
// 	 * @param day
// 	 * @param isDateString
// 	 * @returns {boolean}
// 	 */
// 	isSunday(day, isDateString) {
// 		let wkDay = String(day).toLowerCase();

// 		// Default args to date string = true, flag if passing in text
// 		if (typeof isDateString === 'undefined') {
// 			isDateString = true;
// 		}

// 		if (isDateString) {
// 			const d = new Date(String(day));
// 			wkDay = d.getDay();
// 		}

// 		switch (wkDay) {
// 			case 'sun':
// 			case 0:
// 			case 'sunday':
// 				return true;
// 				break;
// 			default:
// 				return false;
// 		}
// 	},

// 	/**
// 	 * For determining if date string or day of week word is a saturday
// 	 * @param day
// 	 * @param isDateString
// 	 * @returns {boolean}
// 	 */
// 	isSaturday(day, isDateString) {
// 		let wkDay = String(day).toLowerCase();

// 		// Default args to date string = true, flag if passing in text
// 		if (typeof isDateString == 'undefined') {
// 			const isDateString = true;
// 		}

// 		if (isDateString) {
// 			const d = new Date(String(day));
// 			wkDay = d.getDay();
// 		}

// 		switch (wkDay) {
// 			case 'sat':
// 			case 6:
// 			case 'saturday':
// 				return true;
// 				break;
// 			default:
// 				return false;
// 		}
// 	},

// 	/**
// 	 * Determine if date is within the range of 2 periods
// 	 *
// 	 * args.periods
// 	 * args.momentDate
// 	 *
// 	 * @param args
// 	 * @param firstPeriod
// 	 * @param secondPeriod
// 	 * @returns {bluebird|exports|module.exports}
// 	 */
// 	dateWithinPeriodRange(args,firstPeriod,secondPeriod){

// 		// Adjust nativityFast values if normal check comes up false to check on following year date range
// 		if((firstPeriod === 'nativityFast' && secondPeriod === 'nativityFast') && !checkRanges()){
// 			args.periods[firstPeriod].start = args.periods[firstPeriod].followingYear.start;
// 			args.periods[secondPeriod].start = args.periods[secondPeriod].followingYear.start;
// 			args.periods[firstPeriod].end = args.periods[firstPeriod].followingYear.end;
// 			args.periods[secondPeriod].end = args.periods[secondPeriod].followingYear.end;
// 		}

// 		function checkRanges(){
// 			var dStart, dEnd;

// 			if (firstPeriod === secondPeriod && args.periods[firstPeriod].hasOwnProperty('start')) { // Handle single period with range
// 				dStart = new Date(args.periods[firstPeriod].start);
// 				dEnd = new Date(args.periods[secondPeriod].end);

// 			} else if (firstPeriod === secondPeriod && !args.periods[firstPeriod].hasOwnProperty('start')) {// Single date, is same check
// 				dStart = new Date(args.periods[firstPeriod]);
// 				dEnd = dStart;

// 				return moment(dStart).isSame(args.momentDate);
// 			} else {
// 				dStart = args.periods[firstPeriod].hasOwnProperty('start') ? new Date(args.periods[firstPeriod].start) : new Date(args.periods[firstPeriod]);
// 				dEnd = args.periods[secondPeriod].hasOwnProperty('start') ? new Date(args.periods[secondPeriod].start) : new Date(args.periods[secondPeriod]);
// 			}

// 			// Determine if date request is within range or same as start or end date
// 			return (moment(dStart).isBefore(args.momentDate) && moment(dEnd).isAfter(args.momentDate))
// 				|| moment(dStart).isSame(args.momentDate)
// 				|| moment(dEnd).isSame(args.momentDate);
// 		}

// 		return checkRanges();
// 	},

// 	/**
// 	 * Makes a bible gateway link
// 	 * @param passage
// 	 * @returns {string}
// 	 */
// 	makeScriptureLink : function (passage) {
// 		return 'http://labs.bible.org/api/?passage=' + passage + '&type=text&formatting=plain';
// 	},

// 	/**
// 	 * Method for stripping section Symbol
// 	 * @param args
// 	 * @returns {string|XML|void}
// 	 */
// 	cleanSection : function (args) {
// 		return args.section.replace('§', '');
// 	}
// };

// /**
//  * Export
//  * @type {{dateObj: (function(*): {fullDate: Date, date: Date, julian: Date, dayOfMonth: number, dayOfWeek: number, humanDayOfWeek: string, month: number, year: number, weekOfYear: number, momentDate: *, isWeekday: (*|boolean), isSaturday: (*|boolean), isSunday: (*|boolean)}), makeJulian: (function(*=): Date), convertDayNumToString: (function(*): string), getWeekNum: (function(*=): string), isWeekday: (function(*=, *): boolean), isSunday: (function(*=, *): boolean), isSaturday: (function(*=, *): boolean)}}
//  */
// export default utils;

export type Range = {start: Date, end: Date};
export type DayInAWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type Direction = 'before' | 'after';
export type Calendar = 'new' | 'old';

/**
 * Convert a date to a Julian Date
 * @param gregorianDate
 * @returns {Date}
 */
export function makeJulian(gregorianDate: Date): Date {
  const d = new Date(gregorianDate);
  d.setDate(d.getDate() - 13);

  return d;
};

/**
 * Converts a day of week string to a number
 * @param inputDayOfWeek {DayInAWeek}
 * @returns {number}
 */
export function convertStringToDayNum(inputDayOfWeek: DayInAWeek): number {
  return {
    'Sun': 0,
    'Mon': 1,
    'Tue': 2,
    'Wed': 3,
    'Thu': 4,
    'Fri': 5,
    'Sat': 6
  }[inputDayOfWeek];
}

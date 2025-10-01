/*
 * Calculates and returns the dates for
 * all the moveable feasts and periods of the liturgical year
 *
 * Pascha, Ascension, Pentecost, Palm Sunday have no forefeast
 */

import { getPascha } from "./pascha.ts";
import { makeJulian, convertStringToDayNum, type Range, type DayInAWeek, type Direction, type Calendar } from './utils.ts';
import dayjs from 'npm:dayjs';
import isoWeek from 'npm:dayjs/plugin/isoWeek.js';
import weekday from 'npm:dayjs/plugin/weekday.js';

// Enable dayjs plugins
dayjs.extend(isoWeek);
dayjs.extend(weekday);

/**
 * Generates all the feasts and fast dates for the year
 * @param {number} year
 * @param {Calendar} calendar
 * @return {Object} 
 */
export function getForYear(year: number, calendar: Calendar): Record<string, Date | Range | (Range & { followingYear: Range } | boolean) > {
  const pascha = getPascha(year, calendar);

  return {
    /**
     * Pascha
     */
    pascha,

    /**
     * -77 days from pascha
     */
    zacchaeusSunday : _singleMoveable(pascha, 77, false),

    /**
     * -70 days from pascha
     * This date is also Triodion Start
     */
    publicanPharisee : _singleMoveable(pascha, 70, false),

    /**
     * weekOfPublicanPharisee is fast free from Sunday to the following Saturday just before Sunday of the Prodigal Son
     */
    weekOfPublicanPharisee  : _rangeMoveable(pascha,{start:70,end:64,polarity:false}),

    /**
     * -70 days from pascha
     *This date is the Publican & The Pharisee
      * Ends Midnight Office on the eve of Pascha
      */
    triodion  : _rangeMoveable(pascha,{start:70,end:1,polarity:false}),

    /**
     * -15 days from Great Lent Start
     * @returns {Date}
     */
    sundayProdigalSon : _singleMoveable(pascha, 63, false),

    /**
     * Meatfare Sunday of the last judgement
     * -8 days from Great Lent Start
     * Last non-fasting day
     * @returns {Date}
     */
    sundayLastJudgementMeatfare : _singleMoveable(pascha, 56, false),

    /**
     * -14 days from Great Lent Start
     * Monday - First day of Meatfare.
     * Day after Prodigal Son
     * -8 days from Great Lent Start
     * Also sunday of the last judgement
     * @returns {Range}
     */
    meatfare : _rangeMoveable(pascha,{start:62,end:56,polarity:false}),

    /**
     * -7 days from Great Lent Start
     * -1 days from Great Lent Start
     * @returns {Range}
     */
    cheesefare : _rangeMoveable(pascha,{start:55,end:49,polarity:false}),

    /**
     * Casting of Adam from paradise
     * Also forgiveness Sunday
     * -1 days from Great Lent Start
     * @returns {Date}
     */
    sundayCheesefareCastingAdam :  _singleMoveable(pascha, 49, false),
    forgivenessSunday :  _singleMoveable(pascha, 49, false),
    /**
     *
     * @returns {Range}
     */
    firstWeekGreatLent : _rangeMoveable(pascha,{start:48,end:42,polarity:false}),

    /**
     * +22 days from triodionStart
     * -48 days from Pascha
     * Duplicate of triodionEnd
     * Ends Midnight Office on the eve of Pascha
     * @returns {Range}
     */
    greatLent : _rangeMoveable(pascha,{start:48,end:1,polarity:false}),

    /**
     * -6 days from Pascha
     * Duplicate of triodionEnd
     * Ends Midnight Office on the eve of Pascha
     * @returns {Range}
     */
    holyWeek : _rangeMoveable(pascha,{start:6,end:1,polarity:false}),

    /**
     * -42 days from pascha
     */
    sundayOfOrthodoxy :  _singleMoveable(pascha, 42, false),

    /**
     * -35 days from pascha
     */
    sundayOfStGregoryPalamas :  _singleMoveable(pascha, 35, false),

    /**
     * -28 days from pascha
     */
    sundayOfVenerationOfPreciousCross :  _singleMoveable(pascha, 28, false),

    /**
     * -21 days from pascha
     */
    sundayOfStJohnClimacus :  _singleMoveable(pascha, 21, false),

    /**
     * -14 days from pascha
     */
    sundayOfStMaryOfEgypt :  _singleMoveable(pascha, 14, false),

    /**
     * -8 days from pascha
     */
    lazarusSaturday :  _singleMoveable(pascha, 8, false),

    /**
     * Sunday before Pascha
     * @returns {Date}
     */
    palmSunday : _singleMoveable(pascha, 7, false),

    /**
     * Starts Monday after Pascha
     * +7 Days from Pascha
     * @returns {Range}
     */
    brightWeek : _rangeMoveable(pascha,{start:1,end:6,polarity:true}),

    /**
     * +8 days from Pascha
     * This is the Sunday after Pascha
     * Tone 1 begins again here
     * @returns {Date}
     */
    thomasSunday : _singleMoveable(pascha, 7, true),

    /**
     * +14 days from Pascha
     * @returns {Date}
     */
    sundayOfTheMyrrhBearingWomen : _singleMoveable(pascha, 14, true),

    /**
     * +21 days from Pascha
     * @returns {Date}
     */
    sundayOfTheParalytic : _singleMoveable(pascha, 21, true),

    /**
     * +24 days after Pascha
     * @returns {Date}
     */
    midfeastOfPentecost : _singleMoveable(pascha, 24, true),

    /**
     * 5th Sunday after Pascha
     * +28 days after Pascha
     * @returns {Date}
     */
    sundayOfTheSamaritanWoman : _singleMoveable(pascha, 28, true),

    /**
     * +35 days after Pascha
     * @returns {Date}
     */
    sundayOfTheBlindMan : _singleMoveable(pascha, 35, true),

    /**
     * Pascha-today is the Afterfeast
     * +40 days after Pascha
     * 1 day before Ascension
     * @returns {Date}
     */
    apodosisPascha : _singleMoveable(pascha, 38, true),

    /**
     * Forefeast of Ascension
     * +40 days after Pascha
     * 1 day before Ascension (same as apodosisPascha)
     * @returns {Range}
     */
    forefeastAscension: _rangeMoveable(pascha,{start:38,end:38,polarity:true}),

    /**
     * Ends 1 day before Ascension
     * @returns {Range}
     */
    afterfeastPascha : _rangeMoveable(pascha,{start:1,end:38,polarity:true}),

    /**
     * 40 Days after Pascha
     * @returns {Date}
     */
    ascension : _singleMoveable(pascha, 39, true),

    /**
     *
     * @returns {Range}
     */
    afterfeastAscension : _rangeMoveable(pascha,{start:40,end:47,polarity:true}),

    /**
     * +42 days after Pascha
     * @returns {Date}
     */
    sundayOfTheFathersOfThe1StEcumenicalCouncil : _singleMoveable(pascha, 42, true),
    
    /**
     * +42 days after Pascha
     * @returns {Date}
     */
    mondaySeventhWeekAfterPaschaStJohnTheologian : _singleMoveable(pascha, 43, true),

    /**
     * 7 Days after Ascension
     * Afterfeast of Ascension is Acension until today
     * @returns {Date}
     */
    apodosisAscension : _singleMoveable(pascha, 47, true),
    
    /**
     * 49 days after Pascha
     * @returns {Date}
     */
    saturdayBeforePentecost : _singleMoveable(pascha,  48, true),

    /**
     * 50 days after Pascha
     * @returns {Date}
     */
    pentecost : _singleMoveable(pascha,  49, true),

    /**
     * The Monday after Pentecost
     */
    mondayOfHolySpirit : _singleMoveable(pascha,  50, true),

    /**
     * Week after Pentecost
     * @returns {Range}
     */
    trinityWeek : _rangeMoveable(pascha,{start:50,end:56,polarity:true}),

    /**
     * Essentially Trinity week -1
     * @returns {Range}
     */
    afterfeastPentecost : _rangeMoveable(pascha,{start:50,end:55,polarity:true}),

    /**
     *
     * @returns {Date}
     */
    apodosisPentecost : _singleMoveable(pascha, 55, true),

    /**
     * 56 Days after Pascha
     * 7 days after pentecost
     * @returns {Date}
     */
    firstSundayAfterPentecost : _singleMoveable(pascha, 56, true),
    sundayOfAllSaints : _singleMoveable(pascha, 56, true),
      
    /**
     * 63 Days after Pascha
     * 14 days after pentecost
     * @returns {Date}
     */
    secondSundayAfterPentecost : _singleMoveable(pascha, 63, true),
    sundayOfAllSaintsOfNorthAmerica : _singleMoveable(pascha, 63, true),
    sundayOfAllSaintsOfRussia : _singleMoveable(pascha, 63, true),
    
    /** 70 Days after Pascha */
    thirdSundayAfterPentecost : _singleMoveable(pascha, 70, true),

    /**
     * 77 Days after Pascha ?
     * Sunday closest to July 16th OC July 29th NC
     * @returns {Date}
     */
    fathersOfTheFirstSixCouncils : (function() {

      const fixedDate = new Date('7/29/' + year);

      if (dayjs(fixedDate).day() === 0) {
        // If the date this year falls on a Sunday, celebrate it here. Else calculate the closest Sunday
        return calendar === 'old' 
          ? makeJulian(fixedDate) 
          : fixedDate;

      } else {

        // Get date for both Sunday before and Sunday after. Diff each with the original date to see who is closest
        const before = dayjs(_dayOfWeekFromFixed('Sun','before',fixedDate, calendar)).diff(dayjs(fixedDate),'days');
        const beforeDays = before < 0 ? -before : before;
        const after = dayjs(_dayOfWeekFromFixed('Sun','after',fixedDate, calendar)).diff(dayjs(fixedDate),'days');
        const afterDays = after < 0 ? -after : after;
        
        if (beforeDays > afterDays) {
          return _dayOfWeekFromFixed('Sun','after',fixedDate, calendar);
        } else if(beforeDays < afterDays) {
          return _dayOfWeekFromFixed('Sun','before',fixedDate, calendar);
        } else {
          return _dayOfWeekFromFixed('Sun','after',fixedDate, calendar);
        }
      }
    })(),

    pentecostarion : _rangeMoveable(pascha,{start:0,end:55,polarity:true}),

    /**
     * Day before the nativty fast begins
     */
    eveOfTheNativityFast : (function () {
      const followingYear = typeof year === "number" ? year + 1 : parseInt(year,10)+1;
      const s = new Date('1/7/' + followingYear);

      //-41 days before Nativity
      s.setDate(s.getDate() - 41);

      return calendar === 'old' ? makeJulian(s) : s;
    })(),

    /**
     * -40 days before Nativity
     * Last day is day before Nativity
     * @returns {Range & { followingYear: Range } }
     */
    nativityFast : (function () {
      const start = new Date('1/7/' + year);
      const end = new Date('1/7/' + year);

      //-40 days before Nativity
      start.setDate(start.getDate() - 40);
      // Last day is day before Nativity
      end.setDate(end.getDate() - 1);

      const range: Range & { followingYear: Range } = {
        start: calendar === 'old' ? makeJulian(start) : start,
        end: calendar === 'old' ? makeJulian(end) : end,
        followingYear: _getNativityFastForFollowingYear(year, calendar),
      };
        
      return range;
    })(),

    /**
     * 2 sundays before nativity
     */
    secondSundayBeforeNativity : (function() {
      // First get the first SUnday before, then use that result to get 7 days less
      const sundayBefore = _dayOfWeekFromFixed(
        'Sun',
        'before',
         new Date('1/7/' + year), 
         calendar
      );

      const s = new Date(sundayBefore);

      s.setDate(s.getDate() - 7);

      return sundayBefore;
    })(),

    /**
     * 2 sundays before nativity
     */
    sundayOfTheForefathers : (function() {
      const sundayBefore = _dayOfWeekFromFixed(
        'Sun',
        'before',
         new Date('1/7/' + year), 
         calendar
      );

      return _dayOfWeekFromFixed(
        'Sun',
        'before',
         sundayBefore, 
         calendar
      );
    })(),

    /**
     * 1 sunday before nativity
     */
    sundayBeforeNativity : _dayOfWeekFromFixed(
      'Sun',
      'before',
       new Date('1/7/' + year), 
       calendar
    ),

    /**
     * 1 sunday before nativity
     */
    sundayOfTheFathers : _dayOfWeekFromFixed(
      'Sun',
      'before',
       new Date('1/7/' + year), 
       calendar
    ),

    /**
     * 5 days before Nativity
     * @returns {Range}
     */
    forefeastNativity : _rangeFixed('1/2/' + year,'1/6/' + year,  calendar),

    eveOfNativity : false, 

    /**
     * Nativity
     * @returns {Date}
     */
    nativity : calendar === 'old' ? makeJulian(new Date('1/7/' + year)) : new Date('1/7/' + year),

    /**
     * Synaxis of the Theotokos
     */
    synaxisTheotokos : _singleFixed('1/8/' + year, calendar),

    /**
     * 1 sunday after nativity
     */
    sundayAfterNativity : _dayOfWeekFromFixed(
      'Sun',
      'after',
      new Date('1/7/' + year), 
       calendar
    ),

    /**
     * 1 sunday after nativity
     * commemorated on the Sunday after the Nativity.
     * If there is no Sunday between December 25 OC and January 1 OC(when the 25th falls on a Sunday), the feast is moved to December 26 OC
     */
    josephTheBetrothed_DavidTheKing_JamesTheBrotherOfTheLord : (function() {
      const nativity = dayjs(calendar === 'old' ? makeJulian(new Date('1/7/' + year)) : new Date('1/7/' + year)),
        nativityDayOfWeek = nativity.day();//4

      if(nativityDayOfWeek === 0){
        return calendar === 'old' ? makeJulian(new Date('1/8/' + year)) : new Date('1/8/' + year);
      }else{
        return _dayOfWeekFromFixed(
          'Sun',
          'after',
           new Date('1/7/' + year), 
           calendar
        );
      }
    })(),

    /**
     * Circumcision
     */
    circumcision : _singleFixed('1/14/' + year, calendar),

    /**
     * Afterfeast of Nativity
     */
    afterfeastNativity : _rangeFixed('1/8/' + year,'1/13/' + year,  calendar),

    /**
     * Apodosis of Nativity
     * @returns {Date}
     */
    apodosisNativity : _singleFixed('1/13/' + year, calendar),

    /**
     * Sunday before Theophany
     */
    sundayBeforeTheophany : _dayOfWeekFromFixed(
      'Sun',
      'before',
       new Date('1/19/' + year), 
       calendar
    ),

    /**
     * 4 days before Theophany
     * @returns {Range}
     */
    forefeastTheophany : _rangeFixed('1/15/' + year,'1/18/' + year,  calendar),

    eveOfTheophany : _singleFixed('1/18/' + year, calendar),

    /**
     * Theophany
     * @returns {Date}
     */
    theophany : _singleFixed('1/19/' + year, calendar),

    /**
     * Afterfeast Theophany
     * @returns {Range}
     */
    afterfeastTheophany : _rangeFixed('1/20/' + year,'1/27/' + year,  calendar),

    /**
     * Sunday after Theophany
     */
    sundayAfterTheophany : _dayOfWeekFromFixed(
      'Sun',
      'after',
       new Date('1/19/' + year), 
       calendar
    ),

    /**
     * Apodosis Theophany
     */
    apodosisTheophany : _singleFixed('1/27/' + year, calendar),

    /**
     * Forefeast of the PResentation of Christ
     */
    forefeastPresentationChrist : _singleFixed('2/14/' + year, calendar),

    /**
     * Presentation of Christ
     */
    presentationChrist : _singleFixed('2/15/' + year, calendar),

    /**
     * NOTE: The afterfeast of the Presentation
     * of Christ may be shortened or omitted
     * altogether if February 2 falls on or
     * after the Sunday of the Publican and Pharisee.
     * @returns {Range}
     */
    afterfeastPresentationChrist : _rangeFixed('2/16/' + year,'2/22/' + year,  calendar),

    /**
     * apodosisPresentationChrist
     */
    apodosisPresentationChrist : _singleFixed('2/22/' + year, calendar),

    /**
     * forefeastAnnunciation
     */
    forefeastAnnunciation : _singleFixed('4/6/' + year, calendar),

    /**
     * annunciation
     */
    annunciation : _singleFixed('4/7/' + year, calendar),

    /**
     * apostlesFast
     * @returns {Range}
     */
    apostlesFast: (function () {
      // Pentecost date
      const pentecost = new Date(pascha);
      pentecost.setDate(pentecost.getDate() + 49);

      const s = new Date(pentecost);

      //2nd Monday after Pentecost
      s.setDate(s.getDate() + 8);

      return {
        start: calendar === 'old' ? makeJulian(s) : s,
        end: calendar === 'old' ? makeJulian(new Date('7/11/' + year)) : new Date('7/11/' + year),
      } as Range;
    })(),

    /**
     * feastPeterPaul
     * @returns {Date}
     */
    feastPeterPaul : _singleFixed('7/12/' + year, calendar),

    /**
     * forefeastTransfiguration
     * @returns {Date}
     */
    forefeastTransfiguration : _singleFixed('8/18/' + year, calendar),

    /**
     * transfiguration
     * @returns {Date}
     */
    transfiguration : _singleFixed('8/19/' + year, calendar),

    /**
     * afterfeastTransfiguration
     */
    afterfeastTransfiguration : _rangeFixed('8/20/' + year,'8/26/' + year,  calendar),

    /**
     * apodosisTransfiguration
     */
    apodosisTransfiguration : _singleFixed('8/26/' + year, calendar),

    /**
     * dormitionFast
     */
    dormitionFast : _rangeFixed('8/14/' + year,'8/27/' + year,  calendar),

    /**
     * forefeastDormition
     */
    forefeastDormition : _singleFixed('8/27/' + year, calendar),

    /**
     * dormition
     */
    dormition : _singleFixed('8/28/' + year, calendar),

    /**
     * afterfeastDormition
     */
    afterfeastDormition : _rangeFixed('8/29/' + year,'9/5/' + year,  calendar),

    /**
     * apodosisDormition
     */
    apodosisDormition : _singleFixed('9/5/' + year, calendar),

    /**
     * beheadingBaptist
     */
    beheadingBaptist : _singleFixed('9/11/' + year, calendar),

    /**
     * Church New Year
     */
    indiction : _singleFixed('9/14/' + year, calendar),

    /**
     * forefeastNativityTheotokos
     */
    forefeastNativityTheotokos : _singleFixed('9/20/' + year, calendar),

    /**
     * nativityTheotokos
     */
    nativityTheotokos : _singleFixed('9/21/' + year, calendar),

    /**
     * afterfeastNativityTheotokos
     */
    afterfeastNativityTheotokos : _rangeFixed('9/22/' + year,'9/25/' + year,  calendar),

    /**
     * apodosisNativityTheotokos
     */
    apodosisNativityTheotokos : _singleFixed('9/25/' + year, calendar),

    /**
     * Sunday before the cross
     */
    sundayBeforeTheExaltationOfTheCross : _dayOfWeekFromFixed('Sun', 'before', new Date('9/27/' + year), calendar),

    /**
     * forefeastExaltationCross
     */
    forefeastExaltationCross : _singleFixed('9/26/' + year, calendar),

    /**
     * exaltationCross
     */
    exaltationCross : _singleFixed('9/27/' + year, calendar),

    /**
     * Sunday after the cross
     */
    sundayAfterTheExaltationOfTheCross : _dayOfWeekFromFixed('Sun','after',new Date('9/27/' + year),  calendar),

    /**
     * 8 days after exaltation begin the lukan jump calculations
     */
    beginLukanJump : _dayOfWeekFromFixed('Mon','after',new Date('9/27/' + year), calendar),

    /**
     * 8 days after exaltation begin the lukan jump calculations + 19 weeks
     */
    endLukanJump : (function(){
      const d = new Date(_dayOfWeekFromFixed('Mon','after',new Date('9/27/' + year), calendar));
      const dDayOfWeek = d.getDay();
      const endOfJump = new Date(d.setDate(d.getDate() + (19*7)));

      // According to Alexandr Andreev this is the real end of the Lukan Jump - Sunday before the Sunday of teh prodigal son
      // zacchaeusSunday : _singleMoveable(pascha, 77, false),

      // Ends on the Monday following the 19th week
      // If end date is a mOnday, just return that date otherwise get the date for the following Monday
      if (dDayOfWeek === 1){
        return calendar === 'old' ? makeJulian(endOfJump) : endOfJump;
      }else{
        return _dayOfWeekFromFixed('Mon','after', endOfJump, calendar);
      }
    })(),

    /**
     * afterfeastExaltationCross
     */
    afterfeastExaltationCross : _rangeFixed('9/28/' + year,'10/4/' + year,  calendar),

    /**
     * apodosisExaltationCross
     */
    apodosisExaltationCross : _singleFixed('10/4/' + year, calendar),

    /**
     * October 24th NC or the Sunday before if it is thursday or less OR Sunday after if greater than thursday
     */
    sundayOfTheFathersOfThe7thEcumenicalCouncil : (function() {
      const fixedDate = new Date('10/24/' + year),
          d = dayjs(fixedDate),
          dayOfWeek = d.day();// O based dayOfWeek

      // Is it Thursday or before?
      if(dayOfWeek <= 4){
        return _dayOfWeekFromFixed('Sun','before',fixedDate, calendar);
      }else{
        return _dayOfWeekFromFixed('Sun','after',fixedDate, calendar);
      }
    })(),

    /**
     * protectionTheotokos
     */
    protectionTheotokos : _singleFixed('10/14/' + year, calendar),

    /**
     * Saturday before 11/08 NC
     */
    demetriusSaturday : _dayOfWeekFromFixed('Sat','before',new Date('11/08/' + year),  calendar),

    /**
     * forefeastPresentationOfTheotokos
     */
    forefeastPresentationOfTheotokos : _singleFixed('12/3/' + year, calendar),

    /**
     * presentationTheotokos
     */
    presentationTheotokos : _singleFixed('12/4/' + year, calendar),

    /**
     * afterfeastPresentationTheotokos
     */
    afterfeastPresentationTheotokos : _rangeFixed('12/5/' + year,'12/8/' + year,  calendar),

    /**
     * apodosisPresentationTheotokos
     */
    apodosisPresentationTheotokos : _singleFixed('12/8/' + year, calendar)
  };
}

/**
 * Calculates moveable feast single date value
 * @param {Date} pascha - Date of Pascha for the year
 * @param {number} offset - Number of days offset from pascha
 * @param {boolean} polarity - true = add days, false = subtract days
 * @returns {Date}
 */
function _singleMoveable(pascha: Date, offset: number, polarity: boolean): Date {
  const p = new Date(pascha);

  // Polarity controls the +- operation
  if(polarity){
    p.setDate(p.getDate() + offset);
  }else{
    p.setDate(p.getDate() - offset);
  }

  return p;
}

/**
 * Returns a single fixed date
 * @param {string} date - Date string parsable by Date()
 * @param {'new' | 'old'} calendar - Calendar type
 * @returns {Date}
 */
function _singleFixed(date: string, calendar: Calendar): Date {
  return calendar === 'old' ? makeJulian(new Date(date)) : new Date(date);
}

/**
 * Calculates moveable feast range values
 * @param {Date} pascha - Date of Pascha for the year
 * @param {object} offset - Object with start, end and polarity values
 *  - {number} start - Number of days offset from pascha for range start
 *  - {number} end - Number of days offset from pascha for range end
 *  - {boolean} polarity - true = add days, false = subtract days
 * @returns {Range}
 */
function _rangeMoveable(pascha: Date, offset: {start: number, end: number, polarity: boolean}): Range {
  const start = new Date(pascha);
  const end = new Date(pascha);

  // Polarity controls the +- operation
  if (offset.polarity){
    start.setDate(start.getDate() + offset.start);
    end.setDate(end.getDate() + offset.end);
  } else {
    start.setDate(start.getDate() - offset.start);
    end.setDate(end.getDate() - offset.end);
  }

  return { start, end };
}

/**
 * Retuns a range fixed date
 * @param {string} start - Date string parsable by Date()
 * @param {string} end - Date string parsable by Date()
 * @param {Calendar} calendar - Calendar type
 * @returns {Range}
 */
function _rangeFixed(start: string, end: string, calendar: Calendar): Range {
  return {
    start: calendar === 'old' ? makeJulian(new Date(start)) : new Date(start),
    end: calendar === 'old' ? makeJulian(new Date(end)) : new Date(end),
  };
}

/**
 * Calculates the date of the day of week before or after a fixed date.
 * NOTE on Julian: Day.js can only work in the gregorian calendar. Convert the date after.
 * @param {DayInAWeek} dayOfWeek - Day of the week string e.g. 'Mon', 'Tue', 'Wed', etc.
 * @param {Direction} direction - 'before' or 'after'
 * @param {Date} fixedDate - The fixed date to calculate from
 * @param {Calendar} calendar - 'new' or 'old'
 * @returns {Date}
 */
function _dayOfWeekFromFixed(dayOfWeek: DayInAWeek, direction: Direction, fixedDate: Date, calendar: Calendar): Date {
  let calcedDate: dayjs.Dayjs | null = null;

  const fixedDateDayOfWeek = dayjs(fixedDate).day();
  const targetDayOfWeek = convertStringToDayNum(dayOfWeek);
  const sunday = dayjs(fixedDate).startOf('week').toDate();

  if(direction === 'before' && fixedDateDayOfWeek === targetDayOfWeek) {
    calcedDate = dayjs(sunday).subtract(7,'days');
  } else if(direction === 'before') {
    if(targetDayOfWeek < fixedDateDayOfWeek) {
      calcedDate = dayjs(sunday).add(targetDayOfWeek,'days');
    } else if(targetDayOfWeek > fixedDateDayOfWeek) {
      // go back a week, then find our day number
      calcedDate = dayjs(fixedDate).subtract(1, 'weeks').isoWeekday(targetDayOfWeek);
    }
  } else if(direction === 'after' && fixedDateDayOfWeek === targetDayOfWeek) {
    calcedDate = dayjs(sunday).add(7,'days');
  }else if(direction === 'after'){
    if(fixedDateDayOfWeek < targetDayOfWeek){
      //add the difference to sunday
      calcedDate = dayjs(sunday).add((fixedDateDayOfWeek - targetDayOfWeek),'days')
    }else if(fixedDateDayOfWeek > targetDayOfWeek){
      //Jump into next week and grab the date by day of the week
      calcedDate = dayjs(fixedDate).add(1, 'weeks').isoWeekday(targetDayOfWeek);
    }
  }

  if (!calcedDate) {
    // @TODO check the logic why calcedDate would be null here
    throw new Error(`Could not calculate the ${direction} ${dayOfWeek} from ${fixedDate.toDateString()}`);
  }

  return calendar === 'old' 
    ? makeJulian(calcedDate.toDate()) 
    : calcedDate.toDate();
}

/**
 * Calcs nativity for next year
 * @param {number} year
 * @param {Calendar} calendar
 * @returns {Range}
 */
function _getNativityFastForFollowingYear(year: number, calendar: Calendar): Range {
  const followingYear = typeof year === "number" ? year + 1 : parseInt(year,10)+1;
  const start = new Date('1/7/' + followingYear);
  const end = new Date('1/7/' + followingYear);

  //-40 days before Nativity
  start.setDate(start.getDate() - 40);
  //Last day is day before Nativity
  end.setDate(end.getDate() - 1);
  return {
    start: calendar === 'old' ? makeJulian(start) : start,
    end: calendar === 'old' ? makeJulian(end) : end,
  }
}

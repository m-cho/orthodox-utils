import type { Calendar } from "./utils.ts";

/**
 * Based on the calculations of Carl Friedrich Gauss
 * Calculations in the Julian Calendar
 * getPascha(2044, 'new');
 * @param {number} year
 * @param {Calendar} cal
 * @returns {Date}
 */
export function getPascha(year: number, cal: Calendar): Date {
  // Make new cal/old cal calculation
  const calendarOffset = cal == 'new' ? 13 : 0;

  const a = year % 19;
  const b = year % 4; // If leap year, this is always 0
  const c = year % 7;
  const d = ( 19*a + 15 ) % 30;
  const e = ( (2*b)+(4*c)+(6*d)+6 ) % 7;

  // Calculate days after March 1st (Old Cal.)
  const f = d + e + 21;

  const g = new Date(year, 2, 1);
  const h = g.setDate(g.getDate() + f + calendarOffset);

  return new Date(h);
}

import { getPeriodsForDate, getWeekAfterPascha, getWeekAfterPentecost } from "../src/periods.ts";

Deno.test('getPeriodsForDate', () => {
  const periods = getPeriodsForDate('2025-10-01', 'new');
  console.log('periods', periods);
});

Deno.test('getWeekAfterPentecost', () => {
  const week = getWeekAfterPentecost('2025-10-01', 'new');
  console.log('week after pentecost', week);
  const sunday = getWeekAfterPentecost('2025-10-05', 'new');
  console.log('week after pentecost', sunday);
});

Deno.test('getWeekAfterPascha', () => {
  const week = getWeekAfterPascha('2025-10-01', 'new');
  console.log('week after pascha', week);
  const sunday = getWeekAfterPascha('2025-10-05', 'new');
  console.log('week after pascha', sunday);
  const pascha = getWeekAfterPascha('2025-04-28', 'new');
  console.log('week after pascha', pascha);
  
});
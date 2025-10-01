import { getForYear } from "../src/dates.ts";

Deno.test('getForYear', () => {
  const year2025NewCal = getForYear(2025, 'new');
  console.log('year2025NewCal', year2025NewCal);
  // const year2025OldCal = getForYear(2025, 'old');
  // console.log('year2025OldCal', year2025OldCal);
  // Add assertions here to verify the correctness of year2025NewCal and year2025OldCal
});
import { assertEquals } from "@std/assert";
import { getPascha } from "../src/pascha.ts";

Deno.test('getPascha', function() {
  assertEquals(getPascha(2044, 'new').toDateString(), new Date('2044-4-24').toDateString());
  assertEquals(getPascha(2044, 'old').toDateString(), new Date('2044-4-11').toDateString());
  assertEquals(getPascha(2025, 'new').toDateString(), new Date('2025-4-20').toDateString());
  assertEquals(getPascha(2025, 'old').toDateString(), new Date('2025-4-7').toDateString());
  assertEquals(getPascha(2024, 'new').toDateString(), new Date('2024-5-5').toDateString());
  assertEquals(getPascha(2024, 'old').toDateString(), new Date('2024-4-22').toDateString());
  assertEquals(getPascha(2023, 'new').toDateString(), new Date('2023-4-16').toDateString());
  assertEquals(getPascha(2023, 'old').toDateString(), new Date('2023-4-3').toDateString());
  assertEquals(getPascha(2022, 'new').toDateString(), new Date('2022-4-24').toDateString());
  assertEquals(getPascha(2022, 'old').toDateString(), new Date('2022-4-11').toDateString());
});
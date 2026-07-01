import {
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateBirthdayNumber,
  calculateBalanceNumber,
  calculatePersonalYear,
  reduceToSingleOrMaster
} from './numerologyEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

try {
  console.log("Running numerology engine tests...");

  // 1. reduceToSingleOrMaster tests
  let res = reduceToSingleOrMaster(29);
  assert(res.value === 11, `Expected 11, got ${res.value}`);
  
  res = reduceToSingleOrMaster(199);
  assert(res.value === 1, `Expected 1, got ${res.value}`);

  res = reduceToSingleOrMaster(22);
  assert(res.value === 22, `Expected 22, got ${res.value}`);

  // 2. Life Path (Pythagorean full date reduction: reduce day, month, year separately, then sum)
  // 29-11-1988 -> Day=11, Month=11, Year=1+9+8+8=26->8. Sum = 11+11+8 = 30 -> 3.
  let lp = calculateLifePathNumber("1988-11-29");
  assert(lp.value === 3, `Expected LP 3, got ${lp.value}`);

  // 3. Name numbers
  let destCh = calculateDestinyNumber("Nikola Tesla", "chaldean");
  assert(destCh.value !== 0, "Chaldean destiny calculated");

  let destPy = calculateDestinyNumber("Nikola Tesla", "pythagorean");
  assert(destPy.value !== 0, "Pythagorean destiny calculated");

  // Vowels only (Soul Urge)
  let su = calculateSoulUrgeNumber("Nikola Tesla", "pythagorean");
  // N(i)k(o)l(a) T(e)sl(a) -> i=9, o=6, a=1, e=5, a=1 -> sum = 22
  assert(su.value === 22, `Expected SU 22, got ${su.value}`);

  // Consonants only (Personality)
  let per = calculatePersonalityNumber("Nikola Tesla", "pythagorean");
  // (N)i(k)o(l)a (T)e(s)(l)a -> N=5, K=2, L=3, T=2, S=1, L=3 -> sum = 16 -> 7
  assert(per.value === 7, `Expected PER 7, got ${per.value}`);

  console.log("All tests passed!");
} catch (e: any) {
  console.error(e.message);
  process.exit(1);
}

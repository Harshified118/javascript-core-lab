/**
 * test_all.js
 * Automated test suite running unit tests across all 10 JavaScript programs.
 */

const assert = require("assert");

const { isPalindromeTwoPointer, isPalindromeClean } = require("./01_palindrome_checker");
const { getFrequencyMap, deduplicate, topKFrequent, findMode } = require("./02_array_frequency");
const UnitConverter = require("./03_unit_converter");
const { isPrime, sieveOfEratosthenes, gcd, lcm, factorial } = require("./04_number_math_utils");
const KeyValueStore = require("./05_kv_store_ttl");
const { debounce, throttle } = require("./06_debounce_throttle");
const { deepClone, deepEqual } = require("./07_deep_clone_equals");
const AsyncTaskPool = require("./08_async_task_pool");
const EventEmitter = require("./09_event_emitter");
const Pipeline = require("./10_stream_pipeline");

async function runAllTests() {
  console.log("🧪 Running automated test suite for javascript-core-lab...\n");

  // Test 1: Palindrome
  assert.strictEqual(isPalindromeTwoPointer("A man, a plan, a canal: Panama"), true);
  assert.strictEqual(isPalindromeTwoPointer("race a car"), false);
  assert.strictEqual(isPalindromeClean("No 'x' in Nixon"), true);
  console.log("✔ 01_palindrome_checker passed");

  // Test 2: Array Frequency
  const arr = [1, 2, 2, 3, 3, 3];
  assert.deepStrictEqual(deduplicate(arr), [1, 2, 3]);
  assert.deepStrictEqual(topKFrequent(arr, 1), [3]);
  assert.strictEqual(findMode(arr).modes[0], 3);
  console.log("✔ 02_array_frequency passed");

  // Test 3: Unit Converter
  assert.strictEqual(Math.round(UnitConverter.temperature.convert(100, "C", "F")), 212);
  assert.strictEqual(Math.round(UnitConverter.length.convert(1000, "m", "km")), 1);
  assert.strictEqual(Math.round(UnitConverter.weight.convert(1000, "g", "kg")), 1);
  console.log("✔ 03_unit_converter passed");

  // Test 4: Math Utils
  assert.strictEqual(isPrime(17), true);
  assert.strictEqual(isPrime(18), false);
  assert.deepStrictEqual(sieveOfEratosthenes(10), [2, 3, 5, 7]);
  assert.strictEqual(gcd(54, 24), 6);
  assert.strictEqual(lcm(4, 6), 12);
  assert.strictEqual(factorial(5), 120n);
  console.log("✔ 04_number_math_utils passed");

  // Test 5: Key-Value Store
  const store = new KeyValueStore({ maxSize: 2 });
  store.set("a", 1, 50);
  assert.strictEqual(store.get("a"), 1);
  await new Promise((r) => setTimeout(r, 60));
  assert.strictEqual(store.get("a"), undefined);
  console.log("✔ 05_kv_store_ttl passed");

  // Test 6: Debounce & Throttle
  let count = 0;
  const d = debounce(() => count++, 20);
  d();
  d();
  d();
  assert.strictEqual(count, 0);
  await new Promise((r) => setTimeout(r, 30));
  assert.strictEqual(count, 1);
  console.log("✔ 06_debounce_throttle passed");

  // Test 7: Deep Clone & Equal
  const original = { a: 1, b: [2, 3], c: new Date() };
  const clone = deepClone(original);
  assert.notStrictEqual(original, clone);
  assert.strictEqual(deepEqual(original, clone), true);
  console.log("✔ 07_deep_clone_equals passed");

  // Test 8: Async Task Pool
  const pool = new AsyncTaskPool(2);
  const taskResults = await Promise.all([
    pool.run(async () => 10),
    pool.run(async () => 20),
    pool.run(async () => 30),
  ]);
  assert.deepStrictEqual(taskResults, [10, 20, 30]);
  console.log("✔ 08_async_task_pool passed");

  // Test 9: Event Emitter
  const emitter = new EventEmitter();
  let received = null;
  emitter.once("test", (val) => (received = val));
  emitter.emit("test", "hello");
  assert.strictEqual(received, "hello");
  assert.strictEqual(emitter.listenerCount("test"), 0);
  console.log("✔ 09_event_emitter passed");

  // Test 10: Stream Pipeline
  const pipelineResult = Pipeline.from([1, 2, 3, 4, 5, 6])
    .filter((x) => x % 2 === 0)
    .map((x) => x * 10)
    .toArray();
  assert.deepStrictEqual(pipelineResult, [20, 40, 60]);
  console.log("✔ 10_stream_pipeline passed");

  console.log("\n✨ ALL 10 JAVASCRIPT PROGRAMS PASSED VERIFICATION!");
}

runAllTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

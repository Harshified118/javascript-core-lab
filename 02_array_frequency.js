/**
 * 02_array_frequency.js
 * Category: Basic
 *
 * Description:
 * Computes frequency counts for items in an array, identifies the mode,
 * returns top-K frequent elements, and demonstrates set-based and order-preserving deduplication.
 */

/**
 * Builds a frequency Map for any array of primitives or strings.
 * Time: O(n), Space: O(n)
 */
function getFrequencyMap(arr) {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return map;
}

/**
 * Returns array deduplicated while preserving original first-occurrence order.
 */
function deduplicate(arr) {
  return Array.from(new Set(arr));
}

/**
 * Finds the top K most frequent elements.
 */
function topKFrequent(arr, k) {
  const freqMap = getFrequencyMap(arr);
  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([item]) => item);
}

/**
 * Finds the statistical mode(s) (element(s) with highest occurrence).
 */
function findMode(arr) {
  if (!arr.length) return [];
  const freqMap = getFrequencyMap(arr);
  let maxCount = 0;
  for (const count of freqMap.values()) {
    if (count > maxCount) maxCount = count;
  }
  const modes = [];
  for (const [key, count] of freqMap.entries()) {
    if (count === maxCount) {
      modes.push(key);
    }
  }
  return { modes, count: maxCount };
}

function runDemo() {
  console.log("=== 02: Array Frequency & Stats Demo ===");
  const numbers = [4, 1, 4, 2, 3, 4, 1, 2, 5, 1, 1, 9];
  const words = ["apple", "banana", "apple", "cherry", "banana", "apple", "date"];

  console.log("Original Numbers:", numbers);
  console.log("Deduplicated:", deduplicate(numbers));

  const numFreq = Object.fromEntries(getFrequencyMap(numbers));
  console.log("Number Frequency Table:", numFreq);
  console.log("Top 2 Frequent Numbers:", topKFrequent(numbers, 2));
  console.log("Modes of Numbers:", findMode(numbers));

  console.log("\nOriginal Words:", words);
  console.log("Top 2 Frequent Words:", topKFrequent(words, 2));
  console.log("Modes of Words:", findMode(words));
}

if (require.main === module) {
  runDemo();
}

module.exports = { getFrequencyMap, deduplicate, topKFrequent, findMode };

/**
 * 07_deep_clone_equals.js
 * Category: Intermediate / Data Structures
 *
 * Description:
 * Implements:
 * 1. `deepClone`: Deep object cloning supporting circular references, Maps, Sets,
 *    Dates, RegExp, Arrays, and plain Objects.
 * 2. `deepEqual`: Structural recursive equality comparator.
 */

/**
 * Clones complex nested data structures while handling circular references.
 */
function deepClone(value, hash = new WeakMap()) {
  // Primitives and functions
  if (Object(value) !== value || typeof value === "function") {
    return value;
  }

  // Handle circular references
  if (hash.has(value)) {
    return hash.get(value);
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // Handle Map
  if (value instanceof Map) {
    const copyMap = new Map();
    hash.set(value, copyMap);
    value.forEach((v, k) => {
      copyMap.set(deepClone(k, hash), deepClone(v, hash));
    });
    return copyMap;
  }

  // Handle Set
  if (value instanceof Set) {
    const copySet = new Set();
    hash.set(value, copySet);
    value.forEach((v) => {
      copySet.add(deepClone(v, hash));
    });
    return copySet;
  }

  // Handle Array & Plain Objects
  const result = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  hash.set(value, result);

  const keys = Reflect.ownKeys(value);
  for (const key of keys) {
    result[key] = deepClone(value[key], hash);
  }

  return result;
}

/**
 * Performs deep recursive equality comparison between two values.
 */
function deepEqual(a, b, visited = new WeakMap()) {
  if (Object.is(a, b)) return true;

  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    return false;
  }

  if (a.constructor !== b.constructor) return false;

  if (a instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp) return a.source === b.source && a.flags === b.flags;

  if (visited.has(a) && visited.get(a) === b) return true;
  visited.set(a, b);

  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a.entries()) {
      if (!b.has(k) || !deepEqual(v, b.get(k), visited)) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    const bArr = Array.from(b);
    for (const item of a) {
      if (!bArr.some((bItem) => deepEqual(item, bItem, visited))) return false;
    }
    return true;
  }

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Reflect.has(b, key) || !deepEqual(a[key], b[key], visited)) {
      return false;
    }
  }

  return true;
}

function runDemo() {
  console.log("=== 07: Deep Clone & Deep Equal Demo ===");

  const original = {
    num: 42,
    str: "hello",
    date: new Date("2026-10-17T12:00:00Z"),
    regex: /pattern/gi,
    set: new Set([1, 2, 3]),
    map: new Map([["key", { nested: "value" }]]),
    arr: [1, [2, 3]],
  };

  // Add circular reference
  original.self = original;

  console.log("Cloning complex object with circular reference...");
  const cloned = deepClone(original);

  console.log("Are original and cloned identical references?", original === cloned); // false
  console.log("Is circular reference preserved correctly?", cloned.self === cloned); // true
  console.log("Is cloned date equal?", cloned.date.getTime() === original.date.getTime()); // true
  console.log("Did nested mutation affect original?");
  cloned.arr[1].push(99);
  console.log("Original arr[1]:", original.arr[1]); // [2, 3]
  console.log("Cloned arr[1]:", cloned.arr[1]); // [2, 3, 99]

  console.log("\nTesting deepEqual:");
  const obj1 = { a: [1, 2], b: { c: "test" } };
  const obj2 = { a: [1, 2], b: { c: "test" } };
  const obj3 = { a: [1, 2], b: { c: "different" } };

  console.log("deepEqual(obj1, obj2):", deepEqual(obj1, obj2)); // true
  console.log("deepEqual(obj1, obj3):", deepEqual(obj1, obj3)); // false
}

if (require.main === module) {
  runDemo();
}

module.exports = { deepClone, deepEqual };

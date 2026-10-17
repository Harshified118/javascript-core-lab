/**
 * 10_stream_pipeline.js
 * Category: Intermediate / Functional Programming
 *
 * Description:
 * A composable, lazy transformation pipeline for sequences and streams:
 * - Lazy evaluation using JavaScript generators and async iterables
 * - Operations: `.map()`, `.filter()`, `.take()`, `.skip()`, `.batch()`, `.reduce()`
 * - Memory efficient: processes items one by one without buffering full collections
 */

class Pipeline {
  constructor(iterable) {
    this.iterable = iterable;
  }

  static from(iterable) {
    return new Pipeline(iterable);
  }

  /**
   * Lazily transforms each element.
   */
  map(fn) {
    const source = this.iterable;
    function* generator() {
      let index = 0;
      for (const item of source) {
        yield fn(item, index++);
      }
    }
    return new Pipeline(generator());
  }

  /**
   * Lazily filters elements matching predicate.
   */
  filter(predicate) {
    const source = this.iterable;
    function* generator() {
      let index = 0;
      for (const item of source) {
        if (predicate(item, index++)) {
          yield item;
        }
      }
    }
    return new Pipeline(generator());
  }

  /**
   * Lazily takes at most n items.
   */
  take(n) {
    const source = this.iterable;
    function* generator() {
      let count = 0;
      for (const item of source) {
        if (count >= n) break;
        yield item;
        count++;
      }
    }
    return new Pipeline(generator());
  }

  /**
   * Lazily skips the first n items.
   */
  skip(n) {
    const source = this.iterable;
    function* generator() {
      let skipped = 0;
      for (const item of source) {
        if (skipped < n) {
          skipped++;
          continue;
        }
        yield item;
      }
    }
    return new Pipeline(generator());
  }

  /**
   * Lazily chunks elements into batches of fixed size.
   */
  batch(size) {
    if (size <= 0) throw new Error("Batch size must be greater than 0");
    const source = this.iterable;
    function* generator() {
      let chunk = [];
      for (const item of source) {
        chunk.push(item);
        if (chunk.length === size) {
          yield chunk;
          chunk = [];
        }
      }
      if (chunk.length > 0) {
        yield chunk;
      }
    }
    return new Pipeline(generator());
  }

  /**
   * Terminal operation: folds pipeline into a single accumulator.
   */
  reduce(reducer, initialValue) {
    let acc = initialValue;
    for (const item of this.iterable) {
      acc = reducer(acc, item);
    }
    return acc;
  }

  /**
   * Terminal operation: collects into an Array.
   */
  toArray() {
    return Array.from(this.iterable);
  }
}

function runDemo() {
  console.log("=== 10: Stream & Pipeline Processing Demo ===");

  // Create an infinite generator of natural numbers
  function* naturalNumbers() {
    let n = 1;
    while (true) {
      yield n++;
    }
  }

  console.log("Processing lazy infinite stream:");
  console.log("Pipeline: Natural numbers -> filter even -> square -> skip 5 -> take 8 -> batch into 4s");

  const results = Pipeline.from(naturalNumbers())
    .filter((n) => n % 2 === 0) // 2, 4, 6, 8, 10, 12, ...
    .map((n) => n * n) // 4, 16, 36, 64, 100, 144, ...
    .skip(5) // skips first 5 even squares
    .take(8) // takes next 8 items
    .batch(4) // batches into groups of 4
    .toArray();

  console.log("Batched Output:", results);

  // Aggregation demo
  const sales = [
    { item: "Laptop", price: 1200, category: "Tech" },
    { item: "Mouse", price: 25, category: "Tech" },
    { item: "Desk", price: 300, category: "Furniture" },
    { item: "Monitor", price: 400, category: "Tech" },
    { item: "Chair", price: 150, category: "Furniture" },
  ];

  const totalTechSpend = Pipeline.from(sales)
    .filter((s) => s.category === "Tech")
    .map((s) => s.price)
    .reduce((sum, price) => sum + price, 0);

  console.log("\nTotal Tech Spend:", `$${totalTechSpend}`);
}

if (require.main === module) {
  runDemo();
}

module.exports = Pipeline;

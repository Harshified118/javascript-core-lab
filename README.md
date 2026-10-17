# JavaScript Core Lab (`javascript-core-lab`)

> A curated collection of 10 foundational to intermediate JavaScript programs covering core algorithms, data structures, asynchronous concurrency, and clean architectural design patterns.

[![Node.js CI](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: Passing](https://img.shields.io/badge/Tests-10%20Passing-brightgreen.svg)]()

---

## 📚 Overview & Table of Contents

| # | Program | Level | Focus & Key Concepts |
|---|---|---|---|
| **01** | [`01_palindrome_checker.js`](./01_palindrome_checker.js) | Basic | Two-pointer algorithm, string normalization, $O(n)$ time & $O(1)$ space |
| **02** | [`02_array_frequency.js`](./02_array_frequency.js) | Basic | Hash Maps, statistical mode, Top-K frequent elements, deduplication |
| **03** | [`03_unit_converter.js`](./03_unit_converter.js) | Basic | Modular design, unit conversion (Temperature, Length, Weight) |
| **04** | [`04_number_math_utils.js`](./04_number_math_utils.js) | Basic | Sieve of Eratosthenes, Euclidean GCD/LCM, BigInt Factorials, Fibonacci generator |
| **05** | [`05_kv_store_ttl.js`](./05_kv_store_ttl.js) | Basic | In-memory cache, Time-to-Live (TTL), LRU eviction policy, hit/miss metrics |
| **06** | [`06_debounce_throttle.js`](./06_debounce_throttle.js) | Intermediate | High-order async control, leading/trailing triggers, cancellation & flush |
| **07** | [`07_deep_clone_equals.js`](./07_deep_clone_equals.js) | Intermediate | Circular reference detection (WeakMap), Map/Set/Date/RegExp cloning & deep equality |
| **08** | [`08_async_task_pool.js`](./08_async_task_pool.js) | Intermediate | Concurrency limiter / Promise worker pool with priority scheduling |
| **09** | [`09_event_emitter.js`](./09_event_emitter.js) | Intermediate | Pub/Sub event emitter, `.on()`, `.once()`, `.off()`, wildcards `*`, error isolation |
| **10** | [`10_stream_pipeline.js`](./10_stream_pipeline.js) | Intermediate | Lazy stream processing pipeline (`map`, `filter`, `skip`, `take`, `batch`, `reduce`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)

### Installation
Clone the repository:
```bash
git clone https://github.com/Harshified118/javascript-core-lab.git
cd javascript-core-lab
```

### Running the Full Test Suite
```bash
npm test
# or
node test_all.js
```

### Running Individual Programs
Each file includes its own self-contained demo runner:
```bash
node 01_palindrome_checker.js
node 02_array_frequency.js
node 03_unit_converter.js
node 04_number_math_utils.js
node 05_kv_store_ttl.js
node 06_debounce_throttle.js
node 07_deep_clone_equals.js
node 08_async_task_pool.js
node 09_event_emitter.js
node 10_stream_pipeline.js
```

Or via npm scripts:
```bash
npm run demo:06
npm run demo:08
```

---

## 🧠 Detailed Program Summaries

### 01. Palindrome Checker & Normalizer
Demonstrates two complementary approaches:
1. **Two-Pointer In-Place Traversal**: Evaluates palindromic symmetry while ignoring spaces, casing, and punctuation without allocating auxiliary string arrays.
2. **Normalized String Reversal**: Concise idiomatic approach using regex matching and string reversal.

### 02. Array Frequency & Statistics
Constructs frequency tables using ES6 `Map` to solve classic collection problems:
- Deduplication while preserving original insertion order.
- Top-K frequent elements via sorted map entries.
- Mode calculation handling multimodal distributions.

### 03. Multi-Unit Conversion Engine
A clean, object-oriented converter supporting:
- Temperature: Celsius, Fahrenheit, Kelvin
- Length: Meters, Kilometers, Centimeters, Millimeters, Miles, Feet, Inches
- Weight: Kilograms, Grams, Pounds, Ounces

### 04. Number & Math Utilities
Implements key mathematical algorithms:
- $O(\sqrt{n})$ trial division prime checking.
- Sieve of Eratosthenes producing primes up to $N$ in $O(n \log \log n)$.
- Euclidean algorithm for Greatest Common Divisor and Least Common Multiple.
- Arbitrary-precision factorial calculation via JavaScript `BigInt`.
- Lazy Fibonacci generation using generator functions (`function*`).

### 05. In-Memory Key-Value Store with TTL & LRU
A robust caching layer featuring:
- Per-key Time-to-Live (TTL) with active and passive expiration sweeps.
- Least-Recently-Used (LRU) eviction when configured storage capacity is reached.
- Observability counters for hits, misses, expirations, and evictions.

### 06. Debounce and Throttle Controls
Rate-limits high-frequency invocations (e.g., search inputs, window resize, scroll events):
- **Debounce**: Delays execution until an inactivity period elapses.
- **Throttle**: Guarantees regular execution intervals.
- Full cancellation (`.cancel()`) and immediate execution (`.flush()`).

### 07. Deep Object Clone & Deep Structural Equality
Advanced data structure handling:
- Traverses and clones arbitrary nested graphs including circular references via `WeakMap`.
- Deeply copies `Date`, `RegExp`, `Map`, `Set`, arrays, and plain objects.
- Recursive `deepEqual` comparator evaluating value and reference equivalence.

### 08. Asynchronous Task Worker Pool
Controls asynchronous job throughput:
- Limits maximum active concurrent Promises (e.g. rate-limiting network calls).
- Priority-ordered task execution queue.
- Real-time tracking of pending and in-flight operations.

### 09. Event Emitter (Observer Pattern)
A decoupled publish-subscribe system:
- Listener registration via `.on()` and auto-deregistering one-time listeners via `.once()`.
- Returned unsubscribe handles for clean memory cleanup.
- Global wildcard (`*`) event routing for centralized logging and telemetry.
- Isolated exception handling ensuring resilient dispatch.

### 10. Lazy Stream & Pipeline Processor
Functional pipeline processing for large or infinite datasets:
- Composable operators: `map`, `filter`, `skip`, `take`, `batch`, `reduce`.
- Zero-copy lazy iterator evaluation using generators.
- Processes streaming items without loading the entire collection into memory.

---

## 👤 Author

**Harsh Kr** ([@Harshified118](https://github.com/Harshified118))
- B-Tech CSE Student
- Focus: Python, DSA, JavaScript & Modern Web Systems

---

## 📄 License
This project is licensed under the MIT License.

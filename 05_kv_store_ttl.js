/**
 * 05_kv_store_ttl.js
 * Category: Basic / Data Store
 *
 * Description:
 * An in-memory Key-Value store supporting:
 * - Time-To-Live (TTL) expiration per key
 * - Lazy expiration on read
 * - Active cleanup interval
 * - Capacity limit with LRU eviction
 * - Hit / Miss statistics
 */

class KeyValueStore {
  /**
   * @param {Object} options
   * @param {number} [options.maxSize=100] Maximum entries allowed before LRU eviction
   * @param {number} [options.cleanupIntervalMs=1000] Interval for sweep cleaner
   */
  constructor({ maxSize = 100, cleanupIntervalMs = 0 } = {}) {
    this.maxSize = maxSize;
    this.store = new Map(); // Preserves insertion/access order
    this.stats = { hits: 0, misses: 0, evictions: 0, expirations: 0 };

    if (cleanupIntervalMs > 0) {
      this.timer = setInterval(() => this.cleanup(), cleanupIntervalMs);
      if (this.timer.unref) this.timer.unref(); // Don't block Node.js process exit
    }
  }

  /**
   * Sets a key with optional TTL in milliseconds.
   */
  set(key, value, ttlMs = null) {
    const expiresAt = ttlMs ? Date.now() + ttlMs : null;

    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxSize) {
      // Evict oldest (LRU first key)
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
      this.stats.evictions++;
    }

    this.store.set(key, { value, expiresAt });
  }

  /**
   * Gets a value by key. Returns undefined if missing or expired.
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.stats.expirations++;
      this.stats.misses++;
      return undefined;
    }

    // Refresh LRU position (delete & re-insert)
    this.store.delete(key);
    this.store.set(key, entry);

    this.stats.hits++;
    return entry.value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    return this.store.delete(key);
  }

  size() {
    this.cleanup();
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.store.delete(key);
        this.stats.expirations++;
      }
    }
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.clear();
  }
}

async function runDemo() {
  console.log("=== 05: Key-Value Store with TTL & LRU Demo ===");
  const cache = new KeyValueStore({ maxSize: 3 });

  console.log("Setting session=active (no TTL)");
  cache.set("session", "active");

  console.log("Setting temp_token=abc123xyz (TTL: 150ms)");
  cache.set("temp_token", "abc123xyz", 150);

  console.log("Immediate read temp_token:", cache.get("temp_token")); // abc123xyz

  console.log("Waiting 200ms for expiration...");
  await new Promise((r) => setTimeout(r, 200));

  console.log("Read expired temp_token:", cache.get("temp_token")); // undefined

  console.log("\nTesting LRU Eviction with capacity = 3:");
  cache.set("k1", "v1");
  cache.set("k2", "v2");
  cache.set("k3", "v3");
  console.log("Accessing k1 to make it recently used:", cache.get("k1"));

  console.log("Adding k4 (should evict k2, as k1 was accessed):");
  cache.set("k4", "v4");

  console.log("k1 exists?", cache.has("k1")); // true
  console.log("k2 exists?", cache.has("k2")); // false (evicted)
  console.log("k3 exists?", cache.has("k3")); // true
  console.log("k4 exists?", cache.has("k4")); // true

  console.log("\nCache Stats:", cache.stats);
  cache.destroy();
}

if (require.main === module) {
  runDemo();
}

module.exports = KeyValueStore;

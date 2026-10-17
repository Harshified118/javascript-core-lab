/**
 * 09_event_emitter.js
 * Category: Intermediate / Design Pattern
 *
 * Description:
 * A type-friendly, robust Pub/Sub EventEmitter implementation:
 * - `.on(event, listener)`: Registers a persistent event listener
 * - `.once(event, listener)`: Registers a one-time event listener
 * - `.off(event, listener)`: Removes a registered listener
 * - `.emit(event, ...args)`: Dispatches events synchronously or asynchronously
 * - `.listenerCount(event)`: Counts active listeners
 * - Wildcard `*` event interception
 * - Error isolation so one failing listener doesn't crash remaining listeners
 */

class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event. Returns an unsubscribe function for ergonomics.
   */
  on(event, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push({ listener, once: false });

    return () => this.off(event, listener);
  }

  /**
   * Subscribe to an event once.
   */
  once(event, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push({ listener, once: true });

    return () => this.off(event, listener);
  }

  /**
   * Remove a specific listener or all listeners for an event.
   */
  off(event, listener) {
    if (!this.events.has(event)) return this;

    if (!listener) {
      this.events.delete(event);
      return this;
    }

    const listeners = this.events.get(event);
    const filtered = listeners.filter((item) => item.listener !== listener);

    if (filtered.length === 0) {
      this.events.delete(event);
    } else {
      this.events.set(event, filtered);
    }

    return this;
  }

  /**
   * Emit an event to all subscribers.
   */
  emit(event, ...args) {
    const list = this.events.get(event) ? [...this.events.get(event)] : [];
    const wildcards = this.events.get("*") ? [...this.events.get("*")] : [];

    const toInvoke = [...list, ...wildcards];
    let dispatched = false;

    for (const entry of toInvoke) {
      dispatched = true;
      try {
        entry.listener(...args);
      } catch (err) {
        console.error(`[EventEmitter Error in '${event}']`, err);
      }

      if (entry.once) {
        this.off(event, entry.listener);
      }
    }

    return dispatched;
  }

  listenerCount(event) {
    const list = this.events.get(event);
    return list ? list.length : 0;
  }

  removeAllListeners() {
    this.events.clear();
  }
}

function runDemo() {
  console.log("=== 09: EventEmitter Demo ===");
  const emitter = new EventEmitter();

  // 1. Persistent listener
  const unsubscribeUserLogin = emitter.on("user:login", (user) => {
    console.log(`[Notification] User logged in: ${user.name} (Role: ${user.role})`);
  });

  // 2. One-time welcome listener
  emitter.once("user:login", (user) => {
    console.log(`[Welcome Email] Welcome email triggered for: ${user.name}`);
  });

  // 3. Wildcard audit logger
  emitter.on("*", (payload) => {
    console.log("[Audit Log] Event triggered with payload:", payload);
  });

  console.log("Emitting first login event:");
  emitter.emit("user:login", { name: "Harsh", role: "Developer" });

  console.log("\nEmitting second login event (once listener should NOT run):");
  emitter.emit("user:login", { name: "Harsh", role: "Developer" });

  console.log("\nUnsubscribing persistent listener:");
  unsubscribeUserLogin();

  console.log("Emitting third login event (only wildcard logger runs):");
  emitter.emit("user:login", { name: "Harsh", role: "Developer" });
}

if (require.main === module) {
  runDemo();
}

module.exports = EventEmitter;

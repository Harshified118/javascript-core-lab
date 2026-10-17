/**
 * 08_async_task_pool.js
 * Category: Intermediate / Concurrency
 *
 * Description:
 * An asynchronous worker pool (concurrency limiter):
 * - Bounds simultaneous async executions to a maximum limit `concurrency`
 * - Supports priority levels (higher priority tasks run first)
 * - Returns a Promise for each enqueued task
 * - Provides live active/pending task counts and completion events
 */

class AsyncTaskPool {
  /**
   * @param {number} concurrency Maximum active simultaneous promises
   */
  constructor(concurrency = 2) {
    if (concurrency < 1) throw new Error("Concurrency must be at least 1");
    this.concurrency = concurrency;
    this.queue = [];
    this.activeCount = 0;
  }

  /**
   * Adds an async task factory function () => Promise<T>
   * @param {Function} taskFn Function returning a promise
   * @param {number} [priority=0] Higher number = higher priority
   * @returns {Promise<any>}
   */
  run(taskFn, priority = 0) {
    return new Promise((resolve, reject) => {
      const taskEntry = { taskFn, priority, resolve, reject };

      // Insert ordered by priority (descending)
      const insertIndex = this.queue.findIndex((item) => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(taskEntry);
      } else {
        this.queue.splice(insertIndex, 0, taskEntry);
      }

      this._next();
    });
  }

  _next() {
    while (this.activeCount < this.concurrency && this.queue.length > 0) {
      const { taskFn, resolve, reject } = this.queue.shift();
      this.activeCount++;

      Promise.resolve()
        .then(() => taskFn())
        .then(
          (result) => {
            this.activeCount--;
            resolve(result);
            this._next();
          },
          (error) => {
            this.activeCount--;
            reject(error);
            this._next();
          }
        );
    }
  }

  pendingCount() {
    return this.queue.length;
  }

  runningCount() {
    return this.activeCount;
  }
}

async function runDemo() {
  console.log("=== 08: Async Task Pool Demo ===");
  const pool = new AsyncTaskPool(2); // Max 2 tasks concurrently

  const createJob = (id, durationMs) => async () => {
    console.log(`[START] Task ${id} (duration: ${durationMs}ms) | Active: ${pool.runningCount()}`);
    await new Promise((r) => setTimeout(r, durationMs));
    console.log(`[DONE ] Task ${id}`);
    return `Result of Task ${id}`;
  };

  const tasks = [
    pool.run(createJob("A", 120), 0),
    pool.run(createJob("B", 80), 0),
    pool.run(createJob("C", 60), 0),
    pool.run(createJob("VIP_D", 50), 10), // High priority task
    pool.run(createJob("E", 40), 0),
  ];

  console.log("Enqueued 5 tasks with concurrency limit = 2.");
  const results = await Promise.all(tasks);
  console.log("\nAll tasks completed successfully:");
  console.log(results);
}

if (require.main === module) {
  runDemo();
}

module.exports = AsyncTaskPool;

/**
 * 06_debounce_throttle.js
 * Category: Intermediate / Async Utility
 *
 * Description:
 * Production-ready implementations of Debounce and Throttle:
 * - Debounce: delays execution until silence period finishes, supports immediate/leading trigger.
 * - Throttle: limits execution to at most once per time window, supports leading & trailing flags.
 * - Both include `.cancel()` and `.flush()` methods.
 */

/**
 * Debounce function: delays invoking fn until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
function debounce(fn, wait, { leading = false, trailing = true } = {}) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let result = null;

  function invoke() {
    if (trailing && lastArgs) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
    timerId = null;
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const callNow = leading && !timerId;

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(invoke, wait);

    if (callNow) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }

    return result;
  }

  debounced.cancel = function () {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = function () {
    if (timerId) {
      invoke();
      clearTimeout(timerId);
      timerId = null;
    }
    return result;
  };

  debounced.pending = function () {
    return timerId !== null;
  };

  return debounced;
}

/**
 * Throttle function: enforces maximum execution frequency of fn to once every wait ms.
 */
function throttle(fn, wait, { leading = true, trailing = true } = {}) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = 0;
  let result = null;

  function invoke() {
    lastCallTime = leading ? Date.now() : 0;
    timerId = null;
    if (lastArgs) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  }

  function throttled(...args) {
    const now = Date.now();
    if (!lastCallTime && !leading) {
      lastCallTime = now;
    }

    const remaining = wait - (now - lastCallTime);
    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > wait) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastCallTime = now;
      result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    } else if (!timerId && trailing) {
      timerId = setTimeout(invoke, remaining);
    }

    return result;
  }

  throttled.cancel = function () {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastCallTime = 0;
    lastArgs = null;
    lastThis = null;
  };

  throttled.flush = function () {
    if (timerId) {
      invoke();
      clearTimeout(timerId);
      timerId = null;
    }
    return result;
  };

  return throttled;
}

async function runDemo() {
  console.log("=== 06: Debounce & Throttle Demo ===");

  // Demo Debounce
  let debounceCount = 0;
  const debouncedSearch = debounce((query) => {
    debounceCount++;
    console.log(`[Debounce Executed #${debounceCount}] Searching for: "${query}"`);
  }, 100);

  console.log("Rapidly triggering debouncedSearch 5 times...");
  debouncedSearch("a");
  debouncedSearch("ap");
  debouncedSearch("app");
  debouncedSearch("appl");
  debouncedSearch("apple");

  await new Promise((r) => setTimeout(r, 150));
  console.log(`Debounced function ran ${debounceCount} time(s) (expected 1).`);

  // Demo Throttle
  let throttleCount = 0;
  const throttledScroll = throttle((scrollPos) => {
    throttleCount++;
    console.log(`[Throttle Executed #${throttleCount}] Scroll pos: ${scrollPos}`);
  }, 80);

  console.log("\nSimulating scroll events over 250ms...");
  const interval = setInterval(() => {
    throttledScroll(Math.floor(Math.random() * 1000));
  }, 20);

  await new Promise((r) => setTimeout(r, 260));
  clearInterval(interval);
  throttledScroll.cancel();

  console.log(`Throttled function ran ${throttleCount} time(s) (spaced by 80ms).`);
}

if (require.main === module) {
  runDemo();
}

module.exports = { debounce, throttle };

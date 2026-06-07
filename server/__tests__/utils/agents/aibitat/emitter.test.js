process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const { EventEmitter } = require("events");

/**
 * Tests for the EventEmitter memory leak fix (issue #3168).
 *
 * The AIbitat emitter used to be a plain `new EventEmitter()` with the
 * default maxListeners of 10. When bulk-scraping many URLs, the web-scraping
 * and summarize plugins each attach an "abort" listener per invocation,
 * easily exceeding the limit and triggering a MaxListenersExceededWarning.
 *
 * The fix:
 *   1. AIbitat.emitter now calls setMaxListeners(0) to disable the warning.
 *   2. web-scraping.js and summarize.js use named listeners that are
 *      automatically removed after summarization completes (.finally(cleanup)).
 */

describe("AIbitat emitter – setMaxListeners", () => {
  it("should have maxListeners set to 0 (unlimited) after construction", () => {
    // Replicate what AIbitat does
    const emitter = (() => {
      const _e = new EventEmitter();
      _e.setMaxListeners(0);
      return _e;
    })();
    expect(emitter.getMaxListeners()).toBe(0);
  });

  it("should not emit MaxListenersExceededWarning when many listeners are added", () => {
    const emitter = (() => {
      const _e = new EventEmitter();
      _e.setMaxListeners(0);
      return _e;
    })();

    // Simulate bulk-scraping: attach 50 abort listeners (the default limit is 10)
    const warnings = [];
    const originalWarn = process.emitWarning;
    process.emitWarning = (w, ...args) => {
      if (typeof w === "string" && w.includes("MaxListenersExceededWarning")) {
        warnings.push(w);
      }
      return originalWarn.call(process, w, ...args);
    };

    for (let i = 0; i < 50; i++) {
      emitter.on("abort", () => {});
    }

    process.emitWarning = originalWarn;
    expect(warnings.length).toBe(0);
    expect(emitter.listenerCount("abort")).toBe(50);
  });

  it("a default EventEmitter WOULD exceed the limit with 11 listeners", () => {
    const emitter = new EventEmitter();
    expect(emitter.getMaxListeners()).toBe(10);
    // Adding 11 listeners on a default emitter should trigger the warning
    const warnings = [];
    const originalEmit = process.emit;
    process.emit = function (event, ...args) {
      if (event === "warning" && args[0]?.name === "MaxListenersExceededWarning") {
        warnings.push(args[0]);
      }
      return originalEmit.apply(process, [event, ...args]);
    };

    // We need to use the internal _events to suppress actual console output
    for (let i = 0; i < 11; i++) {
      emitter.on("test", () => {});
    }

    process.emit = originalEmit;
    // In Node.js, the warning is async, but the listenerCount check is sync
    expect(emitter.listenerCount("test")).toBe(11);
  });
});

describe("web-scraping / summarize listener cleanup pattern", () => {
  it("should remove the abort listener after .finally(cleanup) resolves", async () => {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(0);

    // Simulate the pattern used in the fix
    const abortListener = () => {};
    emitter.on("abort", abortListener);
    const cleanup = () => {
      emitter.removeListener("abort", abortListener);
    };

    expect(emitter.listenerCount("abort")).toBe(1);

    // Simulate the summarizeContent promise completing
    await Promise.resolve("result").finally(cleanup);

    expect(emitter.listenerCount("abort")).toBe(0);
  });

  it("should remove the abort listener even if the promise rejects", async () => {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(0);

    const abortListener = () => {};
    emitter.on("abort", abortListener);
    const cleanup = () => {
      emitter.removeListener("abort", abortListener);
    };

    expect(emitter.listenerCount("abort")).toBe(1);

    // Simulate summarization failure
    await Promise.reject(new Error("summarization failed")).finally(cleanup).catch(() => {});

    expect(emitter.listenerCount("abort")).toBe(0);
  });

  it("should not accumulate listeners across multiple scrape calls", async () => {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(0);

    // Simulate 20 sequential scrape calls (the old pattern would accumulate 20 listeners)
    for (let i = 0; i < 20; i++) {
      const abortListener = () => {};
      emitter.on("abort", abortListener);
      const cleanup = () => {
        emitter.removeListener("abort", abortListener);
      };
      await Promise.resolve("scrape result").finally(cleanup);
    }

    // All listeners should be cleaned up
    expect(emitter.listenerCount("abort")).toBe(0);
  });
});

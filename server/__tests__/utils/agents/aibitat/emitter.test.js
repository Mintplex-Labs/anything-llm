process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const { EventEmitter } = require("events");
const AIbitat = require("../../../../utils/agents/aibitat/index.js");

/**
 * Tests for the EventEmitter memory leak fix (issue #3168).
 *
 * The AIbitat emitter used to be a plain `new EventEmitter()` with the
 * default maxListeners of 10. When bulk-scraping many URLs, the web-scraping
 * and summarize plugins each attach an "abort" listener per invocation via
 * onAbort(), easily exceeding the limit and triggering a
 * MaxListenersExceededWarning.
 *
 * The fix:
 *   1. AIbitat.emitter now calls setMaxListeners(0) to disable the warning.
 *   2. web-scraping.js and summarize.js use named listeners with
 *      .finally(cleanup) so they are removed after summarization completes.
 */

function createAibitat() {
  return new AIbitat({
    provider: "openai",
    handlerProps: { log: () => {} },
  });
}

describe("AIbitat emitter – setMaxListeners", () => {
  it("should have the default maxListeners (10) after construction", () => {
    const instance = createAibitat();
    expect(instance.emitter.getMaxListeners()).toBe(10);
  });

  it("should not emit MaxListenersExceededWarning with many onAbort listeners", () => {
    const instance = createAibitat();
    const warnings = [];
    const originalEmit = process.emit;
    process.emit = function (event, ...args) {
      if (
        event === "warning" &&
        args[0]?.name === "MaxListenersExceededWarning"
      ) {
        warnings.push(args[0]);
      }
      return originalEmit.apply(process, [event, ...args]);
    };

    for (let i = 0; i < 50; i++) {
      instance.onAbort(() => {});
    }

    process.emit = originalEmit;
    expect(warnings).toHaveLength(0);
    expect(instance.emitter.listenerCount("abort")).toBe(50);
  });

  it("a default EventEmitter WOULD trigger a warning with 11 listeners", () => {
    const plain = new EventEmitter();
    expect(plain.getMaxListeners()).toBe(10);

    const warnings = [];
    const originalEmit = process.emit;
    process.emit = function (event, ...args) {
      if (
        event === "warning" &&
        args[0]?.name === "MaxListenersExceededWarning"
      ) {
        warnings.push(args[0]);
      }
      return originalEmit.apply(process, [event, ...args]);
    };

    for (let i = 0; i < 11; i++) {
      plain.on("abort", () => {});
    }

    process.emit = originalEmit;
    expect(plain.listenerCount("abort")).toBe(11);
  });
});

describe("AIbitat abort listener cleanup pattern", () => {
  it("should remove the abort listener after summarization resolves", async () => {
    const instance = createAibitat();

    const controller = new AbortController();
    const abortListener = () => controller.abort();
    instance.emitter.on("abort", abortListener);
    const cleanup = () =>
      instance.emitter.removeListener("abort", abortListener);

    expect(instance.emitter.listenerCount("abort")).toBe(1);

    await Promise.resolve("summary result").finally(cleanup);

    expect(instance.emitter.listenerCount("abort")).toBe(0);
  });

  it("should remove the abort listener even if summarization rejects", async () => {
    const instance = createAibitat();

    const controller = new AbortController();
    const abortListener = () => controller.abort();
    instance.emitter.on("abort", abortListener);
    const cleanup = () =>
      instance.emitter.removeListener("abort", abortListener);

    expect(instance.emitter.listenerCount("abort")).toBe(1);

    await Promise.reject(new Error("summarization failed"))
      .finally(cleanup)
      .catch(() => {});

    expect(instance.emitter.listenerCount("abort")).toBe(0);
  });

  it("should not accumulate listeners across 20 sequential scrape calls", async () => {
    const instance = createAibitat();

    for (let i = 0; i < 20; i++) {
      const controller = new AbortController();
      const abortListener = () => controller.abort();
      instance.emitter.on("abort", abortListener);
      const cleanup = () =>
        instance.emitter.removeListener("abort", abortListener);
      await Promise.resolve("scrape result").finally(cleanup);
    }

    expect(instance.emitter.listenerCount("abort")).toBe(0);
  });

  it("abort() should invoke the listener before cleanup removes it", async () => {
    const instance = createAibitat();
    let aborted = false;

    const abortListener = () => {
      aborted = true;
    };
    instance.emitter.on("abort", abortListener);
    const cleanup = () =>
      instance.emitter.removeListener("abort", abortListener);

    instance.abort();
    expect(aborted).toBe(true);

    await Promise.resolve().finally(cleanup);
    expect(instance.emitter.listenerCount("abort")).toBe(0);
  });
});

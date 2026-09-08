process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const AIbitat = require("../../../../utils/agents/aibitat/index.js");

/**
 * Tests for the EventEmitter memory leak fix (issue #3168, PR #5790).
 *
 * When bulk-scraping many URLs, providers register an "abort" listener per
 * LLM request on the session's AbortController signal, easily exceeding the
 * default limit of 10 and triggering a MaxListenersExceededWarning.
 *
 * The fix:
 *   1. The constructor calls setMaxListeners(0, this.abortController.signal)
 *      to lift the warning threshold on the session signal.
 *   2. web-scraping.js and summarize.js use named emitter listeners with
 *      .finally(cleanup) so they are removed after summarization completes,
 *      keeping the emitter itself under its default limit.
 *
 * Warnings are captured by spying on process.emitWarning, which Node calls
 * synchronously at the moment the limit is exceeded. (The "warning" event on
 * process fires a tick later and cannot be captured synchronously.)
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

  it("should not warn when many abort listeners attach to the session signal", () => {
    const instance = createAibitat();
    const warnSpy = jest
      .spyOn(process, "emitWarning")
      .mockImplementation(() => {});

    for (let i = 0; i < 50; i++) {
      instance.abortController.signal.addEventListener("abort", () => {});
    }

    const warnings = warnSpy.mock.calls.filter(
      ([warning]) => warning?.name === "MaxListenersExceededWarning"
    );
    warnSpy.mockRestore();
    expect(warnings).toHaveLength(0);
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

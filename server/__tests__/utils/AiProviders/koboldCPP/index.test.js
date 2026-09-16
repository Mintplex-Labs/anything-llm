const { EventEmitter } = require("events");
const { KoboldCPPLLM } = require("../../../../utils/AiProviders/koboldCPP");
const {
  LLMPerformanceMonitor,
} = require("../../../../utils/helpers/chat/LLMPerformanceMonitor");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    KOBOLD_CPP_BASE_PATH: "http://localhost:5001/v1",
    KOBOLD_CPP_MODEL_PREF: "test-model",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

/** Minimal stand-in for the Express response the handler writes to. */
function fakeResponse() {
  const res = new EventEmitter();
  res.chunks = [];
  res.write = (chunk) => {
    res.chunks.push(JSON.parse(String(chunk).replace(/^data: /, "")));
    return true;
  };
  res.end = () => {};
  return res;
}

function measuredStream(generator, messages = []) {
  return LLMPerformanceMonitor.measureStream({
    func: Promise.resolve(generator),
    messages,
    runPromptTokenCalculation: true,
    modelTag: "test-model",
    provider: "KoboldCPPLLM",
  });
}

function textChunk(content, finish_reason = null) {
  return { choices: [{ delta: { content }, finish_reason }] };
}

/** Resolve to the handler's value, or to the marker if it never settles. */
async function settleOrTimeout(promise, marker = "NEVER_SETTLED", ms = 250) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(marker), ms)),
  ]);
}

describe("KoboldCPPLLM.handleStream", () => {
  /** @type {KoboldCPPLLM} */
  let provider;
  let unhandled;

  beforeEach(() => {
    provider = new KoboldCPPLLM();
    unhandled = [];
    process.on("unhandledRejection", (e) => unhandled.push(e));
  });

  afterEach(() => process.removeAllListeners("unhandledRejection"));

  it("resolves with the generated text on a normal finish", async () => {
    const stream = await measuredStream(
      (async function* () {
        yield textChunk("Hello ");
        yield textChunk("world", "stop");
      })()
    );
    const response = fakeResponse();

    await expect(
      settleOrTimeout(provider.handleStream(response, stream, {}))
    ).resolves.toBe("Hello world");
    expect(response.chunks.at(-1).close).toBe(true);
  });

  it("reports a mid-stream failure instead of hanging the request", async () => {
    const stream = await measuredStream(
      (async function* () {
        yield textChunk("Hello");
        throw new Error("upstream went away");
      })()
    );
    const response = fakeResponse();

    // The text generated before the failure is preserved, as elsewhere.
    await expect(
      settleOrTimeout(provider.handleStream(response, stream, {}))
    ).resolves.toBe("Hello");

    const last = response.chunks.at(-1);
    expect(last.type).toBe("abort");
    expect(last.error).toBe("upstream went away");
    expect(unhandled).toEqual([]);
  });

  it("resolves when the stream ends without a finish_reason", async () => {
    const stream = await measuredStream(
      (async function* () {
        yield textChunk("Hello");
      })()
    );

    await expect(
      settleOrTimeout(provider.handleStream(fakeResponse(), stream, {}))
    ).resolves.toBe("Hello");
    expect(unhandled).toEqual([]);
  });

  it("ignores a usage-only chunk after the finish chunk", async () => {
    const stream = await measuredStream(
      (async function* () {
        yield textChunk("Hello", null);
        yield textChunk("", "stop");
        yield {
          choices: [],
          usage: { prompt_tokens: 3, completion_tokens: 1 },
        };
      })()
    );

    await expect(
      settleOrTimeout(provider.handleStream(fakeResponse(), stream, {}))
    ).resolves.toBe("Hello");
    // A chunk with no choices used to throw after the promise had already
    // resolved, which is an unhandled rejection rather than a failed chat.
    expect(unhandled).toEqual([]);
  });

  it("keeps the prompt token count the performance monitor measured", async () => {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Summarize the three laws of thermodynamics." },
    ];
    const stream = await measuredStream(
      (async function* () {
        yield textChunk("Sure", "stop");
      })(),
      messages
    );
    const measured = stream.metrics.prompt_tokens;
    expect(measured).toBeGreaterThan(0);

    await provider.handleStream(fakeResponse(), stream, {});

    expect(stream.metrics.prompt_tokens).toBe(measured);
  });
});

// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));

const { EventEmitter } = require("events");
const {
  handleDefaultStreamResponseV2,
} = require("../../../../utils/helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../../../utils/helpers/chat/LLMPerformanceMonitor");

function streamOf(chunks) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk;
    },
  };
}

async function runStream(chunks) {
  const stream = await LLMPerformanceMonitor.measureStream({
    func: Promise.resolve(streamOf(chunks)),
    runPromptTokenCalculation: false,
  });
  const response = new EventEmitter();
  response.write = jest.fn();
  const text = await handleDefaultStreamResponseV2(response, stream, {
    uuid: "test-uuid",
    sources: [],
  });
  return { text, metrics: stream.metrics };
}

describe("handleDefaultStreamResponseV2 provider timing", () => {
  const usage = { prompt_tokens: 120, completion_tokens: 400 };

  test("uses Cerebras time_info sent next to usage as the duration", async () => {
    const { text, metrics } = await runStream([
      { choices: [{ delta: { content: "Hi" }, finish_reason: null }] },
      {
        choices: [{ delta: {}, finish_reason: "stop" }],
        usage,
        time_info: { completion_time: 0.2, total_time: 0.21 },
      },
    ]);

    expect(text).toBe("Hi");
    expect(metrics.duration).toBe(0.2);
    expect(metrics.outputTps).toBe(2000);
  });

  test("still reads time_info nested inside usage", async () => {
    const { metrics } = await runStream([
      { choices: [{ delta: { content: "Hi" }, finish_reason: null }] },
      {
        choices: [{ delta: {}, finish_reason: "stop" }],
        usage: { ...usage, time_info: { completion_time: 0.4 } },
      },
    ]);

    expect(metrics.duration).toBe(0.4);
    expect(metrics.outputTps).toBe(1000);
  });
});

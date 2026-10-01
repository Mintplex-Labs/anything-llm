const { OpenAiLLM } = require("../../../../utils/AiProviders/openAi");
const {
  responsesTooledStream,
} = require("../../../../utils/agents/aibitat/providers/helpers/responsesTooled.js");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, OPEN_AI_KEY: "test-key" };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

const summary = (delta) => ({
  type: "response.reasoning_summary_text.delta",
  delta,
});
const partDone = { type: "response.reasoning_summary_part.done" };
const text = (delta) => ({ type: "response.output_text.delta", delta });
const completed = {
  type: "response.completed",
  response: { usage: { input_tokens: 1, output_tokens: 2, total_tokens: 3 } },
};

/** An async-iterable stream of Responses API events, as the SDK returns it. */
function fakeStream(events) {
  return {
    endMeasurement: jest.fn(),
    async *[Symbol.asyncIterator]() {
      yield* events;
    },
  };
}

async function runChatStream(events) {
  const llm = new OpenAiLLM(null, "gpt-5.1");
  const written = [];
  const response = {
    write: (data) =>
      written.push(
        JSON.parse(String(data).replace(/^data: /, "")).textResponse
      ),
    on: jest.fn(),
    removeListener: jest.fn(),
  };
  const fullText = await llm.handleStream(response, fakeStream(events), {
    uuid: "uuid",
  });
  return { fullText, streamed: written.join("") };
}

describe("OpenAiLLM.handleStream reasoning summaries", () => {
  it("wraps the reasoning summary in a think block before the answer", async () => {
    const { fullText, streamed } = await runChatStream([
      summary("Counting "),
      summary("letters"),
      partDone,
      text("Three."),
      completed,
    ]);
    expect(fullText).toBe("<think>Counting letters\n\n</think>Three.");
    expect(streamed).toBe(fullText);
  });

  it("separates multiple summary parts", async () => {
    const { fullText } = await runChatStream([
      summary("First"),
      partDone,
      summary("Second"),
      partDone,
      text("Done"),
      completed,
    ]);
    expect(fullText).toBe("<think>First\n\nSecond\n\n</think>Done");
  });

  it("streams plain text without a think block when there is no summary", async () => {
    const { fullText } = await runChatStream([
      text("Hi"),
      text("!"),
      completed,
    ]);
    expect(fullText).toBe("Hi!");
  });

  it("closes the think block when the response ends during reasoning", async () => {
    const { fullText } = await runChatStream([
      summary("Only thinking"),
      completed,
    ]);
    expect(fullText).toBe("<think>Only thinking</think>");
  });

  it("ignores empty summary deltas", async () => {
    const { fullText } = await runChatStream([
      summary(""),
      text("Hi"),
      completed,
    ]);
    expect(fullText).toBe("Hi");
  });
});

describe("responsesTooledStream reasoning summaries", () => {
  function fakeClient(events) {
    return { responses: { create: jest.fn(async () => fakeStream(events)) } };
  }

  async function runAgentStream(events) {
    let streamed = "";
    const result = await responsesTooledStream(
      fakeClient(events),
      "gpt-5.1",
      [{ role: "user", content: "hi" }],
      [],
      (_, event) => (streamed += event.content ?? "")
    );
    return { result, streamed };
  }

  it("streams the summary as a think block and keeps it in the reply", async () => {
    const { result, streamed } = await runAgentStream([
      summary("Reasoning"),
      partDone,
      text("Answer"),
      completed,
    ]);
    expect(streamed).toBe("<think>Reasoning\n\n</think>Answer");
    expect(result.textResponse).toBe("<think>Reasoning</think>Answer");
  });

  it("keeps a tool call reply free of the think block", async () => {
    const { result, streamed } = await runAgentStream([
      summary("Deciding"),
      {
        type: "response.output_item.added",
        item: {
          type: "function_call",
          name: "search",
          call_id: "c1",
          arguments: "",
        },
      },
      { type: "response.function_call_arguments.delta", delta: '{"q":"x"}' },
      completed,
    ]);
    expect(streamed.startsWith("<think>Deciding")).toBe(true);
    expect(streamed).toContain("</think>");
    expect(result.functionCall).toMatchObject({
      name: "search",
      arguments: { q: "x" },
    });
    expect(result.textResponse).toBe("");
  });

  it("returns plain text when no summary streams", async () => {
    const { result, streamed } = await runAgentStream([text("Hi"), completed]);
    expect(streamed).toBe("Hi");
    expect(result.textResponse).toBe("Hi");
  });
});

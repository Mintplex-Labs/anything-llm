const {
  normalizeMistralClient,
} = require("../../../../utils/AiProviders/mistral");
const {
  handleDefaultStreamResponseV2,
} = require("../../../../utils/helpers/chat/responses");
const { EventEmitter } = require("events");

const thinking = (text) => ({
  type: "thinking",
  thinking: [{ type: "text", text }],
  closed: true,
});
const text = (value) => ({ type: "text", text: value });
const chunk = (content, extra = {}) => ({
  choices: [{ index: 0, delta: { content }, finish_reason: null }],
  ...extra,
});

/** Builds a client whose `create` returns the given response as-is. */
function fakeClient(response) {
  return {
    chat: {
      completions: {
        create: jest.fn(async () => response),
      },
    },
  };
}

/** Builds an async-iterable stream object like the OpenAI SDK Stream. */
function fakeStream(chunks) {
  return {
    async *[Symbol.asyncIterator]() {
      yield* chunks;
    },
  };
}

async function collect(stream) {
  const out = [];
  for await (const c of stream) out.push(c);
  return out;
}

describe("normalizeMistralClient", () => {
  it("flattens array content on non-streamed completions into content and reasoning_content", async () => {
    const client = normalizeMistralClient(
      fakeClient({
        choices: [
          {
            message: {
              role: "assistant",
              content: [thinking("Greet back."), text("Hello!")],
            },
          },
        ],
      })
    );

    const result = await client.chat.completions.create({ messages: [] });
    expect(result.choices[0].message.content).toBe("Hello!");
    expect(result.choices[0].message.reasoning_content).toBe("Greet back.");
  });

  it("leaves string content untouched", async () => {
    const client = normalizeMistralClient(
      fakeClient({ choices: [{ message: { content: "Hello!" } }] })
    );

    const result = await client.chat.completions.create({ messages: [] });
    expect(result.choices[0].message).toEqual({ content: "Hello!" });
  });

  it("splits a stream chunk carrying both reasoning and text, keeping finish_reason and usage on the text part", async () => {
    const usage = { prompt_tokens: 4, completion_tokens: 10 };
    const mixed = chunk([thinking("."), text("Hello!")], { usage });
    mixed.choices[0].finish_reason = "stop";

    const client = normalizeMistralClient(fakeClient(fakeStream([mixed])));
    const stream = await client.chat.completions.create({ stream: true });
    const [reasoningPart, textPart] = await collect(stream);

    expect(reasoningPart.choices[0].delta).toEqual({
      content: "",
      reasoning_content: ".",
    });
    expect(reasoningPart.choices[0].finish_reason).toBeNull();
    expect(reasoningPart.usage).toBeNull();
    expect(textPart.choices[0].delta).toEqual({ content: "Hello!" });
    expect(textPart.choices[0].finish_reason).toBe("stop");
    expect(textPart.usage).toBe(usage);
  });

  it("streams reasoning into a closed think block before the answer through the default stream handler", async () => {
    const final = chunk(" you today?");
    final.choices[0].finish_reason = "stop";
    const chunks = [
      chunk(""),
      chunk([thinking("The user said hello.")]),
      chunk([thinking(" Reply warmly.")]),
      chunk([thinking("."), text("Hello!")]),
      chunk(" How can I help"),
      final,
    ];

    const client = normalizeMistralClient(fakeClient(fakeStream(chunks)));
    const stream = await client.chat.completions.create({ stream: true });
    stream.endMeasurement = jest.fn();

    const writes = [];
    const response = Object.assign(new EventEmitter(), {
      write: (data) => writes.push(JSON.parse(data.replace(/^data: /, ""))),
    });

    const fullText = await handleDefaultStreamResponseV2(response, stream, {
      uuid: "test",
      sources: [],
    });

    expect(fullText).toBe(
      "<think>The user said hello. Reply warmly..</think>Hello! How can I help you today?"
    );
    expect(writes.every((w) => typeof w.textResponse === "string")).toBe(true);
  });
});

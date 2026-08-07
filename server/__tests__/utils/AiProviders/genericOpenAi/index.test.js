const {
  GenericOpenAiLLM,
} = require("../../../../utils/AiProviders/genericOpenAi");
const GenericOpenAiProvider = require("../../../../utils/agents/aibitat/providers/genericOpenAi.js");

const ORIGINAL_ENV = process.env;

function userContent(messages) {
  return messages.find((m) => m.role === "user").content;
}

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    GENERIC_OPEN_AI_BASE_PATH: "http://localhost:8080/v1",
    GENERIC_OPEN_AI_MODEL_PREF: "test-model",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("GenericOpenAiLLM attachment content", () => {
  /** @type {GenericOpenAiLLM} */
  let provider;
  beforeEach(() => (provider = new GenericOpenAiLLM()));

  it("returns plain string when no attachments", () => {
    const messages = provider.constructPrompt({ userPrompt: "hello" });
    expect(userContent(messages)).toBe("hello");
  });

  it("keeps image attachments as image_url (backward compatible)", () => {
    const messages = provider.constructPrompt({
      userPrompt: "describe this",
      attachments: [
        {
          name: "image.png",
          mime: "image/png",
          contentString: "data:image/png;base64,AAAA",
        },
      ],
    });
    expect(userContent(messages)).toEqual([
      { type: "text", text: "describe this" },
      {
        type: "image_url",
        image_url: { url: "data:image/png;base64,AAAA", detail: "high" },
      },
    ]);
  });

  it("formats audio attachments as input_audio with raw base64 + format", () => {
    const messages = provider.constructPrompt({
      userPrompt: "transcribe this",
      attachments: [
        {
          name: "clip.mp3",
          mime: "audio/mpeg",
          contentString: "data:audio/mpeg;base64,BBBB",
        },
        {
          name: "clip.wav",
          mime: "audio/wav",
          contentString: "data:audio/wav;base64,CCCC",
        },
      ],
    });
    expect(userContent(messages)).toEqual([
      { type: "text", text: "transcribe this" },
      { type: "input_audio", input_audio: { data: "BBBB", format: "mp3" } },
      { type: "input_audio", input_audio: { data: "CCCC", format: "wav" } },
    ]);
  });

  it("preserves attachment order when mixing audio and images", () => {
    const messages = provider.constructPrompt({
      userPrompt: "what is in these",
      attachments: [
        { mime: "audio/mpeg", contentString: "data:audio/mpeg;base64,BBBB" },
        { mime: "image/png", contentString: "data:image/png;base64,AAAA" },
        { mime: "audio/wav", contentString: "data:audio/wav;base64,CCCC" },
      ],
    });
    expect(userContent(messages).map((c) => c.type)).toEqual([
      "text",
      "input_audio",
      "image_url",
      "input_audio",
    ]);
  });

  it("detects audio from data URI when mime is absent", () => {
    const messages = provider.constructPrompt({
      userPrompt: "hi",
      attachments: [{ contentString: "data:audio/wav;base64,DDDD" }],
    });
    expect(userContent(messages)[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "DDDD", format: "wav" },
    });
  });

  it("treats non-audio, non-image attachments as image_url (existing behavior)", () => {
    const messages = provider.constructPrompt({
      userPrompt: "hi",
      attachments: [
        {
          mime: "application/pdf",
          contentString: "data:application/pdf;base64,FFFF",
        },
      ],
    });
    expect(userContent(messages)[1].type).toBe("image_url");
  });
});

describe("GenericOpenAiLLM reasoning content", () => {
  /** @type {GenericOpenAiLLM} */
  let provider;
  beforeEach(() => (provider = new GenericOpenAiLLM()));

  function completionResponse(message) {
    return {
      choices: [{ message }],
      usage: {
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 2,
        duration: 1,
      },
    };
  }

  function reasoningStream(delta) {
    const chunks = [
      { choices: [{ delta, finish_reason: null }] },
      {
        choices: [{ delta: { content: "Answer" }, finish_reason: null }],
      },
      { choices: [{ delta: {}, finish_reason: "stop" }] },
    ];

    return {
      async *[Symbol.asyncIterator]() {
        for (const chunk of chunks) yield chunk;
      },
      endMeasurement: jest.fn(),
    };
  }

  function mockWritableResponse() {
    return {
      writableEnded: false,
      destroyed: false,
      write: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };
  }

  it.each([
    ["reasoning_content", "DeepSeek reasoning"],
    ["reasoning", "vLLM reasoning"],
  ])("parses non-streaming %s", async (field, reasoning) => {
    provider.openai.chat.completions.create = jest
      .fn()
      .mockResolvedValue(
        completionResponse({ content: "Answer", [field]: reasoning })
      );

    const result = await provider.getChatCompletion([], {});

    expect(result.textResponse).toBe(`<think>${reasoning}</think>Answer`);
  });

  it("preserves reasoning_content precedence for non-streaming responses", async () => {
    provider.openai.chat.completions.create = jest
      .fn()
      .mockResolvedValue(
        completionResponse({
          content: "Answer",
          reasoning_content: "Preferred reasoning",
          reasoning: "Fallback reasoning",
        })
      );

    const result = await provider.getChatCompletion([], {});

    expect(result.textResponse).toBe(
      "<think>Preferred reasoning</think>Answer"
    );
  });

  it.each([
    ["reasoning_content", "DeepSeek reasoning"],
    ["reasoning", "vLLM reasoning"],
  ])("parses streaming delta.%s", async (field, reasoning) => {
    const response = mockWritableResponse();
    const result = await provider.handleStream(
      response,
      reasoningStream({ [field]: reasoning }),
      { uuid: "test" }
    );

    expect(result).toBe(`<think>${reasoning}</think>Answer`);
    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining(`<think>${reasoning}`)
    );
  });

  it("preserves reasoning_content precedence for streaming responses", async () => {
    const response = mockWritableResponse();
    const result = await provider.handleStream(
      response,
      reasoningStream({
        reasoning_content: "Preferred reasoning",
        reasoning: "Fallback reasoning",
      }),
      { uuid: "test" }
    );

    expect(result).toBe("<think>Preferred reasoning</think>Answer");
  });
});

describe("GenericOpenAiProvider (agent) attachment content", () => {
  /** @type {GenericOpenAiProvider} */
  let provider;
  beforeEach(
    () => (provider = new GenericOpenAiProvider({ model: "test-model" }))
  );

  it("returns the message untouched when there are no attachments", () => {
    const message = { role: "user", content: "hello" };
    expect(provider.formatMessageWithAttachments(message)).toEqual(message);
    expect(
      provider.formatMessageWithAttachments({ ...message, attachments: [] })
    ).toEqual({ ...message, attachments: [] });
  });

  it("sends audio attachments as input_audio on the agent path", () => {
    const formatted = provider.formatMessageWithAttachments({
      role: "user",
      content: "transcribe this",
      attachments: [
        {
          name: "clip.mp3",
          mime: "audio/mpeg",
          contentString: "data:audio/mpeg;base64,BBBB",
        },
        {
          name: "image.png",
          mime: "image/png",
          contentString: "data:image/png;base64,AAAA",
        },
      ],
    });
    expect(formatted).toEqual({
      role: "user",
      content: [
        { type: "text", text: "transcribe this" },
        { type: "input_audio", input_audio: { data: "BBBB", format: "mp3" } },
        {
          type: "image_url",
          image_url: { url: "data:image/png;base64,AAAA" },
        },
      ],
    });
    expect(formatted).not.toHaveProperty("attachments");
  });

  it("detects audio from data URI when mime is absent", () => {
    const formatted = provider.formatMessageWithAttachments({
      role: "user",
      content: "hi",
      attachments: [{ contentString: "data:audio/wav;base64,DDDD" }],
    });
    expect(formatted.content[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "DDDD", format: "wav" },
    });
  });
});

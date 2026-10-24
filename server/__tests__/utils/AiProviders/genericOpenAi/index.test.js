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

describe("GenericOpenAiLLM max_tokens payload", () => {
  function stubCreate(provider) {
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: "ok" } }],
      usage: {},
    });
    provider.openai = { chat: { completions: { create } } };
    return create;
  }

  it("omits max_tokens when the ENV is set to zero", async () => {
    process.env.GENERIC_OPEN_AI_MAX_TOKENS = "0";
    const provider = new GenericOpenAiLLM();
    const create = stubCreate(provider);
    await provider.getChatCompletion([], { temperature: 0.7 });
    expect(create.mock.calls[0][0]).not.toHaveProperty("max_tokens");
  });

  it("sends max_tokens when the ENV is a positive number", async () => {
    process.env.GENERIC_OPEN_AI_MAX_TOKENS = "512";
    const provider = new GenericOpenAiLLM();
    const create = stubCreate(provider);
    await provider.getChatCompletion([], { temperature: 0.7 });
    expect(create.mock.calls[0][0].max_tokens).toBe(512);
  });

  it("sends the value under GENERIC_OPEN_AI_MODEL_MAX_TOKEN_KEY when set", async () => {
    process.env.GENERIC_OPEN_AI_MAX_TOKENS = "512";
    process.env.GENERIC_OPEN_AI_MODEL_MAX_TOKEN_KEY = "max_completion_tokens";
    const provider = new GenericOpenAiLLM();
    const create = stubCreate(provider);
    await provider.getChatCompletion([], { temperature: 0.7 });
    expect(create.mock.calls[0][0]).not.toHaveProperty("max_tokens");
    expect(create.mock.calls[0][0].max_completion_tokens).toBe(512);
  });

  it("sends the custom key on the agent tooled path", async () => {
    process.env.GENERIC_OPEN_AI_MAX_TOKENS = "256";
    process.env.GENERIC_OPEN_AI_MODEL_MAX_TOKEN_KEY = "max_completion_tokens";
    const provider = new GenericOpenAiProvider({ model: "test-model" });
    provider.supportsNativeToolCalling = async () => true;
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: "ok" } }],
      usage: {},
    });
    provider._client = { chat: { completions: { create } } };
    await provider.complete([{ role: "user", content: "hi" }], []);
    expect(create.mock.calls[0][0]).not.toHaveProperty("max_tokens");
    expect(create.mock.calls[0][0].max_completion_tokens).toBe(256);
  });
});

describe("GenericOpenAiLLM native prompt token count", () => {
  /** @type {GenericOpenAiLLM} */
  let provider;

  beforeEach(() => {
    process.env.GENERIC_OPEN_AI_API_KEY = "test-key";
    process.env.GENERIC_OPEN_AI_CUSTOM_HEADERS = "X-Test-Header: test-value";
    provider = new GenericOpenAiLLM();
  });

  afterEach(() => jest.restoreAllMocks());

  it("posts the chat messages to llama.cpp's input_tokens endpoint", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ object: "response.input_tokens", input_tokens: 42 }),
    });
    const messages = [{ role: "user", content: "hello" }];

    await expect(provider.countPromptTokens(messages)).resolves.toBe(42);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "http://localhost:8080/v1/chat/completions/input_tokens"
    );
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(init.headers["X-Test-Header"]).toBe("test-value");
    expect(JSON.parse(init.body)).toEqual({
      model: "test-model",
      messages,
    });
  });

  it("falls back when the endpoint is unavailable", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(
      provider.countPromptTokens([{ role: "user", content: "hello" }])
    ).resolves.toBeNull();
  });

  it("falls back when the response does not contain a usable count", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ input_tokens: "not-a-number" }),
    });

    await expect(
      provider.countPromptTokens([{ role: "user", content: "hello" }])
    ).resolves.toBeNull();
  });

  it("falls back when the request fails", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));

    await expect(
      provider.countPromptTokens([{ role: "user", content: "hello" }])
    ).resolves.toBeNull();
  });

  it("does not call the endpoint for an empty prompt", async () => {
    const fetchMock = jest.spyOn(global, "fetch");

    await expect(provider.countPromptTokens([])).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

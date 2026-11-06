const { TokenManager } = require("../../../utils/helpers/tiktoken");
const {
  getPromptTokenCounter,
} = require("../../../utils/helpers/tokenCounters");
const {
  countWithLlamaCpp,
} = require("../../../utils/helpers/tokenCounters/llamaCpp");
const {
  countWithAnthropic,
} = require("../../../utils/helpers/tokenCounters/anthropic");
const {
  countWithGemini,
} = require("../../../utils/helpers/tokenCounters/gemini");

const ORIGINAL_ENV = process.env;
const messages = [
  { role: "system", content: "You are helpful." },
  { role: "user", content: "hello" },
];

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    GENERIC_OPEN_AI_API_KEY: "generic-key",
    GEMINI_API_KEY: "gemini-key",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("provider token counter registry", () => {
  it("resolves the counters for supported connectors", () => {
    expect(getPromptTokenCounter({ className: "GenericOpenAiLLM" })).toBe(
      countWithLlamaCpp
    );
    expect(getPromptTokenCounter({ className: "AnthropicLLM" })).toBe(
      countWithAnthropic
    );
    expect(getPromptTokenCounter({ className: "GeminiLLM" })).toBe(
      countWithGemini
    );
  });

  it("returns null for providers without a native tokenizer", () => {
    expect(getPromptTokenCounter({ className: "OpenAiLLM" })).toBeNull();
    expect(getPromptTokenCounter(null)).toBeNull();
  });
});

describe("TokenManager.countPromptTokens", () => {
  it("uses the connector's native token counter", async () => {
    const countTokens = jest.fn().mockResolvedValue({ input_tokens: 42 });
    const llm = {
      className: "AnthropicLLM",
      model: "claude-test",
      anthropic: { messages: { countTokens } },
    };
    const tokenManager = new TokenManager("claude-test", llm);

    await expect(tokenManager.countPromptTokens(messages)).resolves.toBe(42);
    expect(countTokens).toHaveBeenCalledWith({
      model: "claude-test",
      system: "You are helpful.",
      messages: [{ role: "user", content: "hello" }],
    });
  });

  it("returns null when no native counter is available", async () => {
    const tokenManager = new TokenManager("plain-model");
    await expect(tokenManager.countPromptTokens(messages)).resolves.toBeNull();
  });
});

describe("countWithLlamaCpp", () => {
  function llamaCppLLM() {
    return {
      className: "GenericOpenAiLLM",
      basePath: "http://localhost:8080/v1/",
      model: "local-model",
      constructor: {
        parseCustomHeaders: () => ({ "X-Custom": "value" }),
      },
    };
  }

  it("posts the prompt to llama.cpp's input_tokens endpoint", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ input_tokens: 12 }),
    });

    await expect(countWithLlamaCpp(llamaCppLLM(), messages)).resolves.toBe(12);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "http://localhost:8080/v1/chat/completions/input_tokens"
    );
    expect(init.headers.Authorization).toBe("Bearer generic-key");
    expect(init.headers["X-Custom"]).toBe("value");
    expect(JSON.parse(init.body)).toEqual({
      model: "local-model",
      messages,
    });
  });

  it("returns null when the endpoint is unavailable", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(countWithLlamaCpp(llamaCppLLM(), messages)).resolves.toBeNull();
  });

  it("returns null when the request fails", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    await expect(countWithLlamaCpp(llamaCppLLM(), messages)).resolves.toBeNull();
  });
});

describe("countWithAnthropic", () => {
  it("splits the system message from the chat messages", async () => {
    const countTokens = jest.fn().mockResolvedValue({ input_tokens: 21 });
    const llm = {
      className: "AnthropicLLM",
      model: "claude-test",
      anthropic: { messages: { countTokens } },
    };

    await expect(countWithAnthropic(llm, messages)).resolves.toBe(21);
    expect(countTokens).toHaveBeenCalledWith({
      model: "claude-test",
      system: "You are helpful.",
      messages: [{ role: "user", content: "hello" }],
    });
  });

  it("returns null when the SDK call fails", async () => {
    const llm = {
      className: "AnthropicLLM",
      model: "claude-test",
      anthropic: {
        messages: { countTokens: jest.fn().mockRejectedValue(new Error("nope")) },
      },
    };

    await expect(countWithAnthropic(llm, messages)).resolves.toBeNull();
  });
});

describe("countWithGemini", () => {
  function geminiLLM() {
    return { className: "GeminiLLM", model: "models/gemini-test" };
  }

  it("posts text parts and the system instruction", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ totalTokens: 33 }),
    });

    await expect(countWithGemini(geminiLLM(), messages)).resolves.toBe(33);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-test:countTokens"
    );
    expect(init.headers["x-goog-api-key"]).toBe("gemini-key");
    expect(JSON.parse(init.body)).toEqual({
      contents: [{ role: "user", parts: [{ text: "hello" }] }],
      systemInstruction: { parts: [{ text: "You are helpful." }] },
    });
  });

  it("returns null when the prompt contains non-text content", async () => {
    const fetchMock = jest.spyOn(global, "fetch");
    const withImage = [
      { role: "system", content: "You are helpful." },
      {
        role: "user",
        content: [{ type: "image_url", image_url: { url: "data:..." } }],
      },
    ];

    await expect(countWithGemini(geminiLLM(), withImage)).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

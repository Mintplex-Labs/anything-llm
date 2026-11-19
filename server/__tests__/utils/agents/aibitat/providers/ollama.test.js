const OllamaProvider = require("../../../../../utils/agents/aibitat/providers/ollama.js");
const { OllamaAILLM } = require("../../../../../utils/AiProviders/ollama");

const PROMPT = "search for vps hosting";

function toolTurn(name, content, args = {}) {
  return {
    role: "function",
    name,
    content,
    originalFunctionCall: { name, arguments: args },
  };
}

/**
 * Native Ollama tool calls go through client.chat. The fake client records
 * the messages array and never talks to a server.
 */
function recordingProvider() {
  const chat = jest.fn(async () => ({
    message: { content: "ok" },
    prompt_eval_count: 1,
    eval_count: 1,
  }));
  const provider = new OllamaProvider({ model: "qwen3.8:latest" });
  provider._supportsToolCalling = true;
  provider._client = { chat };
  return { provider, chat };
}

describe("Ollama native tool messages", () => {
  const originalBasePath = process.env.OLLAMA_BASE_PATH;

  beforeAll(() => {
    process.env.OLLAMA_BASE_PATH = "http://127.0.0.1:11434";
  });

  beforeEach(() => {
    jest.spyOn(OllamaAILLM.contextWindows, "ensure").mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalBasePath === undefined) delete process.env.OLLAMA_BASE_PATH;
    else process.env.OLLAMA_BASE_PATH = originalBasePath;
  });

  test("a later tool turn with no user role still sends the original prompt", async () => {
    const { provider, chat } = recordingProvider();

    await provider.complete([
      { role: "system", content: "be brief" },
      { role: "user", content: PROMPT },
      toolTurn("web-search", "search results: some vps links", {
        query: "vps",
      }),
    ]);

    await provider.complete([
      { role: "system", content: "be brief" },
      toolTurn("web-scraping", "Error: fetch failed", {
        url: "https://example.com",
      }),
    ]);

    const sent = chat.mock.calls[1][0].messages;
    expect(sent.map((message) => message.role)).toEqual([
      "system",
      "user",
      "assistant",
      "tool",
    ]);
    expect(sent[1].content).toBe(PROMPT);
    expect(sent[3].content).toBe("Error: fetch failed");
  });

  test("streaming native tool calls also keep the original prompt", async () => {
    const { provider, chat } = recordingProvider();
    chat.mockImplementation(async () =>
      (async function* () {
        yield {
          message: { content: "ok" },
          done: true,
          prompt_eval_count: 1,
          eval_count: 1,
        };
      })()
    );

    await provider.stream([
      { role: "system", content: "be brief" },
      { role: "user", content: PROMPT },
      toolTurn("web-search", "search results: some vps links", {
        query: "vps",
      }),
    ]);
    await provider.stream([
      { role: "system", content: "be brief" },
      toolTurn("web-scraping", "Error: fetch failed", {
        url: "https://example.com",
      }),
    ]);

    const sent = chat.mock.calls[1][0].messages;
    expect(sent.map((message) => message.role)).toEqual([
      "system",
      "user",
      "assistant",
      "tool",
    ]);
    expect(sent[1].content).toBe(PROMPT);
  });

  test("an oversized tool transcript keeps the user prompt and the latest tool result", async () => {
    jest.spyOn(OllamaAILLM, "promptWindowLimit").mockReturnValue(512);
    const { provider, chat } = recordingProvider();
    const oldResult = `OLD_TOOL_RESULT ${"x".repeat(8000)}`;
    const latestResult = "NEW_TOOL_RESULT";

    await provider.complete([
      { role: "system", content: "be brief" },
      { role: "user", content: PROMPT },
      toolTurn("web-search", oldResult, { query: "vps" }),
      toolTurn("web-browsing", latestResult, { url: "https://example.com" }),
    ]);

    const sent = chat.mock.calls[0][0].messages;
    const toolContents = sent
      .filter((message) => message.role === "tool")
      .map((message) => message.content);

    expect(
      sent.some(
        (message) => message.role === "user" && message.content === PROMPT
      )
    ).toBe(true);
    expect(toolContents).toContain(latestResult);
    expect(
      toolContents.some((content) => content.includes("OLD_TOOL_RESULT"))
    ).toBe(false);
  });
});

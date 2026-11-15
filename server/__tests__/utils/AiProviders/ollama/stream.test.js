const http = require("http");
const { EventEmitter } = require("events");
const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");

const ORIGINAL_ENV = process.env;

describe("Ollama stream transport cleanup", () => {
  let server;
  let upstreamClosed;
  let chunks;
  let endResponse;

  beforeEach(async () => {
    endResponse = false;
    chunks = [
      { message: { content: "依據法律規定" }, done: false },
      { done: true, prompt_eval_count: 4, eval_count: 3, eval_duration: 1e9 },
    ];
    upstreamClosed = new Promise((resolve) => {
      server = http.createServer((request, response) => {
        request.resume();
        request.on("end", () => {
          if (request.url === "/api/show") {
            response.setHeader("Content-Type", "application/json");
            response.end(
              JSON.stringify({ model_info: { "qwen2.context_length": 4096 } })
            );
            return;
          }
          response.on("close", () => resolve(true));
          response.setHeader("Content-Type", "application/x-ndjson");
          for (const chunk of chunks)
            response.write(JSON.stringify(chunk) + "\n");
          if (endResponse) response.end();
          // A terminal protocol message need not coincide with HTTP EOF.
          // Leave the body open to verify that the consumer releases it.
        });
      });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    process.env = {
      ...ORIGINAL_ENV,
      OLLAMA_BASE_PATH: `http://127.0.0.1:${server.address().port}`,
    };
  });

  afterEach(async () => {
    process.env = ORIGINAL_ENV;
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });

  async function chat() {
    const llm = new OllamaAILLM({}, "qwen-uncensored:latest");
    await llm.assertModelContextLimits();
    const messages = llm.constructPrompt({
      userPrompt: "請說明法律規定",
      contextTexts: ["# 臺灣法律\n相關法條與說明"],
    });
    const stream = await llm.streamGetChatCompletion(messages);
    const response = new EventEmitter();
    const events = [];
    response.write = (chunk) => events.push(JSON.parse(chunk.slice(6)));
    const text = await llm.handleStream(response, stream, { uuid: "chat" });
    expect(response.listenerCount("close")).toBe(0);
    return { text, events, stream };
  }

  async function expectTransportClosed() {
    let timer;
    try {
      const closed = await Promise.race([
        upstreamClosed,
        new Promise((resolve) => {
          timer = setTimeout(() => resolve(false), 1000);
        }),
      ]);
      expect(closed).toBe(true);
    } finally {
      clearTimeout(timer);
    }
  }

  it("closes the upstream request after the final Ollama chunk", async () => {
    const { text, events, stream } = await chat();
    expect(text).toBe("依據法律規定");
    expect(events.at(-1)).toMatchObject({ close: true, error: false });
    expect(stream.metrics.completion_tokens).toBe(3);
    await expectTransportClosed();
  });

  it("closes the upstream request after an Ollama streaming error", async () => {
    chunks[1] = { error: "model runner stopped" };
    const { text, events } = await chat();
    expect(text).toBe("依據法律規定");
    expect(events.at(-1)).toMatchObject({
      close: true,
      error: "Ollama:streaming - could not stream chat. model runner stopped",
    });
    await expectTransportClosed();
  });

  it("preserves the response and metrics when Ollama closes HTTP normally", async () => {
    endResponse = true;
    const { text, events, stream } = await chat();
    expect(text).toBe("依據法律規定");
    expect(events.at(-1)).toMatchObject({ close: true, error: false });
    expect(stream.metrics).toMatchObject({
      prompt_tokens: 4,
      completion_tokens: 3,
      total_tokens: 7,
      duration: 1,
    });
    await expectTransportClosed();
  });
});

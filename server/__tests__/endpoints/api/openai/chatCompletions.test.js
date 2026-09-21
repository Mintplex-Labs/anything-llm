// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));

jest.mock("../../../../models/documents", () => ({ Document: {} }));
jest.mock("../../../../models/workspace", () => ({
  Workspace: { get: jest.fn() },
}));
jest.mock("../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../../utils/helpers", () => ({
  getEmbeddingEngineSelection: jest.fn(),
}));
jest.mock("../../../../utils/middleware/validApiKey", () => ({
  validApiKey: jest.fn(),
}));
jest.mock("../../../../utils/chats/openaiCompatible", () => ({
  OpenAICompatibleChat: { chatSync: jest.fn(), streamChat: jest.fn() },
}));
jest.mock("../../../../utils/files/multer", () => ({
  handleImageGenUpload: jest.fn(),
}));
jest.mock("../../../../endpoints/utils", () => ({ getModelTag: () => "test" }));

// Modules in this import chain resolve storage paths at require time.
process.env.STORAGE_DIR = process.env.STORAGE_DIR || require("os").tmpdir();

const { Workspace } = require("../../../../models/workspace");
const {
  OpenAICompatibleChat,
} = require("../../../../utils/chats/openaiCompatible");
const {
  extractTextContent,
} = require("../../../../endpoints/api/openai/helpers");
const {
  apiOpenAICompatibleEndpoints,
} = require("../../../../endpoints/api/openai/index");

const ROUTE = "/v1/openai/chat/completions";

function captureHandler() {
  const handlers = {};
  apiOpenAICompatibleEndpoints({
    post: (path, _middleware, handler) => {
      handlers[path] = handler;
    },
    get: () => {},
  });
  return handlers[ROUTE];
}

function mockResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    flushHeaders: jest.fn(),
    end: jest.fn().mockReturnThis(),
  };
}

const systemParts = [
  { type: "text", text: "Be terse." },
  { type: "text", text: "Use bullets." },
];

describe.each([
  [false, "chatSync"],
  [true, "streamChat"],
])("POST /v1/openai/chat/completions (stream: %s)", (stream, method) => {
  let handler;

  beforeEach(() => {
    jest.clearAllMocks();
    Workspace.get.mockResolvedValue({ id: 1, slug: "demo" });
    OpenAICompatibleChat.chatSync.mockResolvedValue({});
    OpenAICompatibleChat.streamChat.mockResolvedValue(undefined);
    handler = captureHandler();
  });

  async function systemPromptHandedTo(messages) {
    await handler(
      { body: { model: "demo", messages, stream } },
      mockResponse()
    );
    expect(OpenAICompatibleChat[method]).toHaveBeenCalledTimes(1);
    return OpenAICompatibleChat[method].mock.calls[0][0].systemPrompt;
  }

  it(`hands ${method} the text of a system message sent as content parts`, async () => {
    const systemPrompt = await systemPromptHandedTo([
      { role: "system", content: systemParts },
      { role: "user", content: "hello" },
    ]);
    expect(systemPrompt).toBe(extractTextContent(systemParts));
  });

  it(`hands ${method} a string system prompt unchanged`, async () => {
    const systemPrompt = await systemPromptHandedTo([
      { role: "system", content: "You are terse." },
      { role: "user", content: "hello" },
    ]);
    expect(systemPrompt).toBe("You are terse.");
  });

  it(`hands ${method} null when the request has no system message`, async () => {
    const systemPrompt = await systemPromptHandedTo([
      { role: "user", content: "hello" },
    ]);
    expect(systemPrompt).toBeNull();
  });
});

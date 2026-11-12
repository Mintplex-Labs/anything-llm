/* eslint-env jest */
jest.mock("../../models/workspace", () => ({ Workspace: {} }));
jest.mock("../../models/documents", () => ({ Document: {} }));
jest.mock("../../models/vectors", () => ({ DocumentVectors: {} }));
jest.mock("../../models/workspaceChats", () => ({
  WorkspaceChats: { get: jest.fn() },
}));
jest.mock("../../models/user", () => ({ User: {} }));
jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../models/workspacesSuggestedMessages", () => ({
  WorkspaceSuggestedMessages: {},
}));
jest.mock("../../models/workspaceThread", () => ({ WorkspaceThread: {} }));
jest.mock("../../models/workspaceParsedFiles", () => ({
  WorkspaceParsedFiles: {},
}));
jest.mock("../../utils/http", () => ({
  reqBody: jest.fn(),
  multiUserMode: jest.fn(),
  userFromSession: jest.fn(),
  safeJsonParse: (jsonString, fallback = null) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  },
}));
jest.mock("../../utils/files", () => ({
  moveProcessedDocsToFolder: jest.fn(),
}));
jest.mock("../../utils/files/multer", () => ({ handleFileUpload: jest.fn() }));
jest.mock("../../utils/files/purgeDocument", () => ({
  purgeDocument: jest.fn(),
}));
jest.mock("../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  getLLMProvider: jest.fn(),
  stripThinkingFromText: jest.fn(),
}));
jest.mock("../../utils/helpers/reasoningEffort", () => ({
  getReasoningCapabilities: jest.fn(),
  usesModelRouter: jest.fn(),
}));
jest.mock("../../utils/helpers/chat/responses", () => ({
  convertToChatHistory: jest.fn(),
}));
jest.mock("../../utils/helpers/search", () => ({
  searchWorkspaceAndThreads: jest.fn(),
}));
jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
}));
jest.mock("../../utils/middleware/multiUserProtected", () => ({
  flexUserRoleValid: jest.fn(),
  ROLES: { all: "all", admin: "admin", manager: "manager" },
}));
jest.mock("../../utils/middleware/validWorkspace", () => ({
  validWorkspaceSlug: jest.fn(),
}));
jest.mock("../../utils/middleware/workspaceDeletionProtection", () => ({
  workspaceDeletionProtection: jest.fn(),
}));
jest.mock("../../utils/collectorApi", () => ({ CollectorApi: jest.fn() }));
jest.mock("../../endpoints/utils", () => ({ getModelTag: jest.fn() }));
jest.mock("../../utils/TextToSpeech", () => ({ getTTSProvider: jest.fn() }));
jest.mock("../../utils/TextToSpeech/audioFormat", () => ({
  getAudioFileInfo: jest.fn(),
}));
jest.mock("../../utils/TextToSpeech/messageToSpeech", () => ({
  messageToSpeech: jest.fn(),
}));

describe("GET /workspace/:slug/tts/:chatId response cache cap", () => {
  let ttsHandler;
  let ttsBuffer;
  let WorkspaceChats;
  let getTTSProvider;
  let getAudioFileInfo;
  let messageToSpeech;

  beforeEach(() => {
    jest.resetModules();
    const { workspaceEndpoints } = require("../../endpoints/workspaces");
    ({ WorkspaceChats } = require("../../models/workspaceChats"));
    const { userFromSession } = require("../../utils/http");
    ({ getTTSProvider } = require("../../utils/TextToSpeech"));
    ({ getAudioFileInfo } = require("../../utils/TextToSpeech/audioFormat"));
    ({ messageToSpeech } = require("../../utils/TextToSpeech/messageToSpeech"));

    const noop = () => {};
    workspaceEndpoints(
      new Proxy(
        {},
        {
          get: (_target, method) =>
            method === "get"
              ? (path, ...rest) => {
                  if (path === "/workspace/:slug/tts/:chatId")
                    ttsHandler = rest[rest.length - 1];
                }
              : noop,
        }
      )
    );

    userFromSession.mockResolvedValue({ id: 1 });
    WorkspaceChats.get.mockImplementation(({ id }) =>
      Promise.resolve({ id, response: JSON.stringify({ text: `text-${id}` }) })
    );
    messageToSpeech.mockImplementation((text) => text);
    ttsBuffer = jest
      .fn()
      .mockImplementation((text) =>
        Promise.resolve(Buffer.from(`audio:${text}`))
      );
    getTTSProvider.mockReturnValue({ ttsBuffer });
    getAudioFileInfo.mockReturnValue({ mime: "audio/mpeg" });
  });

  function fakeResponse() {
    return {
      locals: { workspace: { slug: "my-workspace", id: 1 } },
      writeHead: jest.fn(),
      end: jest.fn(),
      sendStatus: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  }

  async function requestTts(chatId) {
    const response = fakeResponse();
    await ttsHandler({ params: { chatId: String(chatId) } }, response);
    return response;
  }

  const lastWritten = (response) => response.end.mock.calls[0][0];

  test("evicts the oldest entry once the cache exceeds 100 entries", async () => {
    for (let i = 0; i < 100; i++) await requestTts(i);
    expect(ttsBuffer).toHaveBeenCalledTimes(100);

    await requestTts(100);
    expect(ttsBuffer).toHaveBeenCalledTimes(101);

    const resynthesized = await requestTts(0);
    expect(ttsBuffer).toHaveBeenCalledTimes(102);
    expect(resynthesized.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": "audio/mpeg",
    });
    expect(
      lastWritten(resynthesized).equals(Buffer.from("audio:text-0"))
    ).toBe(true);

    const pushedOut = await requestTts(1);
    expect(ttsBuffer).toHaveBeenCalledTimes(103);
    expect(lastWritten(pushedOut).equals(Buffer.from("audio:text-1"))).toBe(true);

    const survivor = await requestTts(3);
    expect(ttsBuffer).toHaveBeenCalledTimes(103);
    expect(lastWritten(survivor).equals(Buffer.from("audio:text-3"))).toBe(true);
  });

  test("cache hits do not re-order eviction order", async () => {
    for (let i = 0; i < 100; i++) await requestTts(i);

    for (let i = 0; i < 3; i++) await requestTts(0);
    expect(ttsBuffer).toHaveBeenCalledTimes(100);

    await requestTts(100);
    expect(ttsBuffer).toHaveBeenCalledTimes(101);

    const evicted = await requestTts(0);
    expect(ttsBuffer).toHaveBeenCalledTimes(102);

    const pushedOut = await requestTts(1);
    expect(ttsBuffer).toHaveBeenCalledTimes(103);

    const survivor = await requestTts(3);
    expect(ttsBuffer).toHaveBeenCalledTimes(103);
    expect(lastWritten(survivor).equals(Buffer.from("audio:text-3"))).toBe(true);
  });

  test("repeated replays of the same message synthesize audio only once", async () => {
    const first = await requestTts(7);
    expect(ttsBuffer).toHaveBeenCalledTimes(1);

    for (let i = 0; i < 5; i++) await requestTts(7);
    expect(ttsBuffer).toHaveBeenCalledTimes(1);
    expect(lastWritten(first).equals(Buffer.from("audio:text-7"))).toBe(true);
  });

  test("a re-synthesized entry takes the newest slot in eviction order", async () => {
    for (let i = 0; i < 100; i++) await requestTts(i);

    await requestTts(100);
    expect(ttsBuffer).toHaveBeenCalledTimes(101);

    await requestTts(0);
    expect(ttsBuffer).toHaveBeenCalledTimes(102);

    await requestTts(101);
    expect(ttsBuffer).toHaveBeenCalledTimes(103);

    const recached = await requestTts(0);
    expect(ttsBuffer).toHaveBeenCalledTimes(103);
    expect(lastWritten(recached).equals(Buffer.from("audio:text-0"))).toBe(true);

    const evicted = await requestTts(1);
    expect(ttsBuffer).toHaveBeenCalledTimes(104);
    expect(lastWritten(evicted).equals(Buffer.from("audio:text-1"))).toBe(true);
  });
});
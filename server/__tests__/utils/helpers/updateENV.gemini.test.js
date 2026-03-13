/* eslint-env jest */

jest.mock("../../../models/telemetry", () => ({
  Telemetry: {
    sendTelemetry: jest.fn(),
  },
}));
jest.mock("../../../utils/AiProviders/bedrock/utils", () => ({
  SUPPORTED_CONNECTION_METHODS: [],
}));
jest.mock("../../../utils/vectorStore/resetAllVectorStores", () => ({
  resetAllVectorStores: jest.fn(),
}));
jest.mock("../../../models/eventLogs", () => ({
  EventLogs: {
    logEvent: jest.fn(),
  },
}));

describe("updateENV Gemini multi-key settings", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: "test",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test("normalizes Gemini multi-key values and syncs the legacy single-key env", async () => {
    const { updateENV } = require("../../../utils/helpers/updateENV");

    const { error } = await updateENV({
      GeminiLLMApiKeys: "alpha\nbeta,alpha",
      GeminiEmbeddingApiKeys: "embed-a\nembed-b",
    });

    expect(error).toBe(false);
    expect(process.env.GEMINI_API_KEYS).toBe("alpha,beta");
    expect(process.env.GEMINI_API_KEY).toBe("alpha");
    expect(process.env.GEMINI_EMBEDDING_API_KEYS).toBe("embed-a,embed-b");
    expect(process.env.GEMINI_EMBEDDING_API_KEY).toBe("embed-a");
  });
});

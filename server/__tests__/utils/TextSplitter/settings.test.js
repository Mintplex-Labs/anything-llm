jest.mock("../../../utils/prisma", () => ({
  system_settings: { upsert: jest.fn() },
}));
jest.mock("../../../utils/http", () => ({
  isValidUrl: jest.fn(),
  safeJsonParse: jest.fn(),
}));
jest.mock("../../../utils/boot/MetaGenerator", () => ({ MetaGenerator: {} }));
jest.mock("../../../utils/vectorDbProviders/pgvector", () => ({
  PGVector: {},
}));
jest.mock("../../../utils/EmbeddingEngines/native", () => ({
  NativeEmbedder: {},
}));
jest.mock("../../../utils/helpers", () => ({
  getBaseLLMProviderModel: jest.fn(),
}));
jest.mock(
  "../../../utils/agents/aibitat/plugins/sql-agent/SQLConnectors/utils",
  () => ({ ConnectionStringParser: {} })
);
jest.mock("../../../utils/files", () => ({
  purgeEntireVectorCache: jest.fn(),
}));

const { SystemSettings } = require("../../../models/systemSettings");
const prisma = require("../../../utils/prisma");
const { purgeEntireVectorCache } = require("../../../utils/files");

beforeEach(() => jest.clearAllMocks());

it.each(["recursive", "sentence"])(
  "persists %s and invalidates cached embeddings",
  async (strategy) => {
    expect(SystemSettings.publicFields).toContain("text_splitter_strategy");
    expect(SystemSettings.supportedFields).toContain("text_splitter_strategy");
    const result = await SystemSettings._updateSettings({
      text_splitter_strategy: strategy,
    });
    expect(result).toEqual({ success: true, error: null });
    expect(purgeEntireVectorCache).toHaveBeenCalledTimes(1);
    expect(prisma.system_settings.upsert).toHaveBeenCalledWith({
      where: { label: "text_splitter_strategy" },
      update: { value: strategy },
      create: { label: "text_splitter_strategy", value: strategy },
    });
  }
);

it("rejects an unknown strategy without purging or storing it", async () => {
  const result = await SystemSettings._updateSettings({
    text_splitter_strategy: "unknown",
  });
  expect(result).toEqual({
    success: false,
    error: "Text splitting strategy must be recursive or sentence.",
  });
  expect(purgeEntireVectorCache).not.toHaveBeenCalled();
  expect(prisma.system_settings.upsert).not.toHaveBeenCalled();
});

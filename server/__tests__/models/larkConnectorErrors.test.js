jest.mock("../../utils/prisma", () => ({
  external_communication_connectors: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("../../utils/http", () => ({
  safeJsonParse: (value) => JSON.parse(value),
}));
const prisma = require("../../utils/prisma");
const {
  ExternalCommunicationConnector,
} = require("../../models/externalCommunicationConnector");
afterEach(() => jest.restoreAllMocks());
test.each([
  ["get", "findUnique", "lark"],
  ["upsert", "upsert", "lark"],
  ["delete", "delete", "lark"],
  ["get", "findUnique", "telegram"],
  ["upsert", "upsert", "telegram"],
  ["delete", "delete", "telegram"],
])(
  "connector %s/%s/%s errors redact database diagnostics",
  async (method, query, type) => {
    const logger = jest.spyOn(console, "error").mockImplementation(() => {});
    prisma.external_communication_connectors[query].mockRejectedValue(
      new Error("Prisma app-secret enc:ciphertext")
    );
    const result = await ExternalCommunicationConnector[method](type, {
      app_secret: "enc:ciphertext",
    });
    expect(JSON.stringify(logger.mock.calls)).not.toMatch(
      /app-secret|ciphertext/
    );
    if (method === "upsert")
      expect(result.error).toBe("Prisma app-secret enc:ciphertext");
  }
);

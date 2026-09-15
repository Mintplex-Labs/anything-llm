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
test("strict read distinguishes a missing row from a failed query while preserving legacy get", async () => {
  const logger = jest.spyOn(console, "error").mockImplementation(() => {});
  prisma.external_communication_connectors.findUnique.mockResolvedValueOnce(
    null
  );
  expect(await ExternalCommunicationConnector.getWithStatus("lark")).toEqual({
    connector: null,
    error: null,
  });
  prisma.external_communication_connectors.findUnique.mockRejectedValue(
    new Error("enc:ciphertext")
  );
  const result = await ExternalCommunicationConnector.getWithStatus("lark");
  expect(result.connector).toBeNull();
  expect(typeof result.error).toBe("string");
  expect(JSON.stringify([result, logger.mock.calls])).not.toContain(
    "ciphertext"
  );
  expect(await ExternalCommunicationConnector.get("lark")).toBeNull();
});
test("strict read returns parsed persisted user state", async () => {
  prisma.external_communication_connectors.findUnique.mockResolvedValue({
    id: 1,
    active: true,
    config: JSON.stringify({
      approved_users: [{ open_id: "ou_1", active_thread: "latest" }],
    }),
  });
  expect(await ExternalCommunicationConnector.getWithStatus("lark")).toEqual({
    error: null,
    connector: {
      id: 1,
      active: true,
      config: {
        approved_users: [{ open_id: "ou_1", active_thread: "latest" }],
      },
    },
  });
});
test("strict read treats corrupt stored JSON as an error instead of empty state", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  prisma.external_communication_connectors.findUnique.mockResolvedValue({
    id: 1,
    config: "corrupt enc:ciphertext",
  });
  const result = await ExternalCommunicationConnector.getWithStatus("lark");
  expect(result.connector).toBeNull();
  expect(result.error).toBeTruthy();
  expect(JSON.stringify(result)).not.toContain("ciphertext");
});
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

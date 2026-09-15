jest.mock("../../utils/EncryptionManager", () => ({
  EncryptionManager: jest
    .fn()
    .mockImplementation(() => ({ xPayload: "test-payload" })),
}));
jest.mock("../../utils/comKey", () => ({
  CommunicationKey: jest
    .fn()
    .mockImplementation(() => ({
      sign: mockSign,
      encrypt: () => "encrypted-test-payload",
    })),
}));
const mockSign = jest.fn(() => "signed-test-body");
const { CollectorApi } = require("../../utils/collectorApi");

let client;
beforeEach(() => {
  client = new CollectorApi();
  jest
    .spyOn(global, "fetch")
    .mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, documents: [] }),
    });
  jest.spyOn(console, "log").mockImplementation(() => {});
  mockSign.mockClear();
});
afterEach(async () => {
  await client.extensionRequestAgent.close();
  jest.restoreAllMocks();
});

test("safe parse mode is included in the signed body and forwards cancellation", async () => {
  const controller = new AbortController();
  await client.parseDocument("a.docx", {
    absolutePath: "/scoped/a.docx",
    safeLogging: true,
    signal: controller.signal,
  });
  const options = fetch.mock.calls[0][1];
  expect(JSON.parse(options.body).options).toMatchObject({
    safeLogging: true,
    absolutePath: "/scoped/a.docx",
  });
  expect(mockSign).toHaveBeenCalledWith(options.body);
  expect(options.signal).toBe(controller.signal);
});

test("safe parser client failures never log or return raw network messages", async () => {
  fetch.mockRejectedValue(new Error("private path and response body"));
  const result = await client.parseDocument("a.docx", { safeLogging: true });
  expect(result).toEqual({
    success: false,
    reason: "parse_failed",
    documents: [],
  });
  expect(JSON.stringify(console.log.mock.calls)).not.toContain("private path");
});

test("ordinary parser requests retain existing mode and failure diagnostics", async () => {
  fetch.mockRejectedValue(new Error("ordinary diagnostic"));
  expect(await client.parseDocument("a.txt")).toMatchObject({
    reason: "ordinary diagnostic",
  });
  expect(JSON.parse(fetch.mock.calls[0][1].body).options).not.toHaveProperty(
    "safeLogging"
  );
  expect(JSON.stringify(console.log.mock.calls)).toContain(
    "ordinary diagnostic"
  );
});

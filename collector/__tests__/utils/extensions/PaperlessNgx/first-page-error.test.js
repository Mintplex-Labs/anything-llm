/* eslint-env jest, node */
const PaperlessNgxLoader = require("../../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader");

const load = () =>
  new PaperlessNgxLoader({
    baseUrl: "https://example.com/paperless",
    apiToken: "dummy-token",
  }).load();

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

it("rejects a failed first request instead of reporting an empty instance", async () => {
  jest
    .spyOn(global, "fetch")
    .mockResolvedValue({ ok: false, status: 401, statusText: "Unauthorized" });
  await expect(load()).rejects.toThrow(
    "Failed to fetch documents from Paperless-ngx: 401 Unauthorized"
  );
});

it("keeps a successful empty instance empty", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ results: [], next: null }),
  });
  await expect(load()).resolves.toEqual([]);
});

it("still imports earlier pages when a later page fails", async () => {
  jest
    .spyOn(global, "fetch")
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ id: 1 }],
        next: "https://example.com/paperless/api/documents/?page=2",
      }),
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
    })
    .mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "text/plain" },
      text: async () => "first document",
    });
  await expect(load()).resolves.toEqual([
    expect.objectContaining({ pageContent: "first document" }),
  ]);
});

/* eslint-env jest, node */
const fs = require("fs");
const os = require("os");
const path = require("path");

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "drupalwiki-test-"));
process.env.STORAGE_DIR = path.join(scratch, "storage");
const mockHotdir = path.join(scratch, "hotdir");
fs.mkdirSync(mockHotdir, { recursive: true });

jest.mock("../../../../utils/constants", () => ({
  ...jest.requireActual("../../../../utils/constants"),
  WATCH_DIRECTORY: mockHotdir,
}));
jest.mock("../../../../processSingleFile", () => ({
  processSingleFile: jest.fn(async () => ({ success: true, documents: [] })),
}));
jest.mock("../../../../utils/files", () => ({
  ...jest.requireActual("../../../../utils/files"),
  writeToServerDocuments: jest.fn(),
}));

const { processSingleFile } = require("../../../../processSingleFile");
const {
  DrupalWiki,
} = require("../../../../utils/extensions/DrupalWiki/DrupalWiki");

const json = (body) => new Response(JSON.stringify(body), { status: 200 });

describe("DrupalWiki attachments", () => {
  afterAll(() => {
    jest.restoreAllMocks();
    fs.rmSync(scratch, { recursive: true, force: true });
  });

  test("hands processSingleFile the hotdir file name, not its absolute path", async () => {
    jest.spyOn(global, "fetch").mockImplementation(async (url) => {
      url = String(url);
      if (url.includes("/api/rest/scope/api/page?"))
        return json({ content: [{ id: 12 }], last: true });
      if (url.endsWith("/api/rest/scope/api/page/12"))
        return json({
          id: 12,
          title: "Onboarding",
          body: "<p>Welcome.</p>",
          lastModified: "2024-01-01",
        });
      if (url.includes("/attachment?pageId=12"))
        return json({ content: [{ id: 99, fileName: "vpn-setup.txt" }] });
      if (url.endsWith("/attachment/99/download"))
        return new Response("Connect with your SSO account.", { status: 200 });
      throw new Error(`unexpected ${url}`);
    });

    const wiki = new DrupalWiki({
      baseUrl: "https://wiki.example.com",
      accessToken: "token",
    });
    await wiki.loadAndStoreAllPagesForSpace(5, { encrypt: () => "enc" });

    // processSingleFile uses this argument as the document title.
    expect(processSingleFile).toHaveBeenCalledWith("vpn-setup.txt");
    expect(fs.existsSync(path.join(mockHotdir, "vpn-setup.txt"))).toBe(true);
  });
});

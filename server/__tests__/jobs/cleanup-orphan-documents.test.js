const fs = require("fs");
const os = require("os");
const path = require("path");

let mockDirectory;
let mockResolveConcluded;
const mockFindMany = jest.fn();
const mockLog = jest.fn();
const mockConclude = jest.fn(() => mockResolveConcluded());

jest.mock("../../utils/prisma", () => ({
  workspace_parsed_files: { findMany: mockFindMany },
}));
jest.mock("../../jobs/helpers", () => ({
  log: mockLog,
  conclude: mockConclude,
}));
jest.mock("../../utils/files", () => ({
  get directUploadsPath() {
    return mockDirectory;
  },
}));
jest.mock("../../utils/http", () => ({
  safeJsonParse: (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },
}));
// Keep the real parsed-file model for the pre-fix query path, but isolate its
// unrelated dependencies so this test never opens a database or sends events.
jest.mock("../../models/eventLogs", () => ({}));
jest.mock("../../models/documents", () => ({}));

async function runCleanup() {
  const concluded = new Promise((resolve) => {
    mockResolveConcluded = resolve;
  });
  jest.isolateModules(() => require("../../jobs/cleanup-orphan-documents"));
  await concluded;
  expect(mockConclude).toHaveBeenCalledTimes(1);
}

function writeFile(filename) {
  fs.writeFileSync(
    path.join(mockDirectory, filename),
    JSON.stringify({ pageContent: filename })
  );
}

describe("orphan document cleanup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindMany.mockReset();
    mockDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "orphan-cleanup-"));
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fs.rmSync(mockDirectory, { recursive: true, force: true });
  });

  it("preserves all files and reports the error when the reference query fails", async () => {
    writeFile("attached.json");
    writeFile("orphan.json");
    mockFindMany.mockRejectedValue(new Error("database is locked"));

    await runCleanup();

    expect(fs.readdirSync(mockDirectory).sort()).toEqual([
      "attached.json",
      "orphan.json",
    ]);
    expect(mockLog).toHaveBeenCalledWith("errored with database is locked");
  });

  it("preserves referenced collector filenames and removes only orphaned files", async () => {
    writeFile("mailbox-msg-2.json");
    writeFile("legacy-file.json");
    writeFile("orphan.json");
    mockFindMany.mockResolvedValue([
      {
        filename: "mailbox.json",
        metadata: JSON.stringify({
          location: "direct-uploads/mailbox-msg-2.json",
        }),
      },
      { filename: "legacy file.json", metadata: null },
    ]);

    await runCleanup();

    expect(fs.readdirSync(mockDirectory).sort()).toEqual([
      "legacy-file.json",
      "mailbox-msg-2.json",
    ]);
  });

  it("removes orphaned files when the reference query successfully returns no records", async () => {
    writeFile("orphan.json");
    mockFindMany.mockResolvedValue([]);

    await runCleanup();

    expect(fs.readdirSync(mockDirectory)).toEqual([]);
  });
});

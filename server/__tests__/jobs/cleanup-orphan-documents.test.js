/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

let mockDirectUploadsPath;
let mockResolveConcluded;
const mockWhere = jest.fn();

jest.mock("../../models/workspaceParsedFiles", () => ({
  WorkspaceParsedFiles: { where: mockWhere },
}));
jest.mock("../../utils/files", () => ({
  get directUploadsPath() {
    return mockDirectUploadsPath;
  },
}));
jest.mock("../../jobs/helpers", () => ({
  log: jest.fn(),
  conclude: jest.fn(() => mockResolveConcluded()),
}));

describe("direct upload orphan cleanup", () => {
  let storagePath;

  beforeEach(() => {
    jest.resetModules();
    mockWhere.mockReset();
    storagePath = fs.mkdtempSync(
      path.join(os.tmpdir(), "anythingllm-cleanup-")
    );
    mockDirectUploadsPath = path.join(storagePath, "direct-uploads");
    fs.mkdirSync(mockDirectUploadsPath);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fs.rmSync(storagePath, { recursive: true, force: true });
  });

  function writeFile(filename) {
    fs.writeFileSync(path.join(mockDirectUploadsPath, filename), "{}");
  }

  async function cleanup(records) {
    mockWhere.mockResolvedValue(records);
    const concluded = new Promise(
      (resolve) => (mockResolveConcluded = resolve)
    );
    require("../../jobs/cleanup-orphan-documents");
    await concluded;
    return fs.readdirSync(mockDirectUploadsPath).sort();
  }

  it("retains every referenced MBOX message and deletes the actual orphan", async () => {
    const records = [2, 3].map((message) => {
      const filename = `mailbox.mbox-id-${message}.json`;
      const actualFilename = `mailbox.mbox-id-${message}-msg-${message}.json`;
      writeFile(actualFilename);
      return {
        filename,
        metadata: JSON.stringify({
          location: `direct-uploads/${actualFilename}`,
        }),
      };
    });
    writeFile("orphan.json");

    expect(await cleanup(records)).toEqual([
      "mailbox.mbox-id-2-msg-2.json",
      "mailbox.mbox-id-3-msg-3.json",
    ]);
  });

  it("uses the exact metadata filename, including spaces, instead of guessing", async () => {
    writeFile("actual file.json");
    writeFile("guessed-file.json");

    expect(
      await cleanup([
        {
          filename: "guessed file.json",
          metadata: JSON.stringify({
            location: "direct-uploads/actual file.json",
          }),
        },
      ])
    ).toEqual(["actual file.json"]);
  });

  it("retains ordinary attachments alongside collector-specific filenames", async () => {
    writeFile("notes.txt-id.json");

    expect(
      await cleanup([
        {
          filename: "notes.txt-id.json",
          metadata: JSON.stringify({
            location: "direct-uploads/notes.txt-id.json",
          }),
        },
      ])
    ).toEqual(["notes.txt-id.json"]);
  });

  it.each([
    null,
    "invalid JSON",
    "null",
    "{}",
    '{"location":null}',
    '{"location":42}',
    '{"location":""}',
  ])(
    "falls back to the legacy slugified filename for metadata %p",
    async (metadata) => {
      writeFile("legacy-file.json");
      writeFile("orphan.json");

      expect(
        await cleanup([{ filename: "legacy file.json", metadata }])
      ).toEqual(["legacy-file.json"]);
    }
  );

  it("matches only basenames inside direct uploads, even for a traversing location", async () => {
    const outsideFile = path.join(storagePath, "outside.json");
    fs.writeFileSync(outsideFile, "outside content");
    writeFile("outside.json");
    writeFile("orphan.json");

    expect(
      await cleanup([
        { filename: "unused.json", metadata: '{"location":"../outside.json"}' },
      ])
    ).toEqual(["outside.json"]);
    expect(fs.readFileSync(outsideFile, "utf8")).toBe("outside content");
  });

  it("does not delete any files when the records query rejects", async () => {
    writeFile("attached.json");
    writeFile("orphan.json");
    const error = new Error("Database unavailable");
    mockWhere.mockRejectedValue(error);
    const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
    const concluded = new Promise(
      (resolve) => (mockResolveConcluded = resolve)
    );

    require("../../jobs/cleanup-orphan-documents");
    await concluded;

    expect(fs.readdirSync(mockDirectUploadsPath).sort()).toEqual([
      "attached.json",
      "orphan.json",
    ]);
    expect(errorLog).toHaveBeenCalledWith(error);
  });
});

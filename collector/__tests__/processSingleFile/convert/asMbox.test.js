/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";
const fs = require("fs");
const path = require("path");

jest.mock("../../../utils/files", () => ({
  ...jest.requireActual("../../../utils/files"),
  writeToServerDocuments: jest.fn(({ data }) => data),
}));

const asMbox = require("../../../processSingleFile/convert/asMbox");

describe("asMbox", () => {
  const mboxPath = path.resolve(
    __dirname,
    "../../../storage/tmp/chunk-boundary.mbox"
  );

  beforeEach(() => jest.spyOn(console, "log").mockImplementation(() => {}));
  afterEach(() => {
    fs.rmSync(mboxPath, { force: true });
    jest.restoreAllMocks();
  });

  test("keeps a character that is split across two read chunks", async () => {
    const header = [
      "From sender@example.com Mon Jan  1 00:00:00 2024",
      "Subject: Menu",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      "",
    ].join("\n");
    // The two bytes of "é" land on either side of the 64 KiB chunk boundary.
    const pad = "a".repeat(64 * 1024 - 1 - Buffer.byteLength(header) - 3);
    fs.writeFileSync(mboxPath, `${header}${pad}café au lait\n`);

    const { documents } = await asMbox({
      fullFilePath: mboxPath,
      filename: "chunk-boundary.mbox",
      options: { absolutePath: true },
    });
    expect(documents[0].pageContent.trim().slice(-12)).toBe("café au lait");
  });
});

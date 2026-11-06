/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("../../../utils/files", () => ({
  ...jest.requireActual("../../../utils/files"),
  writeToServerDocuments: jest.fn(({ data }) => data),
}));

const asMbox = require("../../../processSingleFile/convert/asMbox");

function message(subject) {
  const encoded = Buffer.from(subject).toString("base64");
  return [
    "From alice@example.com Mon Jan  1 00:00:00 2024",
    "From: Alice <alice@example.com>",
    `Subject: =?UTF-8?B?${encoded}?=`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    `Body of ${subject}.`,
    "",
  ].join("\n");
}

describe("asMbox", () => {
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "mbox-"));
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("titles a message by its position when its subject slugifies to nothing", async () => {
    const fullFilePath = path.join(dir, "inbox.mbox");
    fs.writeFileSync(
      fullFilePath,
      [
        message("Weekly update"),
        message("会议纪要"),
        message("日本語の件名"),
      ].join("\n")
    );

    const { documents } = await asMbox({
      fullFilePath,
      filename: "inbox.mbox",
      options: { absolutePath: true, parseOnly: true },
    });

    expect(documents.map((doc) => doc.title)).toEqual([
      "Weekly-update.mbox",
      "msg_2-inbox.mbox",
      "msg_3-inbox.mbox",
    ]);
  });
});

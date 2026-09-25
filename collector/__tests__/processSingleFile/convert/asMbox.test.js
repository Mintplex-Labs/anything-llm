/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

jest.mock("../../../utils/files", () => ({
  createdDate: jest.fn(() => "2026-09-25"),
  trashFile: jest.fn(),
  writeToServerDocuments: jest.fn(({ data }) => ({
    ...data,
    location: "custom-documents/mail.json",
  })),
}));
jest.mock("../../../utils/tokenizer", () => ({
  tokenizeString: jest.fn(() => 1),
}));

const fs = require("fs");
const os = require("os");
const path = require("path");
const asMbox = require("../../../processSingleFile/convert/asMbox");

function message(fromLine, headers, body) {
  return [fromLine, ...headers, "", ...body, ""].join("\n");
}

// A notification or invoice sent as HTML only, with a file attached: the
// message is multipart/mixed with no text/plain part anywhere.
const HTML_WITH_ATTACHMENT = message(
  "From billing@example.com Thu Sep 24 10:00:00 2026",
  [
    "From: billing@example.com",
    "Subject: Your invoice",
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="mixed"',
  ],
  [
    "--mixed",
    "Content-Type: text/html; charset=utf-8",
    "",
    "<html><body><p>Invoice 1042 is due on 1 October.</p></body></html>",
    "--mixed",
    "Content-Type: application/pdf; name=invoice.pdf",
    "Content-Disposition: attachment; filename=invoice.pdf",
    "Content-Transfer-Encoding: base64",
    "",
    "JVBERi0xLjQ=",
    "--mixed--",
  ]
);

const PLAIN_AND_HTML = message(
  "From team@example.com Thu Sep 24 11:00:00 2026",
  [
    "From: team@example.com",
    "Subject: Quarterly numbers",
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="alt"',
  ],
  [
    "--alt",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "The plain rendering of the numbers.",
    "--alt",
    "Content-Type: text/html; charset=utf-8",
    "",
    "<html><body><p>The HTML rendering of the numbers.</p></body></html>",
    "--alt--",
  ]
);

// Some mailers send an empty plain alternative next to the real HTML one.
const BLANK_PLAIN_AND_HTML = message(
  "From news@example.com Thu Sep 24 13:00:00 2026",
  [
    "From: news@example.com",
    "Subject: Newsletter",
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="news"',
  ],
  [
    "--news",
    "Content-Type: text/plain; charset=utf-8",
    "",
    " ",
    "--news",
    "Content-Type: text/html; charset=utf-8",
    "",
    "<html><body><p>Only the HTML says it.</p></body></html>",
    "--news--",
  ]
);

const ATTACHMENT_ONLY = message(
  "From scanner@example.com Thu Sep 24 12:00:00 2026",
  [
    "From: scanner@example.com",
    "Subject: Scan",
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="scan"',
  ],
  [
    "--scan",
    "Content-Type: application/pdf; name=scan.pdf",
    "Content-Disposition: attachment; filename=scan.pdf",
    "Content-Transfer-Encoding: base64",
    "",
    "JVBERi0xLjQ=",
    "--scan--",
  ]
);

let directory;

async function convert(...messages) {
  const fullFilePath = path.join(directory, "mail.mbox");
  fs.writeFileSync(fullFilePath, messages.join("\n"));
  const { documents } = await asMbox({ fullFilePath, filename: "mail.mbox" });
  return documents.map((document) => document.pageContent);
}

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "as-mbox-"));
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  fs.rmSync(directory, { recursive: true, force: true });
  jest.restoreAllMocks();
});

describe("asMbox", () => {
  test("converts an HTML-only message that carries an attachment", async () => {
    const contents = await convert(HTML_WITH_ATTACHMENT);

    expect(contents).toHaveLength(1);
    expect(contents[0]).toContain("Invoice 1042 is due on 1 October.");
    expect(contents[0]).not.toContain("<p>");
  });

  test("still reads a message with a plain part from that part", async () => {
    const contents = await convert(PLAIN_AND_HTML);

    expect(contents).toEqual(["The plain rendering of the numbers."]);
  });

  test("reads a message whose plain part is blank from its HTML", async () => {
    const contents = await convert(BLANK_PLAIN_AND_HTML);

    expect(contents).toHaveLength(1);
    expect(contents[0]).toContain("Only the HTML says it.");
  });

  test("still skips a message with no text at all", async () => {
    const contents = await convert(
      PLAIN_AND_HTML,
      ATTACHMENT_ONLY,
      HTML_WITH_ATTACHMENT
    );

    expect(contents).toHaveLength(2);
  });
});

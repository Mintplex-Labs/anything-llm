/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

jest.mock("../../../utils/files", () => ({
  createdDate: jest.fn(() => "2026-09-25"),
  trashFile: jest.fn(),
  writeToServerDocuments: jest.fn(({ data }) => ({
    ...data,
    location: "custom-documents/text.json",
  })),
}));
jest.mock("../../../utils/tokenizer", () => ({
  tokenizeString: jest.fn(() => 1),
}));

const fs = require("fs");
const os = require("os");
const path = require("path");
const asTxt = require("../../../processSingleFile/convert/asTxt");

const GREETING = "Sehr geehrte Frau Müller,\nviele Grüße aus Köln – 5 €.\n";

// Windows-1252 bytes, as Notepad and Excel write them in Western Europe.
function windows1252(text) {
  const table = { "–": 0x96, "€": 0x80 };
  return Buffer.from(
    Array.from(text, (char) => table[char] ?? char.charCodeAt(0))
  );
}

let dir;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "astxt-"));
});
afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

async function pageContent(filename, bytes) {
  const fullFilePath = path.join(dir, filename);
  fs.writeFileSync(fullFilePath, bytes);
  const result = await asTxt({
    fullFilePath,
    filename,
    options: { absolutePath: true },
  });
  expect(result.success).toBe(true);
  return result.documents[0].pageContent;
}

describe("asTxt reads a file in the encoding it was written in", () => {
  test("a Windows-1252 text file keeps its accented letters", async () => {
    expect(await pageContent("letter.txt", windows1252(GREETING))).toBe(
      GREETING
    );
  });

  test("a Windows-1252 CSV export keeps its accented letters", async () => {
    const csv = "Name;Stadt\nMüller;Köln\nGroß;Düsseldorf\n";
    expect(await pageContent("people.csv", windows1252(csv))).toBe(csv);
  });

  test("UTF-8 is read as before, and its byte-order mark dropped", async () => {
    expect(await pageContent("plain.md", Buffer.from(GREETING))).toBe(GREETING);
    const withBom = Buffer.concat([
      Buffer.from([0xef, 0xbb, 0xbf]),
      Buffer.from(GREETING),
    ]);
    expect(await pageContent("bom.md", withBom)).toBe(GREETING);
  });

  test("a damaged byte in UTF-8 costs only that byte", async () => {
    const damaged = Buffer.concat([Buffer.from(GREETING), Buffer.from([0xff])]);
    expect(await pageContent("damaged.txt", damaged)).toBe(GREETING + "�");
  });

  test("UTF-16 is read by its byte-order mark", async () => {
    const utf16le = Buffer.concat([
      Buffer.from([0xff, 0xfe]),
      Buffer.from(GREETING, "utf16le"),
    ]);
    expect(await pageContent("wide.txt", utf16le)).toBe(GREETING);
  });

  test("an HTML page is read in the charset it declares", async () => {
    const page =
      '<html><head><meta charset="iso-8859-2"></head><body>Łódź</body></html>';
    const bytes = Buffer.from(
      Array.from(
        page,
        (char) => ({ Ł: 0xa3, ó: 0xf3, ź: 0xbc }[char] ?? char.charCodeAt(0))
      )
    );
    expect(await pageContent("page.html", bytes)).toBe(page);
  });

  test("a page declaring Latin-1 is read as Windows-1252, as browsers do", async () => {
    const page =
      '<html><head><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"></head><body>5 € – Grüße</body></html>';
    expect(await pageContent("page.html", windows1252(page))).toBe(page);
  });

  test("a page declaring Shift_JIS is read as Shift_JIS", async () => {
    const bytes = Buffer.concat([
      Buffer.from('<html><head><meta charset="shift_jis"></head><body>'),
      Buffer.from([0x93, 0xfa, 0x96, 0x7b, 0x8c, 0xea]), // 日本語
      Buffer.from("</body></html>"),
    ]);
    expect(await pageContent("page.html", bytes)).toBe(
      '<html><head><meta charset="shift_jis"></head><body>日本語</body></html>'
    );
  });

  test("a declared charset browsers do not know is ignored", async () => {
    const page =
      '<html><head><meta charset="no-such-charset"></head><body>Grüße</body></html>';
    expect(await pageContent("page.html", windows1252(page))).toBe(page);
  });

  test("a page declaring UTF-16 without being UTF-16 is not read as UTF-16", async () => {
    const page =
      '<html><head><meta charset="utf-16"></head><body>Grüße</body></html>';
    expect(await pageContent("page.html", windows1252(page))).toBe(page);
  });

  test("valid UTF-8 wins over a page's stale charset declaration", async () => {
    const page =
      '<html><head><meta charset="iso-8859-1"></head><body>Grüße</body></html>';
    expect(await pageContent("page.html", Buffer.from(page))).toBe(page);
  });
});

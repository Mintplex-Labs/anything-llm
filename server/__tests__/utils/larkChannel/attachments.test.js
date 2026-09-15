const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const AdmZip = require("adm-zip");
const {
  normalizeLarkAttachments,
} = require("../../../utils/larkChannel/attachments");

let root, directories, temporaryFiles;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "lark-test-"));
  directories = [];
  temporaryFiles = {
    ...fs,
    mkdtempSync(prefix) {
      const directory = fs.mkdtempSync(prefix);
      directories.push(directory);
      return directory;
    },
  };
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

function options(buffer, fileName, extra = {}) {
  return {
    channel: { downloadResource: jest.fn().mockResolvedValue(buffer) },
    resources: [{ type: "file", fileKey: "file_1", fileName }],
    sizeLimit: 4096,
    tempRoot: root,
    temporaryFiles,
    ...extra,
  };
}

test.each([
  ["photo.jpg", Buffer.from([255, 216, 255, 224]), "image/jpeg"],
  ["photo.png", Buffer.from("89504e470d0a1a0a00000000", "hex"), "image/png"],
  ["paper.pdf", Buffer.from("%PDF-1.7\nhello"), "application/pdf"],
  ["notes.txt", Buffer.from("notes"), "text/plain"],
  ["notes.md", Buffer.from("notes"), "text/markdown"],
])("normalizes %s and removes its scoped files", async (name, buffer, mime) => {
  const input = options(buffer, name);
  const result = await normalizeLarkAttachments(input);
  expect(result.attachments).toEqual([
    { name, mime, contentString: buffer.toString("base64") },
  ]);
  expect(input.channel.downloadResource).toHaveBeenCalledWith("file_1", "file");
  expect(directories).toHaveLength(1);
  expect(fs.existsSync(directories[0])).toBe(false);
});

test("validates DOCX container contents before parsing and cleans the scoped directory", async () => {
  const zip = new AdmZip();
  zip.addFile("[Content_Types].xml", Buffer.from("<Types/>"));
  zip.addFile("word/document.xml", Buffer.from("<document/>"));
  const parseDocument = jest.fn(async (name, { absolutePath }) => {
    expect(name).toBe("report.docx");
    expect(fs.readFileSync(absolutePath)).toEqual(zip.toBuffer());
    return { success: true, documents: [{ pageContent: "Document text" }] };
  });
  const result = await normalizeLarkAttachments(
    options(zip.toBuffer(), "report.docx", { parseDocument })
  );
  expect(result.attachments[0].mime).toBe(
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  expect(result.documentText).toContain("Document text");
  expect(fs.existsSync(directories[0])).toBe(false);
});

test.each(["audio", "video", "sticker"])(
  "rejects declared %s before downloading",
  async (type) => {
    const input = options(Buffer.from("x"), "file.txt", {
      resources: [{ type, fileKey: "file_1" }],
    });
    await expect(normalizeLarkAttachments(input)).rejects.toThrow(
      /supported|Support/i
    );
    expect(input.channel.downloadResource).not.toHaveBeenCalled();
  }
);

test("recognizes unsupported legacy DOC with conversion guidance before downloading", async () => {
  const input = options(Buffer.from("d0cf11e0a1b11ae1", "hex"), "legacy.doc");
  await expect(normalizeLarkAttachments(input)).rejects.toThrow(/DOCX or PDF/);
  expect(input.channel.downloadResource).not.toHaveBeenCalled();
});

test.each([
  ["notes.txt", Buffer.from([0, 255, 1, 2])],
  ["photo.png", Buffer.from("%PDF-1.7")],
  ["notes.txt", Buffer.from("%PDF-1.7")],
  ["paper.pdf", Buffer.from("not a pdf")],
  ["file.exe", Buffer.from("MZ executable")],
  [
    "file.docx",
    (() => {
      const zip = new AdmZip();
      zip.addFile("wrong.txt", Buffer.from("x"));
      return zip.toBuffer();
    })(),
  ],
])("rejects mismatched or unsupported bytes for %s", async (name, buffer) => {
  const parseDocument = jest.fn();
  await expect(
    normalizeLarkAttachments(options(buffer, name, { parseDocument }))
  ).rejects.toThrow();
  expect(parseDocument).not.toHaveBeenCalled();
  expect(directories.every((directory) => !fs.existsSync(directory))).toBe(
    true
  );
});

test("rejects oversize before any ingestion and removes scope", async () => {
  const parseDocument = jest.fn();
  await expect(
    normalizeLarkAttachments(
      options(Buffer.from("too long"), "a.txt", { sizeLimit: 2, parseDocument })
    )
  ).rejects.toThrow(/limit/);
  expect(parseDocument).not.toHaveBeenCalled();
  expect(directories.every((directory) => !fs.existsSync(directory))).toBe(
    true
  );
});

test("null inherits generic server multer's unlimited upload size", async () => {
  const buffer = Buffer.alloc(1024 * 1024, "a");
  const result = await normalizeLarkAttachments(
    options(buffer, "large.txt", { sizeLimit: null })
  );
  expect(
    Buffer.from(result.attachments[0].contentString, "base64").length
  ).toBe(buffer.length);
});

test("sanitizes path and control characters without exposing local paths", async () => {
  const result = await normalizeLarkAttachments(
    options(Buffer.from("notes"), "../../private\\evil\nnotes.md")
  );
  expect(result.attachments[0].name).toBe("evil_notes.md");
  expect(JSON.stringify(result)).not.toContain(root);
});

test("rejects URLs and traversal as file keys without downloading", async () => {
  for (const fileKey of [
    "https://evil.test/x",
    "../../secret",
    "/etc/passwd",
  ]) {
    const input = options(Buffer.from("x"), "a.txt", {
      resources: [{ type: "file", fileKey, fileName: "a.txt" }],
    });
    await expect(normalizeLarkAttachments(input)).rejects.toThrow();
    expect(input.channel.downloadResource).not.toHaveBeenCalled();
  }
});

test("cleans temporary files and sanitizes collector errors", async () => {
  const parseDocument = jest
    .fn()
    .mockRejectedValue(new Error("/secret/path body"));
  await expect(
    normalizeLarkAttachments(
      options(Buffer.from("notes"), "a.txt", { parseDocument })
    )
  ).rejects.toThrow("Could not process attachment.");
  expect(fs.existsSync(directories[0])).toBe(false);
});

test("cancellation during download removes scope and prevents ingestion", async () => {
  const controller = new AbortController();
  const input = options(Buffer.from("x"), "a.txt", {
    signal: controller.signal,
    parseDocument: jest.fn(),
  });
  input.channel.downloadResource.mockImplementation(async () => {
    controller.abort();
    return Buffer.from("x");
  });
  await expect(normalizeLarkAttachments(input)).rejects.toMatchObject({
    name: "AbortError",
  });
  expect(input.parseDocument).not.toHaveBeenCalled();
  expect(directories.every((directory) => !fs.existsSync(directory))).toBe(
    true
  );
});

test("process exit cleans any live scope", async () => {
  const input = options(Buffer.from("notes"), "a.txt", {
    parseDocument: async () => {
      process.emit("exit", 0);
      expect(fs.existsSync(directories[0])).toBe(false);
      return { success: true, documents: [{ pageContent: "notes" }] };
    },
  });
  await normalizeLarkAttachments(input);
});

test("abort cleans scope even when the SDK download never settles", async () => {
  const controller = new AbortController();
  const input = options(Buffer.from("x"), "a.txt", {
    signal: controller.signal,
  });
  input.channel.downloadResource.mockImplementation(
    () => new Promise(() => {})
  );
  const pending = normalizeLarkAttachments(input);
  controller.abort();
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  expect(fs.existsSync(directories[0])).toBe(false);
});

test("cancellation observes a simultaneous SDK rejection without unhandled errors", async () => {
  const controller = new AbortController();
  const input = options(Buffer.from("x"), "a.txt", {
    signal: controller.signal,
  });
  input.channel.downloadResource.mockImplementation(() => {
    controller.abort();
    return Promise.reject(new Error("private SDK response"));
  });
  await expect(normalizeLarkAttachments(input)).rejects.toMatchObject({
    name: "AbortError",
  });
  await new Promise((resolve) => setImmediate(resolve));
});

test("central shutdown cleanup removes live scopes idempotently", async () => {
  const {
    cleanupActiveAttachmentScopes,
  } = require("../../../utils/larkChannel/attachments");
  const input = options(Buffer.from("notes"), "a.txt", {
    parseDocument: async () => {
      cleanupActiveAttachmentScopes();
      cleanupActiveAttachmentScopes();
      expect(fs.existsSync(directories[0])).toBe(false);
      return { success: true, documents: [{ pageContent: "notes" }] };
    },
  });
  await normalizeLarkAttachments(input);
});

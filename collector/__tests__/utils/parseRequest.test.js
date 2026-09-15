const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { EventEmitter } = require("node:events");
const { Worker } = require("node:worker_threads");
const AdmZip = require("adm-zip");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "lark-parse-test-"));
process.env.STORAGE_DIR = root;
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "pkcs1", format: "pem" },
  privateKeyEncoding: { type: "pkcs1", format: "pem" },
});
fs.mkdirSync(path.join(root, "comkey"));
fs.writeFileSync(path.join(root, "comkey", "ipc-pub.pem"), publicKey);

const { verifyPayloadIntegrity } = require("../../middleware/verifyIntegrity");
const { handleParseRequest } = require("../../utils/parseRequest");
const { runIsolatedParse } = require("../../utils/parseRequest/isolated");

let output, errorOutput;
beforeEach(() => {
  output = [];
  errorOutput = [];
  jest.spyOn(console, "log").mockImplementation((...args) => output.push(args));
  jest
    .spyOn(console, "error")
    .mockImplementation((...args) => errorOutput.push(args));
  jest
    .spyOn(console, "warn")
    .mockImplementation((...args) => errorOutput.push(args));
});
afterEach(() => jest.restoreAllMocks());
afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

function request(filename, safeLogging, signed = true) {
  const body = JSON.stringify({
    filename,
    options: { absolutePath: path.join(root, filename), safeLogging },
  });
  const signature = signed
    ? crypto.sign("RSA-SHA256", Buffer.from(body), privateKey).toString("hex")
    : "invalid";
  return Object.assign(new EventEmitter(), {
    body,
    header: (name) => (name === "X-Integrity" ? signature : undefined),
  });
}
async function dispatch(req) {
  const res = Object.assign(new EventEmitter(), {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  });
  let parsed;
  verifyPayloadIntegrity(req, res, () => {
    parsed = handleParseRequest(req, res);
  });
  await parsed;
  return res;
}
function malformedDocx() {
  const zip = new AdmZip();
  zip.addFile("[Content_Types].xml", Buffer.from("<Types/>"));
  zip.addFile("word/document.xml", Buffer.from("<private-content-unclosed"));
  fs.writeFileSync(path.join(root, "private-name.docx"), zip.toBuffer());
}

test("authenticated malformed DOCX uses real isolated parser and emits only fixed failure text", async () => {
  malformedDocx();
  const terminate = jest.spyOn(Worker.prototype, "terminate");
  const writes = [];
  const stdout = jest
    .spyOn(process.stdout, "write")
    .mockImplementation((chunk) => {
      writes.push(String(chunk));
      return true;
    });
  const stderr = jest
    .spyOn(process.stderr, "write")
    .mockImplementation((chunk) => {
      writes.push(String(chunk));
      return true;
    });
  let res;
  try {
    res = await dispatch(request("private-name.docx", true));
  } finally {
    stdout.mockRestore();
    stderr.mockRestore();
  }
  expect(res.statusCode).toBe(200);
  expect(res.body).toMatchObject({
    success: false,
    reason: "parse_failed",
    documents: [],
  });
  expect(errorOutput).toEqual([["[CollectorParse]", "parse_failed"]]);
  expect(JSON.stringify([...output, ...errorOutput, ...writes])).not.toMatch(
    /private-name|private-content|Error:|\.js:\d|lark-parse-test-/
  );
  expect(terminate).toHaveBeenCalledTimes(1);
  expect(terminate.mock.instances[0].threadId).toBe(-1);
});

test("ordinary parsing keeps its diagnostics while a safe parse is running", async () => {
  malformedDocx();
  fs.writeFileSync(path.join(root, "ordinary.txt"), "ordinary document text");
  const safe = dispatch(request("private-name.docx", true));
  const ordinary = await dispatch(request("ordinary.txt", false));
  const isolated = await safe;
  expect(ordinary.body).toMatchObject({ success: true });
  expect(ordinary.body.documents[0].pageContent).toBe("ordinary document text");
  expect(isolated.body).toMatchObject({
    success: false,
    reason: "parse_failed",
  });
  expect(JSON.stringify(output)).toContain("ordinary.txt");
  expect(JSON.stringify([...output, ...errorOutput])).not.toContain(
    "private-name"
  );
});

test("safe parse success returns content and terminates its worker", async () => {
  fs.writeFileSync(path.join(root, "safe.txt"), "safe document text");
  const terminate = jest.spyOn(Worker.prototype, "terminate");
  const res = await dispatch(request("safe.txt", true));
  expect(res.body.documents[0].pageContent).toBe("safe document text");
  expect(output).toEqual([]);
  expect(errorOutput).toEqual([]);
  expect(terminate.mock.instances[0].threadId).toBe(-1);
});

test("safe parse rejects forged signatures even in development", async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";
  try {
    const res = await dispatch(request("private-name.docx", true, false));
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ msg: "Failed integrity signature check." });
  } finally {
    process.env.NODE_ENV = previous;
  }
});

test("safe mode is unavailable without verified integrity", async () => {
  const req = request("private-name.docx", true);
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  await handleParseRequest(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    msg: "Failed integrity signature check.",
  });
});

test("abort terminates an isolated parser and returns a fixed failure", async () => {
  const controller = new AbortController();
  const terminate = jest.spyOn(Worker.prototype, "terminate");
  const pending = runIsolatedParse(
    "safe.txt",
    { absolutePath: path.join(root, "safe.txt") },
    { signal: controller.signal }
  );
  controller.abort();
  expect(await pending).toEqual({
    success: false,
    reason: "parse_cancelled",
    documents: [],
  });
  expect(terminate.mock.instances[0].threadId).toBe(-1);
});

test("aborted authenticated request terminates its worker and releases request listeners", async () => {
  fs.writeFileSync(path.join(root, "safe.txt"), "safe document text");
  const req = request("safe.txt", true);
  const res = Object.assign(new EventEmitter(), {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });
  const terminate = jest.spyOn(Worker.prototype, "terminate");
  let parsing;
  verifyPayloadIntegrity(req, res, () => {
    parsing = handleParseRequest(req, res);
  });
  req.emit("aborted");
  await parsing;
  expect(res.json).not.toHaveBeenCalled();
  expect(errorOutput).toEqual([["[CollectorParse]", "parse_cancelled"]]);
  expect(terminate.mock.instances[0].threadId).toBe(-1);
  expect(req.listenerCount("aborted")).toBe(0);
  expect(res.listenerCount("close")).toBe(0);
});

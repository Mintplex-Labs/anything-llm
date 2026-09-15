const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { TextDecoder } = require("node:util");
const mime = require("mime");
const fileType = require("file-type");
const AdmZip = require("adm-zip");

const SUPPORTED_TYPES =
  "Supported attachments: JPEG, PNG, WebP, PDF, TXT, Markdown, DOCX, and other supported documents. Voice, video, and stickers are not supported.";
const TEXT_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".org",
  ".adoc",
  ".rst",
  ".csv",
  ".json",
  ".html",
  ".mbox",
]);
const CONTAINER_ENTRIES = {
  ".docx": "word/document.xml",
  ".pptx": "ppt/presentation.xml",
  ".xlsx": "xl/workbook.xml",
  ".odt": "content.xml",
  ".odp": "content.xml",
  ".epub": "META-INF/container.xml",
};
const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);
const activeScopes = new Map();
function cleanupActiveAttachmentScopes() {
  for (const [directory, cleanup] of activeScopes) {
    try {
      cleanup();
      activeScopes.delete(directory);
    } catch {
      /* Process cleanup cannot log file paths. */
    }
  }
}
process.once("exit", cleanupActiveAttachmentScopes);

function publicAttachmentError(error) {
  const messages = new Set([
    SUPPORTED_TYPES,
    "Attachment exceeds size limit.",
    "Legacy DOC is unsupported. Convert to DOCX or PDF.",
    "Could not clean up attachment.",
  ]);
  return messages.has(error?.message)
    ? error.message
    : "Could not process attachment.";
}

function cleanupScope(directory) {
  try {
    activeScopes.get(directory)?.();
    activeScopes.delete(directory);
  } catch {
    // Keep the registered scope for process-exit cleanup if removal fails.
    throw new Error("Could not clean up attachment.");
  }
}

async function abortable(work, signal) {
  // SDK calls may abort synchronously and return an already-rejected promise.
  // Observe it even when cancellation has won before the race is installed.
  if (signal?.aborted) Promise.resolve(work).catch(() => {});
  checkAbort(signal);
  if (!signal) return work;
  let onAbort;
  try {
    return await Promise.race([
      work,
      new Promise((_, reject) => {
        onAbort = () =>
          reject(
            Object.assign(new Error("Attachment processing cancelled."), {
              name: "AbortError",
            })
          );
        signal.addEventListener("abort", onAbort, { once: true });
        if (signal.aborted) onAbort();
      }),
    ]);
  } finally {
    signal.removeEventListener("abort", onAbort);
  }
}

function checkAbort(signal) {
  if (signal?.aborted)
    throw Object.assign(new Error("Attachment processing cancelled."), {
      name: "AbortError",
    });
}

function safeName(name) {
  return (
    path
      .basename(String(name || "attachment").replace(/\\/g, "/"))
      .replace(/[^\p{L}\p{N}._-]/gu, "_")
      .replace(/^\.+/, "_")
      .slice(-180) || "attachment"
  );
}

// Generic GUI/API document uploads in utils/files/multer.js do not configure
// multer.limits.fileSize. The separate 25 MB audio limit is not a document limit.
function resolveUploadLimit(sizeLimit) {
  if (sizeLimit == null) return Infinity;
  if (!Number.isSafeInteger(sizeLimit) || sizeLimit <= 0)
    throw new Error("Invalid attachment size limit.");
  return sizeLimit;
}

function detectedMime(buffer, extension, sizeLimit) {
  const detected = fileType(buffer);
  const declared =
    extension === ".md" ? "text/markdown" : mime.getType(extension);
  if (TEXT_EXTENSIONS.has(extension)) {
    if (detected || buffer.includes(0)) throw new Error(SUPPORTED_TYPES);
    new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    return declared || "text/plain";
  }
  if (CONTAINER_ENTRIES[extension]) {
    if (!["application/zip", "application/epub+zip"].includes(detected?.mime))
      throw new Error(SUPPORTED_TYPES);
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    const total = entries.reduce((sum, entry) => sum + entry.header.size, 0);
    if (total > sizeLimit) throw new Error("Attachment exceeds size limit.");
    if (!zip.getEntry(CONTAINER_ENTRIES[extension]))
      throw new Error(SUPPORTED_TYPES);
    if (
      [".docx", ".pptx", ".xlsx"].includes(extension) &&
      !zip.getEntry("[Content_Types].xml")
    )
      throw new Error(SUPPORTED_TYPES);
    if (
      [".odt", ".odp"].includes(extension) &&
      zip.readAsText("mimetype") !== declared
    )
      throw new Error(SUPPORTED_TYPES);
    return declared;
  }
  if (
    detected?.mime !== declared ||
    (!IMAGE_MIMES.has(declared) && declared !== "application/pdf")
  )
    throw new Error(SUPPORTED_TYPES);
  return declared;
}

async function normalizeLarkAttachments({
  channel,
  resources = [],
  sizeLimit = null,
  signal,
  tempRoot = os.tmpdir(),
  temporaryFiles = fs,
  parseDocument,
}) {
  const limit = resolveUploadLimit(sizeLimit);
  const attachments = [],
    documentText = [];
  let directory;
  try {
    checkAbort(signal);
    if (!Array.isArray(resources)) throw new Error(SUPPORTED_TYPES);
    // Validate all declarations before downloading any resource.
    for (const resource of resources) {
      if (
        !resource ||
        !["image", "file"].includes(resource.type) ||
        typeof resource.fileKey !== "string" ||
        !/^[A-Za-z0-9_-]{1,512}$/.test(resource.fileKey)
      )
        throw new Error(SUPPORTED_TYPES);
      const extension = path.extname(safeName(resource.fileName)).toLowerCase();
      if (extension === ".doc")
        throw new Error("Legacy DOC is unsupported. Convert to DOCX or PDF.");
      if (
        resource.type === "file" &&
        !TEXT_EXTENSIONS.has(extension) &&
        !CONTAINER_ENTRIES[extension] &&
        ![".jpg", ".jpeg", ".png", ".webp", ".pdf"].includes(extension)
      )
        throw new Error(SUPPORTED_TYPES);
    }
    if (!resources.length) return { attachments, documentText: "" };
    temporaryFiles.mkdirSync(tempRoot, { recursive: true });
    directory = temporaryFiles.mkdtempSync(path.join(tempRoot, "lark-"));
    const cleanup = () =>
      temporaryFiles.rmSync(directory, { recursive: true, force: true });
    activeScopes.set(directory, cleanup);
    for (const [index, resource] of resources.entries()) {
      checkAbort(signal);
      const buffer = await abortable(
        channel.downloadResource(resource.fileKey, resource.type),
        signal
      );
      checkAbort(signal);
      if (!Buffer.isBuffer(buffer) || !buffer.length)
        throw new Error(SUPPORTED_TYPES);
      if (buffer.length > limit)
        throw new Error("Attachment exceeds size limit.");
      const detected = fileType(buffer);
      const name = resource.fileName
        ? safeName(resource.fileName)
        : `attachment.${detected?.ext || "bin"}`;
      const type = detectedMime(
        buffer,
        path.extname(name).toLowerCase(),
        limit
      );
      if (resource.type === "image" && !IMAGE_MIMES.has(type))
        throw new Error(SUPPORTED_TYPES);
      const scopedFile = path.join(directory, `${index}-${name}`);
      temporaryFiles.writeFileSync(scopedFile, buffer, {
        mode: 0o600,
        flag: "wx",
      });
      checkAbort(signal);
      if (!IMAGE_MIMES.has(type) && parseDocument) {
        const result = await abortable(
          parseDocument(name, { absolutePath: scopedFile }),
          signal
        );
        checkAbort(signal);
        if (!result?.success || !result.documents?.length)
          throw new Error("Could not process attachment.");
        documentText.push(
          `Attachment: ${name}\n${result.documents.map((doc) => doc.pageContent || "").join("\n\n")}`
        );
      }
      attachments.push({
        name,
        mime: type,
        contentString: buffer.toString("base64"),
      });
    }
    return { attachments, documentText: documentText.join("\n\n") };
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error(publicAttachmentError(error));
  } finally {
    if (directory) cleanupScope(directory);
  }
}

module.exports = {
  normalizeLarkAttachments,
  cleanupActiveAttachmentScopes,
  SUPPORTED_TYPES,
  publicAttachmentError,
};

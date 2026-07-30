const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
  pdf: "application/pdf",
  csv: "text/csv",
  json: "application/json",
  html: "text/html",
  txt: "text/plain",
  md: "text/markdown",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  zip: "application/zip",
};

function safeFilename(filename) {
  return String(filename || "").replace(/[^a-zA-Z0-9._-]/g, "_");
}

function fileExtensionMismatch(filepath, ext) {
  let fd;
  try {
    const head = Buffer.alloc(8);
    fd = fs.openSync(filepath, "r");
    fs.readSync(fd, head, 0, head.length, 0);

    if (ext === "pdf" && !head.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
      return "expected PDF bytes";
    }
    if (
      ext === "png" &&
      !head.equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      )
    ) {
      return "expected PNG bytes";
    }
    if (
      (ext === "jpg" || ext === "jpeg") &&
      !(head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff)
    ) {
      return "expected JPEG bytes";
    }
  } catch {
    return null;
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {}
    }
  }
  return null;
}

function readManifest(deliverablesDir) {
  const manifest = path.join(deliverablesDir, ".manifest.json");
  if (!fs.existsSync(manifest)) return [];
  return JSON.parse(fs.readFileSync(manifest, "utf8"));
}

function writeManifest(deliverablesDir, entries) {
  const manifest = path.join(deliverablesDir, ".manifest.json");
  fs.writeFileSync(manifest, JSON.stringify(entries, null, 2), "utf8");
}

module.exports = {
  MIME_TYPES,
  fileExtensionMismatch,
  readManifest,
  safeFilename,
  writeManifest,
};

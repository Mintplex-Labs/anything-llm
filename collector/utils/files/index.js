const fs = require("fs");
const path = require("path");
const { MimeDetector } = require("./mime");

/**
 * The folder where documents are stored to be stored when
 * processed by the collector.
 */
const documentsFolder =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../../server/storage/documents`)
    : path.resolve(process.env.STORAGE_DIR, `documents`);

/**
 * Checks if a file is text by checking the mime type and then falling back to buffer inspection.
 * This way we can capture all the cases where the mime type is not known but still parseable as text
 * without having to constantly add new mime type overrides.
 * @param {string} filepath - The path to the file.
 * @returns {boolean} - Returns true if the file is text, false otherwise.
 */
function isTextType(filepath) {
  if (!fs.existsSync(filepath)) return false;
  const result = isKnownTextMime(filepath);
  if (result.valid) return true; // Known text type - return true.
  if (result.reason !== "generic") return false; // If any other reason than generic - return false.
  return parseableAsText(filepath); // Fallback to parsing as text via buffer inspection.
}

/**
 * Checks if a file is known to be text by checking the mime type.
 * @param {string} filepath - The path to the file.
 * @returns {boolean} - Returns true if the file is known to be text, false otherwise.
 */
function isKnownTextMime(filepath) {
  try {
    const mimeLib = new MimeDetector();
    const mime = mimeLib.getType(filepath);
    if (mimeLib.badMimes.includes(mime))
      return { valid: false, reason: "bad_mime" };

    const type = mime.split("/")[0];
    if (mimeLib.nonTextTypes.includes(type))
      return { valid: false, reason: "non_text_mime" };
    return { valid: true, reason: "valid_mime" };
  } catch (e) {
    return { valid: false, reason: "generic" };
  }
}

/**
 * Checks if a file is parseable as text by forcing it to be read as text in utf8 encoding.
 * If the file looks too much like a binary file, it will return false.
 * @param {string} filepath - The path to the file.
 * @returns {boolean} - Returns true if the file is parseable as text, false otherwise.
 */
function parseableAsText(filepath) {
  try {
    const fd = fs.openSync(filepath, "r");
    const buffer = Buffer.alloc(1024); // Read first 1KB of the file synchronously
    const bytesRead = fs.readSync(fd, buffer, 0, 1024, 0);
    fs.closeSync(fd);

    const content = buffer.subarray(0, bytesRead).toString("utf8");
    const nullCount = (content.match(/\0/g) || []).length;
    const controlCount = (content.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g) || [])
      .length;

    const threshold = bytesRead * 0.1;
    return nullCount + controlCount < threshold;
  } catch {
    return false;
  }
}

function trashFile(filepath) {
  if (!fs.existsSync(filepath)) return;

  try {
    const isDir = fs.lstatSync(filepath).isDirectory();
    if (isDir) return;
  } catch {
    return;
  }

  fs.rmSync(filepath);
  return;
}

function createdDate(filepath) {
  try {
    const { birthtimeMs, birthtime } = fs.statSync(filepath);
    if (birthtimeMs === 0) throw new Error("Invalid stat for file!");
    return birthtime.toLocaleString();
  } catch {
    return "unknown";
  }
}

function writeToServerDocuments(
  data = {},
  filename,
  destinationOverride = null
) {
  const destination = destinationOverride
    ? path.resolve(destinationOverride)
    : path.resolve(
        __dirname,
        "../../../server/storage/documents/custom-documents"
      );
  if (!fs.existsSync(destination))
    fs.mkdirSync(destination, { recursive: true });
  const destinationFilePath = path.resolve(destination, filename) + ".json";

  fs.writeFileSync(destinationFilePath, JSON.stringify(data, null, 4), {
    encoding: "utf-8",
  });

  return {
    ...data,
    // relative location string that can be passed into the /update-embeddings api
    // that will work since we know the location exists and since we only allow
    // 1-level deep folders this will always work. This still works for integrations like GitHub and YouTube.
    location: destinationFilePath.split("/").slice(-2).join("/"),
  };
}

// When required we can wipe the entire collector hotdir and tmp storage in case
// there were some large file failures that we unable to be removed a reboot will
// force remove them.
async function wipeCollectorStorage() {
  const cleanHotDir = new Promise((resolve) => {
    const directory = path.resolve(__dirname, "../../hotdir");
    fs.readdir(directory, (err, files) => {
      if (err) resolve();

      for (const file of files) {
        if (file === "__HOTDIR__.md") continue;
        try {
          fs.rmSync(path.join(directory, file));
        } catch {}
      }
      resolve();
    });
  });

  const cleanTmpDir = new Promise((resolve) => {
    const directory = path.resolve(__dirname, "../../storage/tmp");
    fs.readdir(directory, (err, files) => {
      if (err) resolve();

      for (const file of files) {
        if (file === ".placeholder") continue;
        try {
          fs.rmSync(path.join(directory, file));
        } catch {}
      }
      resolve();
    });
  });

  await Promise.all([cleanHotDir, cleanTmpDir]);
  console.log(`Collector hot directory and tmp storage wiped!`);
  return;
}

/**
 * Checks if a given path is within another path.
 * @param {string} outer - The outer path (should be resolved).
 * @param {string} inner - The inner path (should be resolved).
 * @returns {boolean} - Returns true if the inner path is within the outer path, false otherwise.
 */
function isWithin(outer, inner) {
  if (outer === inner) return false;
  const rel = path.relative(outer, inner);
  return !rel.startsWith("../") && rel !== "..";
}

function normalizePath(filepath = "") {
  const result = path
    .normalize(filepath.trim())
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .trim();
  if (["..", ".", "/"].includes(result)) throw new Error("Invalid path.");
  return result;
}

function sanitizeFileName(fileName) {
  if (!fileName) return fileName;
  return fileName.replace(/[<>:"\/\\|?*]/g, "");
}

module.exports = {
  trashFile,
  isTextType,
  createdDate,
  writeToServerDocuments,
  wipeCollectorStorage,
  normalizePath,
  isWithin,
  sanitizeFileName,
  documentsFolder,
};

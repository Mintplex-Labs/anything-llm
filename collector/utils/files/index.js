const fs = require("fs");
const path = require("path");
const { MimeDetector } = require("./mime");

function isTextType(filepath) {
  try {
    if (!fs.existsSync(filepath)) return false;
    const mimeLib = new MimeDetector();
    const mime = mimeLib.getType(filepath);
    if (mimeLib.badMimes.includes(mime)) return false;

    const type = mime.split("/")[0];
    if (mimeLib.nonTextTypes.includes(type)) return false;
    return true;
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

module.exports = {
  trashFile,
  isTextType,
  createdDate,
  writeToServerDocuments,
  wipeCollectorStorage,
  normalizePath,
  isWithin,
};

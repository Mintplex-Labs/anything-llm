const fs = require("fs");
const path = require("path");

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
  const destinationFilePath = path.resolve(destination, filename);

  fs.writeFileSync(
    destinationFilePath + ".json",
    JSON.stringify(data, null, 4),
    { encoding: "utf-8" }
  );
  return;
}

module.exports = {
  trashFile,
  createdDate,
  writeToServerDocuments,
};

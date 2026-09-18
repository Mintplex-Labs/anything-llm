const { v4 } = require("uuid");
const { default: slugify } = require("slugify");
const path = require("path");
const fs = require("fs");
const {
  writeToServerDocuments,
  sanitizeFileName,
  documentsFolder,
} = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { processSingleFile } = require("../../../processSingleFile");

function parseLocalFolderPath(files = []) {
  const possiblePaths = new Set();
  files.forEach(
    (file) => file?.path && possiblePaths.add(file.path.split("/")[0])
  );

  switch (possiblePaths.size) {
    case 0:
      return null;
    case 1:
      // The user specified a folder properly - so all files are in the same folder.
      return possiblePaths.values().next().value;
    default:
      return null;
  }
}

async function loadLocalFolder({ files = [], batchUUId }) {
  if (!files || files?.length === 0)
    return { success: false, error: "No files provided" };

  const folderName = parseLocalFolderPath(files);
  const folderUUId = batchUUId || v4().slice(0, 4);
  const outFolder = folderName
    ? slugify(`local-folder-${folderName}-${folderUUId}`).toLowerCase()
    : slugify(`local-folder-${folderUUId}`).toLowerCase();
  const outFolderPath = path.resolve(documentsFolder, outFolder);
  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });

  console.log(
    `Processing ${files.length} files from Local Folder ${
      folderName ? `"${folderName}"` : ""
    }`
  );

  const results = [];

  for (const file of files) {
    try {
      const targetFileName = file.path.split("/").slice(1).join("/") || file.name

      metadata = {
        title: file.path.split("/").slice(1).join("/") || file.name,
        docAuthor: "Local Folder",
        description: file.name,
        docSource: "Local Folder",
        chunkSource: `file://${file.path}`,
      }

      const result = await processSingleFile(
        targetFileName,
        { absolutePath: file.serverPath, destinationOverride: outFolderPath },
        metadata
      );
      
      if (result.success) {
        results.push({ file: file.path, status: "success" });
      } else {
        results.push({ file: file.path, status: "failed", reason: result.reason });
      }
    } catch (e) {
      console.error(`Failed to process ${file.path}:`, e);
      results.push({ file: file.path, status: "failed", reason: e.message });
    }
  }

  return {
    success: true,
    data: {
      processed: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "failed").length,
      total: files.length,
      results,
      destination: path.basename(outFolderPath),
    }
  };
}


module.exports = {
  loadLocalFolder,
};

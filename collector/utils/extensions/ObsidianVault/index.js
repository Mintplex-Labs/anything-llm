const { v4 } = require("uuid");
const { default: slugify } = require("slugify");
const path = require("path");
const fs = require("fs");
const {
  writeToServerDocuments,
  sanitizeFileName,
  documentsFolder,
} = require("../../files");

function parseObsidianVaultPath(files = []) {
  const possiblePaths = new Set();
  files.forEach(
    (file) => file?.path && possiblePaths.add(file.path.split("/")[0])
  );

  switch (possiblePaths.size) {
    case 0:
      return null;
    case 1:
      // The user specified a vault properly - so all files are in the same folder.
      return possiblePaths.values().next().value;
    default:
      return null;
  }
}

async function loadObsidianVault({ files = [] }) {
  if (!files || files?.length === 0)
    return { success: false, error: "No files provided" };
  const vaultName = parseObsidianVaultPath(files);
  const folderUUId = v4().slice(0, 4);
  const outFolder = vaultName
    ? slugify(`obsidian-vault-${vaultName}-${folderUUId}`).toLowerCase()
    : slugify(`obsidian-${folderUUId}`).toLowerCase();
  const outFolderPath = path.resolve(documentsFolder, outFolder);
  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });

  console.log(
    `Processing ${files.length} files from Obsidian Vault ${
      vaultName ? `"${vaultName}"` : ""
    }`
  );
  const results = [];
  for (const file of files) {
    try {
      const fullPageContent = file?.content;
      // If the file has no content or is just whitespace, skip it.
      if (!fullPageContent || fullPageContent.trim() === "") continue;

      const data = {
        id: v4(),
        url: `obsidian://${file.path}`,
        title: file.name,
        docAuthor: "Obsidian Vault",
        description: file.name,
        docSource: "Obsidian Vault",
        chunkSource: `obsidian://${file.path}`,
        published: new Date().toLocaleString(),
        wordCount: fullPageContent.split(" ").length,
        pageContent: fullPageContent,
        token_count_estimate: fullPageContent.length / 4, // rough estimate
      };

      const targetFileName = sanitizeFileName(
        `${slugify(file.name)}-${data.id}`
      );
      writeToServerDocuments(data, targetFileName, outFolderPath);
      results.push({ file: file.path, status: "success" });
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
    },
  };
}

module.exports = {
  loadObsidianVault,
};

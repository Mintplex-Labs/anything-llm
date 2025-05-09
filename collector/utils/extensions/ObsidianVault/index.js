const { v4 } = require("uuid");
const { default: slugify } = require("slugify");
const path = require("path");
const fs = require("fs");
const {
  writeToServerDocuments,
  sanitizeFileName,
} = require("../../files");

async function loadObsidianVault({ files }) {
  const outFolder = slugify(
    `obsidian-${v4().slice(0, 4)}`
  ).toLowerCase();
  const outFolderPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          __dirname,
          `../../../../server/storage/documents/${outFolder}`
        )
      : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

  if (!fs.existsSync(outFolderPath)) {
    fs.mkdirSync(outFolderPath, { recursive: true });
  }

  console.log(
    `Processing ${files.length} files from Obsidian Vault`
  );

  const results = [];
  for (const file of files) {
    try {
      const fullPageContent = file.name + "\n" + file.content;

      const data = {
        id: v4(),
        url: `obsidian://${file.path}`,
        title: file.name.replace('.md', ''),
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
        `${slugify(file.name.replace('.md', ''))}-${data.id}`
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
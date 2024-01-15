const fs = require("fs");
const path = require("path");
const { purgeVectorCache, purgeSourceDocument, normalizePath } = require(".");
const { Document } = require("../../models/documents");
const { Workspace } = require("../../models/workspace");

async function purgeDocument(filename) {
  const workspaces = await Workspace.where();
  for (const workspace of workspaces) {
    await Document.removeDocuments(workspace, [filename]);
  }
  await purgeVectorCache(filename);
  await purgeSourceDocument(filename);
  return;
}

async function purgeFolder(folderName) {
  if (folderName === "custom-documents") return;
  const documentsFolder =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/documents`)
      : path.resolve(process.env.STORAGE_DIR, `documents`);

  const folderPath = path.resolve(documentsFolder, normalizePath(folderName));
  const filenames = fs
    .readdirSync(folderPath)
    .map((file) => path.join(folderPath, file));
  const workspaces = await Workspace.where();

  const purgePromises = [];
  // Remove associated Vector-cache files
  for (const filename of filenames) {
    const rmVectorCache = () =>
      new Promise((resolve) =>
        purgeVectorCache(filename).then(() => resolve(true))
      );
    purgePromises.push(rmVectorCache);
  }

  // Remove workspace document associations
  for (const workspace of workspaces) {
    const rmWorkspaceDoc = () =>
      new Promise((resolve) =>
        Document.removeDocuments(workspace, filenames).then(() => resolve(true))
      );
    purgePromises.push(rmWorkspaceDoc);
  }

  await Promise.all(purgePromises.flat().map((f) => f()));
  fs.rmSync(folderPath, { recursive: true }); // Delete root document and source files.

  return;
}

module.exports = {
  purgeDocument,
  purgeFolder,
};

const { purgeVectorCache, purgeSourceDocument } = require(".");
const { Document } = require("../../models/documents");
const { Workspace } = require("../../models/workspace");

async function purgeDocument(filename, meta) {
  const workspaces = await Workspace.where();
  for (const workspace of workspaces) {
    await Document.removeDocuments(workspace, [filename]);
  }
  await purgeVectorCache(filename);
  await purgeSourceDocument(filename);
  return;
}

module.exports = {
  purgeDocument,
};

const { Workspace } = require("../../models/workspace");
const { Document } = require("../../models/documents");
const { DocumentVectors } = require("../../models/vectors");
const { getVectorDbClass } = require("../helpers");
const { EventLogs } = require("../../models/eventLogs");
const { purgeVectorCache } = require("../files");

async function resetAllVectorStores() {
  try {
    const VectorDb = getVectorDbClass();
    const workspaces = await Workspace.where();

    // Collect all documents across workspaces
    const allDocuments = new Set();
    for (const workspace of workspaces) {
      const docs = await Document.forWorkspace(workspace.id);
      docs.forEach((doc) => allDocuments.add(doc.docpath));
    }

    // Clear vector cache for cached documents
    for (const docpath of allDocuments) {
      console.log(`Purging vector cache for ${docpath}`);
      await purgeVectorCache(docpath);
    }

    // Clear vector db for each workspace
    for (const workspace of workspaces) {
      await DocumentVectors.deleteForWorkspace(workspace.id);
      await Document.delete({ workspaceId: Number(workspace.id) });

      await EventLogs.logEvent("workspace_vectors_reset", {
        workspaceName: workspace?.name || "Unknown Workspace",
        reason: "System vector configuration changed",
      });

      try {
        await VectorDb["delete-namespace"]({ namespace: workspace.slug });
      } catch (e) {
        console.error(e.message);
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to reset vector stores:", error);
    return false;
  }
}

module.exports = { resetAllVectorStores };

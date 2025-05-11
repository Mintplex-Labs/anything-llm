const { Workspace } = require("../../models/workspace");
const { Document } = require("../../models/documents");
const { DocumentVectors } = require("../../models/vectors");
const { EventLogs } = require("../../models/eventLogs");
const { purgeEntireVectorCache } = require("../files");
const { getVectorDbClass } = require("../helpers");

/**
 * Resets all vector database and associated content:
 * - Purges the entire vector-cache folder.
 * - Deletes all document vectors from the database.
 * - Deletes all documents from the database.
 * - Deletes all vector db namespaces for each workspace.
 * - Logs an event indicating the reset.
 * @param {string} vectorDbKey - The _previous_ vector database provider name that we will be resetting.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
async function resetAllVectorStores({ vectorDbKey }) {
  try {
    const workspaces = await Workspace.where();
    purgeEntireVectorCache(); // Purges the entire vector-cache folder.
    await DocumentVectors.delete(); // Deletes all document vectors from the database.
    await Document.delete(); // Deletes all documents from the database.
    await EventLogs.logEvent("workspace_vectors_reset", {
      reason: "System vector configuration changed",
    });

    console.log(
      "Resetting anythingllm managed vector namespaces for",
      vectorDbKey
    );
    const VectorDb = getVectorDbClass(vectorDbKey);

    if (vectorDbKey === "pgvector") {
      /*
      pgvector has a reset method that drops the entire embedding table
      which is required since if this function is called we will need to
      reset the embedding column VECTOR dimension value and you cannot change
      the dimension value of an existing vector column.
      */
      await VectorDb.reset();
    } else {
      for (const workspace of workspaces) {
        try {
          await VectorDb["delete-namespace"]({ namespace: workspace.slug });
        } catch (e) {
          console.error(e.message);
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to reset vector stores:", error);
    return false;
  }
}

module.exports = { resetAllVectorStores };

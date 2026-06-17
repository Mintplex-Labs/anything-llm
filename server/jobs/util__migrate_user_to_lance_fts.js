const { dumpENV } = require("../utils/helpers/updateENV.js");
const { log, conclude } = require("./helpers/index.js");
const lancedb = require("@lancedb/lancedb");

/**
 * Migrates a user's LanceDB tables to the enhanced vector search functionality via RRF
 * by creating an FTS search index on the `text` column of each table - (required by AnythingLLM)
 *
 * This enables basic hybrid search (vector + full-text) on all tables for a dramatically improved search experience.
 *
 * This process is idempotent and can be run multiple times without causing issues but also will run every boot so that if somehow
 * tables are missing the FTS index - it will create it.
 *
 * LanceDB already has modified the newTable creation to create the FTS index on the `text` column of each table - so this process is only
 * needed to create the index on existing tables.
 */
async function migrateUserToLanceFts() {
  try {
    // Only run if the vector db is LanceDB
    if ((process.env.VECTOR_DB ?? "lancedb") !== "lancedb") return;

    const { LanceDb } = require("../utils/vectorDbProviders/lance/index.js");
    const db = new LanceDb();
    const { client } = await db.connect();
    const tableNames = await client.tableNames();
    if (tableNames.length === 0) return; // no-op if no tables found

    let created = 0;
    for (const tableName of tableNames) {
      try {
        const table = await client.openTable(tableName);
        const indices = await table.listIndices();
        const hasFtsIndex = indices.some(
          (idx) => idx.indexType === "FTS" || idx.name === "text_idx"
        );
        if (hasFtsIndex) continue;

        await table.createIndex("text", {
          config: lancedb.Index.fts(),
        });
        created++;
      } catch (e) {
        log(
          `Failed to create FTS index for table "${tableName}": ${e.message}`
        );
      }
    }

    if (created > 0)
      log(
        `Created Hybrid Search Indexes on ${created} of ${tableNames.length} existing tables.`
      );
  } catch (e) {
    console.error(e);
    log(`migrateUserToLanceFts errored with ${e.message}`);
  }
}

/**
 * For legacy reasons, we need to set the EMBEDDING_MODEL_PREF to the old default model if it is not set.
 * This is because the all-MiniLM-L6-v2 model is not the recommended model by AnythingLLM anymore but
 * for users who have never changed their embedder provider or model (which would set this value) - we need to set it to the old default.
 *
 * For example: If you have been a long time AnythingLLM user and stuck with defaults, EMBEDDING_MODEL_PREF will not be set - since NativeEmbedder.getEmbeddingModel() will return the default model
 * which used to be the all-MiniLM-L6-v2 model.
 *
 * If you have changed your embedder provider or model *ever* - then EMBEDDING_MODEL_PREF would be set to something and even if you changed back
 * to native - it would still save this value and would be set.
 *
 * So all we need to do is check if EMBEDDING_MODEL_PREF is not set and if the embedder provider is native - then we set it to the legacy model.
 *
 * This script runs on boot, but during onboarding we now set the EMBEDDING_MODEL_PREF to the new default model so this handle new users
 * without breaking old user instances who will not go through onboarding again.
 * @returns
 */
function setEmptyEmbeddingModelPref() {
  try {
    const legacyModel = "Xenova/all-MiniLM-L6-v2";
    if (process.env.EMBEDDING_ENGINE !== "native") return;

    if (!("EMBEDDING_MODEL_PREF" in process.env)) {
      process.env.EMBEDDING_MODEL_PREF = legacyModel;
      log(
        `setEmptyEmbeddingModelPref set EMBEDDING_MODEL_PREF to ${legacyModel}`
      );
      if (process.env.NODE_ENV === "production") dumpENV();
    }
  } catch (e) {
    console.error(e);
    log(`setEmptyEmbeddingModelPref errored with ${e.message}`);
  }
}

(async () => {
  try {
    await Promise.all([migrateUserToLanceFts(), setEmptyEmbeddingModelPref()]);
  } catch (e) {
    console.error(e);
    log(`errored with ${e.message}`);
  } finally {
    conclude();
  }
})();

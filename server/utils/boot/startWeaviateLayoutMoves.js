/**
 * Makes this (the server) process the only one that moves Weaviate data
 * between storage layouts, and finishes any pending move in the background,
 * e.g. after the multi-tenancy setting was changed in the .env file.
 */
async function startWeaviateLayoutMoves() {
  const { Weaviate } = require("../vectorDbProviders/weaviate");
  Weaviate.enableLayoutMoves();
  if (process.env.VECTOR_DB !== "weaviate") return;
  new Weaviate()
    .moveAllToCurrentLayout()
    .then((report) => {
      if (report.checked > 0)
        console.log(
          `\x1b[33m[WEAVIATE]\x1b[0m Storage layout: checked ${report.checked} workspaces, moved ${report.moved}, ${report.failed.length} failed.`
        );
    })
    .catch((e) =>
      console.error(
        `\x1b[31m[WEAVIATE]\x1b[0m Moving workspaces to the configured storage layout failed: ${e.message}`
      )
    );
}

module.exports = startWeaviateLayoutMoves;

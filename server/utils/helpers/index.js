function getVectorDbClass() {
  const { Pinecone } = require("../vectorDbProviders/pinecone");
  const { Chroma } = require("../vectorDbProviders/chroma");
  const { LanceDb } = require("../vectorDbProviders/lance");

  const vectorSelection = process.env.VECTOR_DB || "pinecone";
  switch (vectorSelection) {
    case "pinecone":
      return Pinecone;
    case "chroma":
      return Chroma;
    case "lancedb":
      return LanceDb;
    default:
      throw new Error("ENV: No VECTOR_DB value found in environment!");
  }
}

function toChunks(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

function curateSources(sources = []) {
  const documents = [];

  // Sometimes the source may or may not have a metadata property
  // in the response so we search for it explicitly or just spread the entire
  // source and check to see if at least title exists.
  for (const source of sources) {
    if (source.hasOwnProperty("metadata")) {
      const { metadata = {} } = source;
      if (Object.keys(metadata).length > 0) {
        documents.push({ ...metadata });
      }
    } else {
      if (Object.keys(source).length > 0) {
        documents.push({ ...source });
      }
    }
  }

  return documents;
}

module.exports = {
  getVectorDbClass,
  toChunks,
  curateSources,
};

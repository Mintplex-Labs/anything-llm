function getVectorDbClass() {
  const { Pinecone } = require("../pinecone");
  const { Chroma } = require("../chroma");
  const { LanceDb } = require("../lancedb");

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
  const knownDocs = [];
  const documents = [];
  for (const source of sources) {
    const { metadata = {} } = source;
    if (
      Object.keys(metadata).length > 0 &&
      !knownDocs.includes(metadata.title)
    ) {
      documents.push({ ...metadata });
      knownDocs.push(metadata.title);
    }
  }

  return documents;
}

module.exports = {
  getVectorDbClass,
  toChunks,
  curateSources,
};

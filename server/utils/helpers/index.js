const { Pinecone } = require("../pinecone");
const { Chroma } = require("../chroma");
const { LanceDb } = require('../lancedb');

function getVectorDbClass() {
  const vectorSelection = process.env.VECTOR_DB || "pinecone";
  switch (vectorSelection) {
    case "pinecone":
      return Pinecone;
    case "chroma":
      return Chroma;
    case "lancedb":
      return LanceDb
    default:
      return Pinecone;
  }
}

module.exports = {
  getVectorDbClass,
};

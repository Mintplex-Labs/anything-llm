if (process.env.NODE_ENV === 'development') require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { viewLocalFiles } = require("../utils/files");
const { getVectorDbClass } = require("../utils/helpers");

function systemEndpoints(app) {
  if (!app) return;

  app.get("/ping", (_, response) => {
    response.sendStatus(200);
  });

  app.get("/setup-complete", (_, response) => {
    const vectorDB = process.env.VECTOR_DB || "pinecone";
    const results = {
      VectorDB: vectorDB,
      OpenAiKey: !!process.env.OPEN_AI_KEY,
      OpenAiModelPref: process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo",
      ...(vectorDB === "pinecone"
        ? {
          PineConeEnvironment: process.env.PINECONE_ENVIRONMENT,
          PineConeKey: !!process.env.PINECONE_API_KEY,
          PineConeIndex: process.env.PINECONE_INDEX,
        }
        : {}),
      ...(vectorDB === "chroma"
        ? {
          ChromaEndpoint: process.env.CHROMA_ENDPOINT,
        }
        : {}),
    };
    response.status(200).json({ results });
  });

  app.get("/system-vectors", async (_, response) => {
    const VectorDb = getVectorDbClass();
    const vectorCount = await VectorDb.totalIndicies();
    response.status(200).json({ vectorCount });
  });

  app.get("/local-files", async (_, response) => {
    const localFiles = await viewLocalFiles();
    response.status(200).json({ localFiles });
  });
}

module.exports = { systemEndpoints };
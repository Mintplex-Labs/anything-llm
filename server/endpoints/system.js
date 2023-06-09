process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const { viewLocalFiles } = require("../utils/files");
const { getVectorDbClass } = require("../utils/helpers");
const { reqBody, makeJWT } = require("../utils/http");

function systemEndpoints(app) {
  if (!app) return;

  app.get("/ping", (_, response) => {
    response.sendStatus(200);
  });

  app.get("/setup-complete", (_, response) => {
    try {
      const vectorDB = process.env.VECTOR_DB || "pinecone";
      const results = {
        RequiresAuth: !!process.env.AUTH_TOKEN,
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
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/system/check-token", (_, response) => {
    response.sendStatus(200).end();
  });

  app.post("/request-token", (request, response) => {
    try {
      const { password } = reqBody(request);
      if (password !== process.env.AUTH_TOKEN) {
        response
          .status(402)
          .json({
            valid: false,
            token: null,
            message: "Invalid password provided",
          });
        return;
      }

      response.status(200).json({
        valid: true,
        token: makeJWT({ p: password }, "30d"),
        message: null,
      });
      return;
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/system/system-vectors", async (_, response) => {
    try {
      const VectorDb = getVectorDbClass();
      const vectorCount = await VectorDb.totalIndicies();
      response.status(200).json({ vectorCount });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/system/local-files", async (_, response) => {
    try {
      const localFiles = await viewLocalFiles();
      response.status(200).json({ localFiles });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { systemEndpoints };

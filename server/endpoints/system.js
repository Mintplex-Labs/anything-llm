process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const { validateTablePragmas } = require("../utils/database");
const { viewLocalFiles } = require("../utils/files");
const {
  checkPythonAppAlive,
  acceptedFileTypes,
} = require("../utils/files/documentProcessor");
const { purgeDocument } = require("../utils/files/purgeDocument");
const { getVectorDbClass } = require("../utils/helpers");
const { updateENV } = require("../utils/helpers/updateENV");
const { reqBody, makeJWT } = require("../utils/http");

function systemEndpoints(app) {
  if (!app) return;

  app.get("/ping", (_, response) => {
    response.sendStatus(200);
  });

  app.get("/migrate", async (_, response) => {
    await validateTablePragmas(true);
    response.sendStatus(200);
  });

  app.get("/setup-complete", (_, response) => {
    try {
      const vectorDB = process.env.VECTOR_DB || "pinecone";
      const results = {
        CanDebug: !!!process.env.NO_DEBUG,
        RequiresAuth: !!process.env.AUTH_TOKEN,
        VectorDB: vectorDB,
        OpenAiKey: !!process.env.OPEN_AI_KEY,
        OpenAiModelPref: process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo",
        AuthToken: !!process.env.AUTH_TOKEN,
        JWTSecret: !!process.env.JWT_SECRET,
        StorageDir: process.env.STORAGE_DIR,
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
        response.status(402).json({
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

  app.delete("/system/remove-document", async (request, response) => {
    try {
      const { name, meta } = reqBody(request);
      await purgeDocument(name, meta);
      response.sendStatus(200).end();
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

  app.get("/system/document-processing-status", async (_, response) => {
    try {
      const online = await checkPythonAppAlive();
      response.sendStatus(online ? 200 : 503);
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/system/accepted-document-types", async (_, response) => {
    try {
      const types = await acceptedFileTypes();
      if (!types) {
        response.sendStatus(404).end();
        return;
      }

      response.status(200).json({ types });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post("/system/update-env", async (request, response) => {
    try {
      const body = reqBody(request);
      const { newValues, error } = updateENV(body);
      response.status(200).json({ newValues, error });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { systemEndpoints };

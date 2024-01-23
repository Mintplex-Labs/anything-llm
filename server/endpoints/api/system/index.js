const { SystemSettings } = require("../../../models/systemSettings");
const { getVectorDbClass } = require("../../../utils/helpers");
const { dumpENV, updateENV } = require("../../../utils/helpers/updateENV");
const { reqBody } = require("../../../utils/http");
const { validApiKey } = require("../../../utils/middleware/validApiKey");

function apiSystemEndpoints(app) {
  if (!app) return;

  app.get("/v1/system/env-dump", async (_, response) => {
    /*
   #swagger.tags = ['System Settings']
   #swagger.description = 'Dump all settings to file storage'
   #swagger.responses[403] = {
     schema: {
       "$ref": "#/definitions/InvalidAPIKey"
     }
   }
   */
    try {
      if (process.env.NODE_ENV !== "production")
        return response.sendStatus(200).end();
      await dumpENV();
      response.sendStatus(200).end();
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/v1/system", [validApiKey], async (_, response) => {
    /*
    #swagger.tags = ['System Settings']
    #swagger.description = 'Get all current system settings that are defined.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "settings": {
                "VectorDB": "pinecone",
                "PineConeKey": true,
                "PineConeIndex": "my-pinecone-index",
                "LLMProvider": "azure",
                "[KEY_NAME]": "KEY_VALUE",
              }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
    try {
      const settings = await SystemSettings.currentSettings();
      response.status(200).json({ settings });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/v1/system/vector-count", [validApiKey], async (_, response) => {
    /*
    #swagger.tags = ['System Settings']
    #swagger.description = 'Number of all vectors in connected vector database'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "vectorCount": 5450
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
    try {
      const VectorDb = getVectorDbClass();
      const vectorCount = await VectorDb.totalVectors();
      response.status(200).json({ vectorCount });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post(
    "/v1/system/update-env",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['System Settings']
      #swagger.description = 'Update a system setting or preference.'
      #swagger.requestBody = {
        description: 'Key pair object that matches a valid setting and value. Get keys from GET /v1/system or refer to codebase.',
        required: true,
        type: 'object',
        content: {
          "application/json": {
            example: {
              VectorDB: "lancedb",
              AnotherKey: "updatedValue"
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                newValues: {"[ENV_KEY]": 'Value'},
                error: 'error goes here, otherwise null'
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const body = reqBody(request);
        const { newValues, error } = await updateENV(body);
        if (process.env.NODE_ENV === "production") await dumpENV();
        response.status(200).json({ newValues, error });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { apiSystemEndpoints };

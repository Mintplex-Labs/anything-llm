const { Document } = require("../../../models/documents");
const { Telemetry } = require("../../../models/telemetry");
const { DocumentVectors } = require("../../../models/vectors");
const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { getVectorDbClass } = require("../../../utils/helpers");
const { multiUserMode, reqBody } = require("../../../utils/http");
const { validApiKey } = require("../../../utils/middleware/validApiKey");

function apiWorkspaceEndpoints(app) {
  if (!app) return;

  app.post("/v1/workspace/new", [validApiKey], async (request, response) => {
    /* 
    #swagger.tags = ['Workspaces']
    #swagger.description = 'Create a new workspace'
    #swagger.requestBody = {
        description: 'JSON object containing new display name of workspace.',
        required: true,
        type: 'object',
        content: {
          "application/json": {
            example: {
              name: "My New Workspace",
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
              workspace: {
                "id": 79,
                "name": "Sample workspace",
                "slug": "sample-workspace",
                "vectorTag": null,
                "createdAt": "2023-08-17 00:45:03",
                "openAiTemp": null,
                "lastUpdatedAt": "2023-08-17 00:45:03",
                "openAiHistory": 20,
                "openAiPrompt": null
              },
              message: 'Workspace created'
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
      const { name = null } = reqBody(request);
      const { workspace, message } = await Workspace.new(name);
      await Telemetry.sendTelemetry("workspace_created", {
        multiUserMode: multiUserMode(response),
        LLMSelection: process.env.LLM_PROVIDER || "openai",
        VectorDbSelection: process.env.VECTOR_DB || "pinecone",
      });
      response.status(200).json({ workspace, message });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/v1/workspaces", [validApiKey], async (request, response) => {
    /* 
    #swagger.tags = ['Workspaces']
    #swagger.description = 'List all current workspaces'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              workspaces: [
                {
                  "id": 79,
                  "name": "Sample workspace",
                  "slug": "sample-workspace",
                  "vectorTag": null,
                  "createdAt": "2023-08-17 00:45:03",
                  "openAiTemp": null,
                  "lastUpdatedAt": "2023-08-17 00:45:03",
                  "openAiHistory": 20,
                  "openAiPrompt": null
                }
              ],
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
      const workspaces = await Workspace.where();
      response.status(200).json({ workspaces });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/v1/workspace/:slug", [validApiKey], async (request, response) => {
    /* 
    #swagger.tags = ['Workspaces']
    #swagger.description = 'Get a workspace by its unique slug.'
    #swagger.path = '/v1/workspace/{slug}'
    #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Unique slug of workspace to find',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              workspace: {
                "id": 79,
                "name": "My workspace",
                "slug": "my-workspace-123",
                "vectorTag": null,
                "createdAt": "2023-08-17 00:45:03",
                "openAiTemp": null,
                "lastUpdatedAt": "2023-08-17 00:45:03",
                "openAiHistory": 20,
                "openAiPrompt": null,
                "documents": []
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
      const { slug } = request.params;
      const workspace = await Workspace.get(`slug = '${slug}'`);
      response.status(200).json({ workspace });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.delete(
    "/v1/workspace/:slug",
    [validApiKey],
    async (request, response) => {
      /* 
    #swagger.tags = ['Workspaces']
    #swagger.description = 'Deletes a workspace by its slug.'
    #swagger.path = '/v1/workspace/{slug}'
    #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Unique slug of workspace to delete',
        required: true,
        type: 'string'
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const { slug = "" } = request.params;
        const VectorDb = getVectorDbClass();
        const workspace = await Workspace.get(`slug = '${slug}'`);

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        await Workspace.delete(`slug = '${slug.toLowerCase()}'`);
        await DocumentVectors.deleteForWorkspace(workspace.id);
        await Document.delete(`workspaceId = ${Number(workspace.id)}`);
        await WorkspaceChats.delete(`workspaceId = ${Number(workspace.id)}`);
        try {
          await VectorDb["delete-namespace"]({ namespace: slug });
        } catch (e) {
          console.error(e.message);
        }
        response.sendStatus(200).end();
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // TODO
  app.post(
    "/v1/workspace/:slug/update",
    [validApiKey],
    async (request, response) => {}
  );
  app.get(
    "/v1/workspace/:slug/chats",
    [validApiKey],
    async (request, response) => {}
  );
  app.post(
    "/v1/workspace/:slug/update-embeddings",
    [validApiKey],
    async (request, response) => {}
  );
  app.post(
    "/v1/workspace/:slug/upload",
    [validApiKey],
    async (request, response) => {}
  );
}

module.exports = { apiWorkspaceEndpoints };

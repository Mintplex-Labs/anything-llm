const { v4: uuidv4 } = require("uuid");
const { Document } = require("../../../models/documents");
const { Telemetry } = require("../../../models/telemetry");
const { DocumentVectors } = require("../../../models/vectors");
const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  convertToChatHistory,
  chatWithWorkspace,
} = require("../../../utils/chats");
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
      const workspace = await Workspace.get({ slug });
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
        const workspace = await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        await WorkspaceChats.delete({ workspaceId: Number(workspace.id) });
        await DocumentVectors.deleteForWorkspace(Number(workspace.id));
        await Document.delete({ workspaceId: Number(workspace.id) });
        await Workspace.delete({ id: Number(workspace.id) });
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

  app.post(
    "/v1/workspace/:slug/update",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Workspaces']
    #swagger.description = 'Update workspace settings by its unique slug.'
    #swagger.path = '/v1/workspace/{slug}/update'
    #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Unique slug of workspace to find',
        required: true,
        type: 'string'
    }
    #swagger.requestBody = {
      description: 'JSON object containing new settings to update a workspace. All keys are optional and will not update unless provided',
      required: true,
      type: 'object',
      content: {
        "application/json": {
          example: {
            "name": 'Updated Workspace Name',
            "openAiTemp": 0.2,
            "openAiHistory": 20,
            "openAiPrompt": "Respond to all inquires and questions in binary - do not respond in any other format."
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
                "name": "My workspace",
                "slug": "my-workspace-123",
                "createdAt": "2023-08-17 00:45:03",
                "openAiTemp": null,
                "lastUpdatedAt": "2023-08-17 00:45:03",
                "openAiHistory": 20,
                "openAiPrompt": null,
                "documents": []
              },
              message: null,
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
        const { slug = null } = request.params;
        const data = reqBody(request);
        const currWorkspace = await Workspace.get({ slug });

        if (!currWorkspace) {
          response.sendStatus(400).end();
          return;
        }

        const { workspace, message } = await Workspace.update(
          currWorkspace.id,
          data
        );
        response.status(200).json({ workspace, message });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/workspace/:slug/chats",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Workspaces']
    #swagger.description = 'Get a workspaces chats regardless of user by its unique slug.'
    #swagger.path = '/v1/workspace/{slug}/chats'
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
              history: [
                {
                  "role": "user",
                  "content": "What is AnythingLLM?",
                  "sentAt": 1692851630
                },
                {
                  "role": "assistant",
                  "content": "AnythingLLM is a platform that allows you to convert notes, PDFs, and other source materials into a chatbot. It ensures privacy, cites its answers, and allows multiple people to interact with the same documents simultaneously. It is particularly useful for businesses to enhance the visibility and readability of various written communications such as SOPs, contracts, and sales calls. You can try it out with a free trial to see if it meets your business needs.",
                  "sources": [{"source": "object about source document and snippets used"}]
                }
              ]
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
        const workspace = await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const history = await WorkspaceChats.forWorkspace(workspace.id);
        response.status(200).json({ history: convertToChatHistory(history) });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/workspace/:slug/update-embeddings",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Workspaces']
    #swagger.description = 'Add or remove documents from a workspace by its unique slug.'
    #swagger.path = '/v1/workspace/{slug}/update-embeddings'
    #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Unique slug of workspace to find',
        required: true,
        type: 'string'
    }
    #swagger.requestBody = {
      description: 'JSON object of additions and removals of documents to add to update a workspace. The value should be the folder + filename with the exclusions of the top-level documents path.',
      required: true,
      type: 'object',
      content: {
        "application/json": {
          example: {
            adds: [],
            deletes: ["custom-documents/anythingllm-hash.json"]
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
                "name": "My workspace",
                "slug": "my-workspace-123",
                "createdAt": "2023-08-17 00:45:03",
                "openAiTemp": null,
                "lastUpdatedAt": "2023-08-17 00:45:03",
                "openAiHistory": 20,
                "openAiPrompt": null,
                "documents": []
              },
              message: null,
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
        const { slug = null } = request.params;
        const { adds = [], deletes = [] } = reqBody(request);
        const currWorkspace = await Workspace.get({ slug });

        if (!currWorkspace) {
          response.sendStatus(400).end();
          return;
        }

        await Document.removeDocuments(currWorkspace, deletes);
        await Document.addDocuments(currWorkspace, adds);
        const updatedWorkspace = await Workspace.get(
          `id = ${Number(currWorkspace.id)}`
        );
        response.status(200).json({ workspace: updatedWorkspace });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/workspace/:slug/chat",
    [validApiKey],
    async (request, response) => {
      /*
   #swagger.tags = ['Workspaces']
   #swagger.description = 'Execute a chat with a workspace'
   #swagger.requestBody = {
       description: 'prompt to send to the workspace and the type of conversation (query or chat).',
       required: true,
       type: 'object',
       content: {
         "application/json": {
           example: {
             message: "What is AnythingLLM?",
             mode: "query | chat"
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
              id: 'chat-uuid',
              type: "abort | textResponse",
              textResponse: "Response to your query",
              sources: [{title: "anythingllm.txt", chunk: "This is a context chunk used in the answer of the prompt by the LLM,"}],
              close: true,
              error: "null | text string of the failure mode."
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
        const { message, mode = "query" } = reqBody(request);
        const workspace = await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const result = await chatWithWorkspace(workspace, message, mode);
        await Telemetry.sendTelemetry("sent_chat", {
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          VectorDbSelection: process.env.VECTOR_DB || "pinecone",
        });
        response.status(200).json({ ...result });
      } catch (e) {
        response.status(500).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
      }
    }
  );
}

module.exports = { apiWorkspaceEndpoints };

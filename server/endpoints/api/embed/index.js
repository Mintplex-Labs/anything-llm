const { EmbedConfig } = require("../../../models/embedConfig");
const { EmbedChats } = require("../../../models/embedChats");
const { validApiKey } = require("../../../utils/middleware/validApiKey");

function apiEmbedEndpoints(app) {
  if (!app) return;

  app.get("/v1/embed", [validApiKey], async (request, response) => {
    /*
      #swagger.tags = ['Embed']
      #swagger.description = 'List all active embeds'
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                embeds: [
                  {
                    "id": 1,
                    "uuid": "embed-uuid-1",
                    "enabled": true,
                    "chat_mode": "query",
                    "createdAt": "2023-04-01T12:00:00Z",
                    "workspace": {
                      "id": 1,
                      "name": "Workspace 1"
                    },
                    "chat_count": 10
                  },
                  {
                    "id": 2,
                    "uuid": "embed-uuid-2",
                    "enabled": false,
                    "chat_mode": "chat",
                    "createdAt": "2023-04-02T14:30:00Z",
                    "workspace": {
                      "id": 1,
                      "name": "Workspace 1"
                    },
                    "chat_count": 10
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
      const embeds = await EmbedConfig.whereWithWorkspace();
      const filteredEmbeds = embeds.map((embed) => ({
        id: embed.id,
        uuid: embed.uuid,
        enabled: embed.enabled,
        chat_mode: embed.chat_mode,
        createdAt: embed.createdAt,
        workspace: {
          id: embed.workspace.id,
          name: embed.workspace.name,
        },
        chat_count: embed._count.embed_chats,
      }));
      response.status(200).json({ embeds: filteredEmbeds });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/v1/embed/:embedUuid/chats",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Embed']
      #swagger.description = 'Get all chats for a specific embed'
      #swagger.parameters['embedUuid'] = {
        in: 'path',
        description: 'UUID of the embed',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                chats: [
                  {
                    "id": 1,
                    "session_id": "session-uuid-1",
                    "prompt": "Hello",
                    "response": "Hi there!",
                    "createdAt": "2023-04-01T12:00:00Z"
                  },
                  {
                    "id": 2,
                    "session_id": "session-uuid-2",
                    "prompt": "How are you?",
                    "response": "I'm doing well, thank you!",
                    "createdAt": "2023-04-02T14:30:00Z"
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
      #swagger.responses[404] = {
        description: "Embed not found",
      }
    */
      try {
        const { embedUuid } = request.params;
        const embed = await EmbedConfig.get({ uuid: String(embedUuid) });
        if (!embed) {
          return response.status(404).json({ error: "Embed not found" });
        }

        const chats = await EmbedChats.where({ embed_id: embed.id });
        const formattedChats = chats.map((chat) => ({
          id: chat.id,
          session_id: chat.session_id,
          prompt: chat.prompt,
          response: chat.response,
          createdAt: chat.createdAt,
        }));

        response.status(200).json({ chats: formattedChats });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/embed/:embedUuid/chats/:sessionUuid",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Embed']
      #swagger.description = 'Get chats for a specific embed and session'
      #swagger.parameters['embedUuid'] = {
        in: 'path',
        description: 'UUID of the embed',
        required: true,
        type: 'string'
      }
      #swagger.parameters['sessionUuid'] = {
        in: 'path',
        description: 'UUID of the session',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                chats: [
                  {
                    "id": 1,
                    "prompt": "Hello",
                    "response": "Hi there!",
                    "createdAt": "2023-04-01T12:00:00Z"
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
      #swagger.responses[404] = {
        description: "Embed or session not found",
      }
    */
      try {
        const { embedUuid, sessionUuid } = request.params;
        const embed = await EmbedConfig.get({ uuid: String(embedUuid) });
        if (!embed) {
          return response.status(404).json({ error: "Embed not found" });
        }

        const chats = await EmbedChats.where({
          embed_id: embed.id,
          session_id: String(sessionUuid),
        });

        if (!chats || chats.length === 0) {
          return response
            .status(404)
            .json({ error: "No chats found for this session" });
        }

        const formattedChats = chats.map((chat) => ({
          id: chat.id,
          prompt: chat.prompt,
          response: chat.response,
          createdAt: chat.createdAt,
        }));

        response.status(200).json({ chats: formattedChats });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { apiEmbedEndpoints };

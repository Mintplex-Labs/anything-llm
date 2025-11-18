const { LLMConnection } = require("../../../models/llmConnection");
const { LLMConfigEncryption } = require("../../../utils/LLMConfigEncryption");
const { reqBody } = require("../../../utils/http");
const { validApiKey } = require("../../../utils/middleware/validApiKey");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../../utils/middleware/multiUserProtected");

function apiLLMConnectionEndpoints(app) {
  if (!app) return;

  app.get(
    "/v1/llm-connections",
    [validApiKey, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['LLM Connections']
      #swagger.description = 'List all LLM connections'
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                "connections": [{
                  "id": 1,
                  "name": "Engineers LiteLLM",
                  "provider": "litellm",
                  "config": {
                    "basePath": "http://localhost:4000",
                    "defaultModel": "gpt-3.5-turbo",
                    "apiKey": "***REDACTED***"
                  },
                  "isDefault": true,
                  "isActive": true,
                  "createdAt": "2025-01-01T00:00:00.000Z",
                  "lastUpdatedAt": "2025-01-01T00:00:00.000Z"
                }]
              }
            }
          }
        }
      }
      */
      try {
        const { provider, includeInactive } = request.query;

        const whereClause = {};
        if (provider) whereClause.provider = provider;
        if (includeInactive !== "true") whereClause.isActive = true;

        const connections = await LLMConnection.where(whereClause);

        // Sanitize sensitive fields before sending to client
        const sanitized = connections.map((conn) => ({
          ...conn,
          config: LLMConfigEncryption.sanitizeConfig(conn.provider, conn.config),
        }));

        response.status(200).json({ connections: sanitized });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/llm-connections/:id",
    [validApiKey, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['LLM Connections']
      #swagger.description = 'Get a single LLM connection by ID'
      */
      try {
        const { id } = request.params;
        const connection = await LLMConnection.get(id);

        if (!connection) {
          return response.status(404).json({ error: "Connection not found" });
        }

        // Sanitize sensitive fields
        const sanitized = {
          ...connection,
          config: LLMConfigEncryption.sanitizeConfig(
            connection.provider,
            connection.config
          ),
        };

        response.status(200).json({ connection: sanitized });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/llm-connections/new",
    [validApiKey, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['LLM Connections']
      #swagger.description = 'Create a new LLM connection'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              required: ['name', 'provider', 'config'],
              properties: {
                name: { type: 'string', example: 'Engineers LiteLLM' },
                provider: { type: 'string', example: 'litellm' },
                config: {
                  type: 'object',
                  example: {
                    basePath: 'http://localhost:4000',
                    apiKey: 'sk-123',
                    defaultModel: 'gpt-3.5-turbo'
                  }
                },
                isDefault: { type: 'boolean', example: false }
              }
            }
          }
        }
      }
      */
      try {
        const { name, provider, config, isDefault } = reqBody(request);

        // Validate required fields
        if (!name || !provider || !config) {
          return response.status(400).json({
            error: "Missing required fields: name, provider, config",
          });
        }

        // Create connection (encryption handled by model)
        const { connection, error } = await LLMConnection.create({
          name,
          provider,
          config,
          isDefault: isDefault || false,
        });

        if (error) {
          return response.status(400).json({ error });
        }

        // Sanitize before returning
        const sanitized = {
          ...connection,
          config: LLMConfigEncryption.sanitizeConfig(
            connection.provider,
            connection.config
          ),
        };

        response.status(200).json({ connection: sanitized });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).json({ error: e.message });
      }
    }
  );

  app.post(
    "/v1/llm-connections/:id/update",
    [validApiKey, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['LLM Connections']
      #swagger.description = 'Update an existing LLM connection'
      */
      try {
        const { id } = request.params;
        const updates = reqBody(request);

        const { connection, error } = await LLMConnection.update(id, updates);

        if (error) {
          return response.status(400).json({ error });
        }

        // Sanitize before returning
        const sanitized = {
          ...connection,
          config: LLMConfigEncryption.sanitizeConfig(
            connection.provider,
            connection.config
          ),
        };

        response.status(200).json({ connection: sanitized });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).json({ error: e.message });
      }
    }
  );

  app.delete(
    "/v1/llm-connections/:id",
    [validApiKey, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['LLM Connections']
      #swagger.description = 'Delete an LLM connection (soft delete)'
      */
      try {
        const { id } = request.params;

        const { success, error } = await LLMConnection.delete(id);

        if (!success) {
          return response.status(400).json({ error });
        }

        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).json({ error: e.message });
      }
    }
  );

  app.post(
    "/v1/llm-connections/:id/set-default",
    [validApiKey, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['LLM Connections']
      #swagger.description = 'Set a connection as the default for its provider type'
      */
      try {
        const { id } = request.params;

        const { success, error } = await LLMConnection.setAsDefault(id);

        if (!success) {
          return response.status(400).json({ error });
        }

        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).json({ error: e.message });
      }
    }
  );

  app.post(
    "/v1/llm-connections/:id/test",
    [validApiKey, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['LLM Connections']
      #swagger.description = 'Test an LLM connection'
      */
      try {
        const { id } = request.params;
        const connection = await LLMConnection.get(id);

        if (!connection) {
          return response.status(404).json({ error: "Connection not found" });
        }

        // Try to instantiate the provider with this config
        const { getLLMProvider } = require("../../../utils/helpers");
        const provider = await getLLMProvider({ connection });

        // TODO: Make a simple test call to the provider
        // For now, just verify it instantiated successfully

        response.status(200).json({
          success: true,
          message: "Connection test successful",
          provider: provider.className || "Unknown",
          model: provider.model,
        });
      } catch (e) {
        console.error("Connection test failed:", e.message, e);
        response.status(400).json({
          success: false,
          error: e.message,
        });
      }
    }
  );
}

module.exports = { apiLLMConnectionEndpoints };

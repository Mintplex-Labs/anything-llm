const { reqBody } = require("../utils/http");
const MCPCompatibilityLayer = require("../utils/MCP");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function mcpServersEndpoints(app) {
  if (!app) return;

  app.get(
    "/mcp-servers/force-reload",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.description = 'Force reload all MCP servers'
      #swagger.responses[200] = {
        description: 'OK',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: true,
                error: null,
                servers: []
              }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Internal Server Error',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: false,
                error: 'error message',
                servers: []
              }
            }
          }
        }
      }
      */
      try {
        const mcp = new MCPCompatibilityLayer();
        await mcp.reloadMCPServers();
        return response.status(200).json({
          success: true,
          error: null,
          servers: await mcp.servers(),
        });
      } catch (error) {
        console.error("Error force reloading MCP servers:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
          servers: [],
        });
      }
    }
  );

  app.get(
    "/mcp-servers/list",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.description = 'List all MCP servers'
      #swagger.responses[200] = {
        description: 'OK',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: true,
                servers: []
              }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Internal Server Error',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: false,
                error: 'error message'
              }
            }
          }
        }
      }
      */
      try {
        const servers = await new MCPCompatibilityLayer().servers();
        return response.status(200).json({
          success: true,
          servers,
        });
      } catch (error) {
        console.error("Error listing MCP servers:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  app.post(
    "/mcp-servers/toggle",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.description = 'Toggle MCP server status'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' }
              }
            }
          }
        }
      }
      #swagger.responses[200] = { description: 'OK' }
      #swagger.responses[500] = { description: 'Internal Server Error' }
      */
      try {
        const { name } = reqBody(request);
        const result = await new MCPCompatibilityLayer().toggleServerStatus(
          name
        );
        return response.status(200).json({
          success: result.success,
          error: result.error,
        });
      } catch (error) {
        console.error("Error toggling MCP server:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  app.post(
    "/mcp-servers/delete",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.description = 'Delete an MCP server'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' }
              }
            }
          }
        }
      }
      #swagger.responses[200] = { description: 'OK' }
      #swagger.responses[500] = { description: 'Internal Server Error' }
      */
      try {
        const { name } = reqBody(request);
        const result = await new MCPCompatibilityLayer().deleteServer(name);
        return response.status(200).json({
          success: result.success,
          error: result.error,
        });
      } catch (error) {
        console.error("Error deleting MCP server:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  app.post(
    "/mcp-servers/toggle-tool",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.description = 'Toggle an MCP server tool'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              required: ['serverName', 'toolName', 'enabled'],
              properties: {
                serverName: { type: 'string' },
                toolName: { type: 'string' },
                enabled: { type: 'boolean' }
              }
            }
          }
        }
      }
      #swagger.responses[200] = { description: 'OK' }
      #swagger.responses[500] = { description: 'Internal Server Error' }
      */
      try {
        const { serverName, toolName, enabled } = reqBody(request);
        const result = await new MCPCompatibilityLayer().toggleToolSuppression(
          serverName,
          toolName,
          enabled
        );
        return response.status(200).json({
          success: result.success,
          error: result.error,
          suppressedTools: result.suppressedTools,
        });
      } catch (error) {
        console.error("Error toggling MCP tool:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
          suppressedTools: [],
        });
      }
    }
  );

  app.post(
    "/mcp-servers/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.description = 'Add a new MCP server'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              required: ['name', 'server'],
              properties: {
                name: { type: 'string' },
                server: { type: 'object' },
                config: { type: 'object' }
              }
            }
          }
        }
      }
      #swagger.responses[200] = { description: 'OK' }
      #swagger.responses[400] = { description: 'Bad Request' }
      #swagger.responses[500] = { description: 'Internal Server Error' }
      */
      try {
        const body = reqBody(request);
        const name = body?.name;
        const serverConfig =
          body?.server ||
          body?.config ||
          (() => {
            if (!body?.name) return null;
            const { name: _n, ...rest } = body;
            return Object.keys(rest).length > 0 ? rest : null;
          })();

        if (!name || !serverConfig) {
          return response.status(400).json({
            success: false,
            error: "MCP server name and configuration are required.",
          });
        }

        const result = await new MCPCompatibilityLayer().addServer(
          name,
          serverConfig
        );
        return response.status(result.success ? 200 : 400).json({
          success: result.success,
          error: result.error,
        });
      } catch (error) {
        console.error("Error adding MCP server:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );
}

module.exports = { mcpServersEndpoints };

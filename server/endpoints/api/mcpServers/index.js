const MCPCompatibilityLayer = require("../../../utils/MCP");
const { reqBody } = require("../../../utils/http");
const { validApiKey } = require("../../../utils/middleware/validApiKey");

function apiMCPServerEndpoints(app) {
  if (!app) return;

  app.get("/v1/mcp-servers", [validApiKey], async (_, response) => {
    /*
    #swagger.tags = ['MCP Servers']
    #swagger.description = 'List all MCP servers in the config file with their status, config, and available tools. Will boot servers that have not been started yet.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              servers: [
                {
                  name: "my-mcp-server",
                  config: { command: "npx", args: ["-y", "@example/mcp-server"], anythingllm: { suppressedTools: [] } },
                  running: true,
                  tools: [{ name: "do-thing", description: "Does a thing", inputSchema: {} }],
                  error: null,
                  process: { pid: 12345 }
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
      const servers = await new MCPCompatibilityLayer().servers();
      response.status(200).json({ servers });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post("/v1/mcp-servers/new", [validApiKey], async (request, response) => {
    /*
    #swagger.tags = ['MCP Servers']
    #swagger.description = 'Add a new MCP server to the config file and start it. The server is saved even if it fails to start - check `running` and `startError` in the response.'
    #swagger.requestBody = {
      description: 'Name of the new server and its definition, in the same shape as an entry under mcpServers in the MCP config file.',
      required: true,
      content: {
        "application/json": {
          example: {
            name: "my-mcp-server",
            config: {
              command: "npx",
              args: ["-y", "@example/mcp-server"],
              env: { "API_KEY": "secret" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: { success: true, error: null, running: true, startError: null }
          }
        }
      }
    }
    #swagger.responses[400] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: { success: false, error: "MCP server my-mcp-server already exists in config file.", running: false, startError: null }
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
      const { name, config } = reqBody(request);
      const result = await new MCPCompatibilityLayer().saveServer(
        name,
        config,
        { create: true }
      );
      response.status(result.success ? 200 : 400).json(result);
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post("/v1/mcp-servers/reload", [validApiKey], async (_, response) => {
    /*
    #swagger.tags = ['MCP Servers']
    #swagger.description = 'Stop all MCP servers and boot them again from the config file.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: { servers: [] }
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
      const mcp = new MCPCompatibilityLayer();
      await mcp.reloadMCPServers();
      response.status(200).json({ servers: await mcp.servers() });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post(
    "/v1/mcp-servers/:name/update",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.parameters['name'] = {
        in: 'path',
        description: 'Name of the MCP server in the config file.',
        required: true,
        type: 'string'
      }
      #swagger.description = 'Replace the definition of an existing MCP server and restart it. The config fully replaces the old one - include the `anythingllm` block to keep settings like suppressedTools.'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            example: {
              config: {
                type: "streamable",
                url: "https://example.com/mcp",
                headers: { "Authorization": "Bearer token" },
                anythingllm: { suppressedTools: [] }
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: { success: true, error: null, running: true, startError: null }
            }
          }
        }
      }
      #swagger.responses[400] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: { success: false, error: "MCP server my-mcp-server not found in config file.", running: false, startError: null }
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
        const { name } = request.params;
        const { config } = reqBody(request);
        const result = await new MCPCompatibilityLayer().saveServer(
          name,
          config,
          { create: false }
        );
        response.status(result.success ? 200 : 400).json(result);
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/mcp-servers/:name/toggle",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.parameters['name'] = {
        in: 'path',
        description: 'Name of the MCP server in the config file.',
        required: true,
        type: 'string'
      }
      #swagger.description = 'Stop the MCP server if it is running, otherwise start it.'
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: { success: true, error: null }
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
        const { name } = request.params;
        const { success, error } =
          await new MCPCompatibilityLayer().toggleServerStatus(name);
        response
          .status(success ? 200 : 400)
          .json({ success, error: error ?? null });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/mcp-servers/:name/toggle-tool",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['MCP Servers']
      #swagger.parameters['name'] = {
        in: 'path',
        description: 'Name of the MCP server in the config file.',
        required: true,
        type: 'string'
      }
      #swagger.description = 'Enable or disable a single tool of an MCP server. Disabled tools are not given to agents.'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            example: { toolName: "do-thing", enabled: false }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: { success: true, error: null, suppressedTools: ["do-thing"] }
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
        const { name } = request.params;
        const { toolName, enabled } = reqBody(request);
        if (typeof toolName !== "string" || !toolName) {
          response.status(400).json({
            success: false,
            error: "toolName is required.",
            suppressedTools: [],
          });
          return;
        }
        if (typeof enabled !== "boolean") {
          response.status(400).json({
            success: false,
            error: "enabled must be a boolean.",
            suppressedTools: [],
          });
          return;
        }

        const result = await new MCPCompatibilityLayer().toggleToolSuppression(
          name,
          toolName,
          enabled
        );
        response.status(result.success ? 200 : 400).json(result);
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/v1/mcp-servers/:name",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['MCP Servers']
    #swagger.parameters['name'] = {
      in: 'path',
      description: 'Name of the MCP server in the config file.',
      required: true,
      type: 'string'
    }
    #swagger.description = 'Stop the MCP server and remove it from the config file.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: { success: true, error: null }
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
        const { name } = request.params;
        const { success, error } =
          await new MCPCompatibilityLayer().deleteServer(name);
        response
          .status(success ? 200 : 400)
          .json({ success, error: error ?? null });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { apiMCPServerEndpoints };

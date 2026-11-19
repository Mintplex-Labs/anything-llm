const { validApiKey } = require("../../../utils/middleware/validApiKey");
const { ApiKey } = require("../../../models/apiKeys");
const { Workspace } = require("../../../models/workspace");

function apiAuthEndpoints(app) {
  if (!app) return;

  app.get("/v1/auth", [validApiKey], async (_, response) => {
    /* 
    #swagger.tags = ['Authentication']
    #swagger.description = 'Verify the attached Authentication header contains a valid API token. Returns the scopes the key holds and the workspaces it is limited to. `workspaces` is null when the key can access every workspace.'
    #swagger.responses[200] = {
      description: 'Valid auth token was found.',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              authenticated: true,
              scopes: ["chat", "documents"],
              workspaces: [{ id: 1, name: "My workspace", slug: "my-workspace" }],
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
    const { apiKey } = response.locals;
    const workspaces =
      ApiKey.workspaceIds(apiKey) === null
        ? null
        : await Workspace._findMany({
            where: ApiKey.workspaceClause(apiKey),
            select: { id: true, name: true, slug: true },
          });
    response.status(200).json({
      authenticated: true,
      scopes: ApiKey.scopesOf(apiKey),
      workspaces,
    });
  });
}

module.exports = { apiAuthEndpoints };

const {
  validApiKey,
  apiKeyScope,
  SCOPES,
} = require("../../../utils/middleware/validApiKey");

function apiAuthEndpoints(app) {
  if (!app) return;

  app.get(
    "/v1/auth",
    [validApiKey, apiKeyScope([SCOPES.workspace, SCOPES.user])],
    (_, response) => {
      /* 
    #swagger.tags = ['Authentication']
    #swagger.description = 'Verify the attached Authentication header contains a valid API token.'
    #swagger.responses[200] = {
      description: 'Valid auth token was found.',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              authenticated: true,
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
      response.status(200).json({ authenticated: true });
    }
  );
}

module.exports = { apiAuthEndpoints };

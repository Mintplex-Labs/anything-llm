const { User } = require("../../../models/user");
const { multiUserMode } = require("../../../utils/http");
const { validApiKey } = require("../../../utils/middleware/validApiKey");

function apiAdminEndpoints(app) {
  if (!app) return;

  app.get("/v1/admin/is-multi-user-mode", [validApiKey], (_, response) => {
    /* 
    #swagger.tags = ['Admin']
    #swagger.description = 'Check to see if the instance is in multi-user-mode first. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "isMultiUser": true
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
    const isMultiUser = multiUserMode(response);
    response.status(200).json({ isMultiUser });
  });

  app.get("/v1/admin/users", [validApiKey], async (request, response) => {
    /* 
    #swagger.tags = ['Admin']
    #swagger.description = 'Check to see if the instance is in multi-user-mode first. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "users": [
                {
                  username: "sample-sam",
                  role: 'default',
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
     #swagger.responses[401] = {
      description: "Instance is not in Multi-User mode. Method denied",
    }
    */
    try {
      if (!multiUserMode(response)) {
        response.sendStatus(401).end();
        return;
      }

      const users = (await User.where()).map((user) => {
        const { password, ...rest } = user;
        return rest;
      });
      response.status(200).json({ users });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  // Todo
  app.get(
    "/v1/admin/users/new",
    [validApiKey],
    async (request, response) => {}
  );
  app.post(
    "/v1/admin/users/:id",
    [validApiKey],
    async (request, response) => {}
  );
  app.delete(
    "/v1/admin/users/:id",
    [validApiKey],
    async (request, response) => {}
  );

  app.get("/v1/admin/invites", [validApiKey], async (request, response) => {});
  app.post(
    "/v1/admin/invite/new",
    [validApiKey],
    async (request, response) => {}
  );
  app.delete(
    "/v1/admin/invite/:id",
    [validApiKey],
    async (request, response) => {}
  );

  app.post(
    "/v1/admin/workspaces/:workspaceId/update-users",
    [validApiKey],
    async (request, response) => {}
  );
  app.delete(
    "/v1/admin/workspace-chats/:id",
    [validApiKey],
    async (request, response) => {}
  );

  app.get(
    "/v1/admin/preferences",
    [validApiKey],
    async (request, response) => {}
  );
  app.post(
    "/v1/admin/preferences",
    [validApiKey],
    async (request, response) => {}
  );
}

module.exports = { apiAdminEndpoints };

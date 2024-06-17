const { User } = require("../../../models/user");
const { multiUserMode } = require("../../../utils/http");
const { validApiKey } = require("../../../utils/middleware/validApiKey");

function apiUserManagementEndpoints(app) {
  if (!app) return;

  app.get("/v1/users", [validApiKey], async (request, response) => {
    /*
      #swagger.tags = ['User Management']
      #swagger.description = 'List all users'
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                users: [
                  {
                    "id": 1,
                    "username": "john_doe",
                    "role": "admin"
                  },
                  {
                    "id": 2,
                    "username": "jane_smith",
                    "role": "default"
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
      description: "Instance is not in Multi-User mode. Permission denied.",
    }
      */
    try {
      if (!multiUserMode(response))
        return response
          .status(401)
          .send("Instance is not in Multi-User mode. Permission denied.");

      const users = await User.where();
      const filteredUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
      }));
      response.status(200).json({ users: filteredUsers });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { apiUserManagementEndpoints };

const { validApiKey } = require("../../../utils/middleware/validApiKey");
const { SystemSettings } = require("../../../models/systemSettings");
const { AzureAuthProviders } = require("../../../utils/AzureAuthProviders");
const { User } = require("../../../models/user");
const { EventLogs } = require("../../../models/eventLogs");
const { Telemetry } = require("../../../models/telemetry");

const {
  reqBody,
  makeJWT,
} = require("../../../utils/http");

function apiAuthEndpoints(app) {
  if (!app) return;

  app.get("/v1/auth", [validApiKey], (_, response) => {
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
  });

  app.post("/v1/auth/azure", async (request, response) => {
    /* 
    #swagger.tags = ['Authentication']
    #swagger.description = 'Verify the Azure Authentication header contains a valid API token.'
    #swagger.requestBody = {
        required: true,
        type: 'object',
        content: {
          "application/json": {
            example: {
              accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0a...'
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
      "valid": true,
      "user": {
                "id": 2,
                "username": "useremail@company.com",
                "use_azure_login_provider": true,
                "pfpFilename": null,
                "role": "default",
                "suspended": 0,
                "seen_recovery_codes": false,
                "createdAt": "2024-08-13T11:31:34.590Z",
                "lastUpdatedAt": "2024-08-13T11:31:34.590Z"
              },
              "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0a...",
              "message": null
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
      if (!(await SystemSettings.isMultiUserMode())) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "Azure login is available on multi-user mode",
        });
        return;
      }

      const data = reqBody(request);
      const azureAuthProviders = new AzureAuthProviders();
      const { username, error } = await azureAuthProviders.login(data);
      if (error) {
        await EventLogs.logEvent(
          "failed_login_error_get_user",
          {
            ip: request.ip || "Unknown IP",
            username: username || "Unknown user",
          },
          null
        );
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: error,
        });
        return;
      }

      let user = await User.get({ username: String(username) });

      if (!user) {
        const { user: newUser, error } = await User.createWithAzureAuthProviders({
          username: String(username),
        });
        if (!newUser) {
          await EventLogs.logEvent(
            "failed_login_error_creating_user",
            {
              ip: request.ip || "Unknown IP",
              username: username || "Unknown user",
            },
            user?.id
          );
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: error,
          });
          return;
        }
        await EventLogs.logEvent(
          "user_created",
          {
            userName: newUser.username,
            createdBy: newUser.username,
          },
          newUser.id
        );
        user = newUser;
      }

      if (user.suspended) {
        await EventLogs.logEvent(
          "failed_login_account_suspended",
          {
            ip: request.ip || "Unknown IP",
            username: username || "Unknown user",
          },
          user?.id
        );
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[004] Account suspended by admin.",
        });
        return;
      }

      await Telemetry.sendTelemetry(
        "login_event",
        { multiUserMode: false },
        user?.id
      );

      await EventLogs.logEvent(
        "login_event",
        {
          ip: request.ip || "Unknown IP",
          username: user.username || "Unknown user",
        },
        user?.id
      );

      response.status(200).json({
        valid: true,
        user: user,
        token: makeJWT({ id: user.id, username: user.username }, "30d"),
        message: null,
      });
      return;
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { apiAuthEndpoints };

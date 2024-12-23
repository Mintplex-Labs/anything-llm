const { EventLogs } = require("../../../models/eventLogs");
const { Invite } = require("../../../models/invite");
const { SystemSettings } = require("../../../models/systemSettings");
const { User } = require("../../../models/user");
const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { WorkspaceUser } = require("../../../models/workspaceUsers");
const { canModifyAdmin } = require("../../../utils/helpers/admin");
const { multiUserMode, reqBody } = require("../../../utils/http");
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

      const users = await User.where();
      response.status(200).json({ users });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.post("/v1/admin/users/new", [validApiKey], async (request, response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.description = 'Create a new user with username and password. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.requestBody = {
        description: 'Key pair object that will define the new user to add to the system.',
        required: true,
        content: {
          "application/json": {
            example: {
              username: "sample-sam",
              password: 'hunter2',
              role: 'default | admin'
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
              user: {
                id: 1,
                username: 'sample-sam',
                role: 'default',
              },
              error: null,
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

      const newUserParams = reqBody(request);
      const { user: newUser, error } = await User.create(newUserParams);
      response.status(newUser ? 200 : 400).json({ user: newUser, error });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.post("/v1/admin/users/:id", [validApiKey], async (request, response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'id of the user in the database.',
      required: true,
      type: 'string'
    }
    #swagger.description = 'Update existing user settings. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.requestBody = {
        description: 'Key pair object that will update the found user. All fields are optional and will not update unless specified.',
        required: true,
        content: {
          "application/json": {
            example: {
              username: "sample-sam",
              password: 'hunter2',
              role: 'default | admin',
              suspended: 0,
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
              success: true,
              error: null,
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

      const { id } = request.params;
      const updates = reqBody(request);
      const user = await User.get({ id: Number(id) });
      const validAdminRoleModification = await canModifyAdmin(user, updates);

      if (!validAdminRoleModification.valid) {
        response
          .status(200)
          .json({ success: false, error: validAdminRoleModification.error });
        return;
      }

      const { success, error } = await User.update(id, updates);
      response.status(200).json({ success, error });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.delete(
    "/v1/admin/users/:id",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Admin']
    #swagger.description = 'Delete existing user by id. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'id of the user in the database.',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              success: true,
              error: null,
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

        const { id } = request.params;
        const user = await User.get({ id: Number(id) });
        await User.delete({ id: user.id });
        await EventLogs.logEvent("api_user_deleted", {
          userName: user.username,
        });
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get("/v1/admin/invites", [validApiKey], async (request, response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.description = 'List all existing invitations to instance regardless of status. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "invites": [
                {
                  id: 1,
                  status: "pending",
                  code: 'abc-123',
                  claimedBy: null
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

      const invites = await Invite.whereWithUsers();
      response.status(200).json({ invites });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.post("/v1/admin/invite/new", [validApiKey], async (request, response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.description = 'Create a new invite code for someone to use to register with instance. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.requestBody = {
        description: 'Request body for creation parameters of the invitation',
        required: false,
        content: {
          "application/json": {
            example: {
              workspaceIds: [1,2,45],
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
              invite: {
                id: 1,
                status: "pending",
                code: 'abc-123',
              },
              error: null,
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

      const body = reqBody(request);
      const { invite, error } = await Invite.create({
        workspaceIds: body?.workspaceIds ?? [],
      });
      response.status(200).json({ invite, error });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.delete(
    "/v1/admin/invite/:id",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Admin']
    #swagger.description = 'Deactivates (soft-delete) invite by id. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'id of the invite in the database.',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              success: true,
              error: null,
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

        const { id } = request.params;
        const { success, error } = await Invite.deactivate(id);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/admin/workspaces/:workspaceId/users",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Admin']
      #swagger.parameters['workspaceId'] = {
        in: 'path',
        description: 'id of the workspace.',
        required: true,
        type: 'string'
      }
      #swagger.description = 'Retrieve a list of users with permissions to access the specified workspace.'
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                users: [
                  {"userId": 1, "role": "admin"},
                  {"userId": 2, "role": "member"}
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

        const workspaceId = request.params.workspaceId;
        const users = await Workspace.workspaceUsers(workspaceId);

        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/admin/workspaces/:workspaceId/update-users",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Admin']
    #swagger.deprecated = true
    #swagger.parameters['workspaceId'] = {
      in: 'path',
      description: 'id of the workspace in the database.',
      required: true,
      type: 'string'
    }
    #swagger.description = 'Overwrite workspace permissions to only be accessible by the given user ids and admins. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.requestBody = {
        description: 'Entire array of user ids who can access the workspace. All fields are optional and will not update unless specified.',
        required: true,
        content: {
          "application/json": {
            example: {
              userIds: [1,2,4,12],
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
              success: true,
              error: null,
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

        const { workspaceId } = request.params;
        const { userIds } = reqBody(request);
        const { success, error } = await Workspace.updateUsers(
          workspaceId,
          userIds
        );
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/admin/workspaces/:workspaceSlug/manage-users",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Admin']
    #swagger.parameters['workspaceSlug'] = {
      in: 'path',
      description: 'slug of the workspace in the database',
      required: true,
      type: 'string'
    }
    #swagger.description = 'Set workspace permissions to be accessible by the given user ids and admins. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.requestBody = {
        description: 'Array of user ids who will be given access to the target workspace. <code>reset</code> will remove all existing users from the workspace and only add the new users - default <code>false</code>.',
        required: true,
        content: {
          "application/json": {
            example: {
              userIds: [1,2,4,12],
              reset: false
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
              success: true,
              error: null,
              users: [
                {"userId": 1, "username": "main-admin", "role": "admin"},
                {"userId": 2, "username": "sample-sam", "role": "default"}
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

        const { workspaceSlug } = request.params;
        const { userIds: _uids, reset = false } = reqBody(request);
        const userIds = (
          await User.where({ id: { in: _uids.map(Number) } })
        ).map((user) => user.id);
        const workspace = await Workspace.get({ slug: String(workspaceSlug) });
        const workspaceUsers = await Workspace.workspaceUsers(workspace.id);

        if (!workspace) {
          response.status(404).json({
            success: false,
            error: `Workspace ${workspaceSlug} not found`,
            users: workspaceUsers,
          });
          return;
        }

        if (userIds.length === 0) {
          response.status(404).json({
            success: false,
            error: `No valid user IDs provided.`,
            users: workspaceUsers,
          });
          return;
        }

        // Reset all users in the workspace and add the new users as the only users in the workspace
        if (reset) {
          const { success, error } = await Workspace.updateUsers(
            workspace.id,
            userIds
          );
          return response.status(200).json({
            success,
            error,
            users: await Workspace.workspaceUsers(workspace.id),
          });
        }

        // Add new users to the workspace if they are not already in the workspace
        const existingUserIds = workspaceUsers.map((user) => user.userId);
        const usersToAdd = userIds.filter(
          (userId) => !existingUserIds.includes(userId)
        );
        if (usersToAdd.length > 0)
          await WorkspaceUser.createManyUsers(usersToAdd, workspace.id);
        response.status(200).json({
          success: true,
          error: null,
          users: await Workspace.workspaceUsers(workspace.id),
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/admin/workspace-chats",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Admin']
    #swagger.description = 'All chats in the system ordered by most recent. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.requestBody = {
        description: 'Page offset to show of workspace chats. All fields are optional and will not update unless specified.',
        required: false,
        content: {
          "application/json": {
            example: {
              offset: 2,
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
              success: true,
              error: null,
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
        const pgSize = 20;
        const { offset = 0 } = reqBody(request);
        const chats = await WorkspaceChats.whereWithData(
          {},
          pgSize,
          offset * pgSize,
          { id: "desc" }
        );

        const hasPages = (await WorkspaceChats.count()) > (offset + 1) * pgSize;
        response.status(200).json({ chats: chats, hasPages });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/admin/preferences",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Admin']
    #swagger.description = 'Update multi-user preferences for instance. Methods are disabled until multi user mode is enabled via the UI.'
    #swagger.requestBody = {
      description: 'Object with setting key and new value to set. All keys are optional and will not update unless specified.',
      required: true,
      content: {
        "application/json": {
          example: {
            support_email: "support@example.com",
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
              success: true,
              error: null,
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

        const updates = reqBody(request);
        await SystemSettings.updateSettings(updates);
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { apiAdminEndpoints };

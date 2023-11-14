const { ApiKey } = require("../models/apiKeys");
const { Document } = require("../models/documents");
const { Invite } = require("../models/invite");
const { SystemSettings } = require("../models/systemSettings");
const { User } = require("../models/user");
const { DocumentVectors } = require("../models/vectors");
const { Workspace } = require("../models/workspace");
const { WorkspaceChats } = require("../models/workspaceChats");
const { getVectorDbClass } = require("../utils/helpers");
const { reqBody, userFromSession } = require("../utils/http");
const {
  strictMultiUserRoleValid,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function adminEndpoints(app) {
  if (!app) return;

  app.get(
    "/admin/users",
    [validatedRequest, strictMultiUserRoleValid],
    async (_request, response) => {
      try {
        const users = (await User.where()).map((user) => {
          const { password, ...rest } = user;
          return rest;
        });
        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/users/new",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const newUserParams = reqBody(request);
        const { user: newUser, error } = await User.create(newUserParams);
        response.status(200).json({ user: newUser, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const { id } = request.params;
        const updates = reqBody(request);
        const user = await User.get({ id: Number(id) });

        // Check to make sure with this update that includes a role change to
        // something other than admin that we still have at least one admin left.
        if (
          updates.hasOwnProperty("role") && // has admin prop to change
          updates.role !== "admin" && // and we are changing to non-admin
          user.role === "admin" // and they currently are an admin
        ) {
          const adminCount = await User.count({ role: "admin" });
          if (adminCount - 1 <= 0) {
            response
              .status(200)
              .json({
                success: false,
                error:
                  "No system admins will remain if you do this. Update failed.",
              });
            return;
          }
        }

        const { success, error } = await User.update(id, updates);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const { id } = request.params;
        await User.delete({ id: Number(id) });
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/invites",
    [validatedRequest, strictMultiUserRoleValid],
    async (_request, response) => {
      try {
        const invites = await Invite.whereWithUsers();
        response.status(200).json({ invites });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/invite/new",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { invite, error } = await Invite.create(user.id);
        response.status(200).json({ invite, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/invite/:id",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
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
    "/admin/workspaces",
    [validatedRequest, strictMultiUserRoleValid],
    async (_request, response) => {
      try {
        const workspaces = await Workspace.whereWithUsers();
        response.status(200).json({ workspaces });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/workspaces/new",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { name } = reqBody(request);
        const { workspace, message: error } = await Workspace.new(
          name,
          user.id
        );
        response.status(200).json({ workspace, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/workspaces/:workspaceId/update-users",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
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

  app.delete(
    "/admin/workspaces/:id",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const { id } = request.params;
        const VectorDb = getVectorDbClass();
        const workspace = await Workspace.get({ id: Number(id) });
        if (!workspace) {
          response.sendStatus(404).end();
          return;
        }

        await WorkspaceChats.delete({ workspaceId: Number(workspace.id) });
        await DocumentVectors.deleteForWorkspace(Number(workspace.id));
        await Document.delete({ workspaceId: Number(workspace.id) });
        await Workspace.delete({ id: Number(workspace.id) });
        try {
          await VectorDb["delete-namespace"]({ namespace: workspace.slug });
        } catch (e) {
          console.error(e.message);
        }

        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/system-preferences",
    [validatedRequest, strictMultiUserRoleValid],
    async (_request, response) => {
      try {
        const settings = {
          users_can_delete_workspaces:
            (await SystemSettings.get({ label: "users_can_delete_workspaces" }))
              ?.value === "true",
          limit_user_messages:
            (await SystemSettings.get({ label: "limit_user_messages" }))
              ?.value === "true",
          message_limit:
            Number(
              (await SystemSettings.get({ label: "message_limit" }))?.value
            ) || 10,
        };
        response.status(200).json({ settings });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/system-preferences",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const updates = reqBody(request);
        await SystemSettings.updateSettings(updates);
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/api-keys",
    [validatedRequest, strictMultiUserRoleValid],
    async (_request, response) => {
      try {
        const apiKeys = await ApiKey.whereWithUser({});
        return response.status(200).json({
          apiKeys,
          error: null,
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          apiKey: null,
          error: "Could not find an API Keys.",
        });
      }
    }
  );

  app.post(
    "/admin/generate-api-key",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { apiKey, error } = await ApiKey.create(user.id);
        return response.status(200).json({
          apiKey,
          error,
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/delete-api-key/:id",
    [validatedRequest, strictMultiUserRoleValid],
    async (request, response) => {
      try {
        const { id } = request.params;
        await ApiKey.delete({ id: Number(id) });
        return response.status(200).end();
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { adminEndpoints };

const { escape } = require("sqlstring-sqlite");
const { ApiKey } = require("../models/apiKeys");
const { Document } = require("../models/documents");
const { Invite } = require("../models/invite");
const { SystemSettings } = require("../models/systemSettings");
const { User } = require("../models/user");
const { DocumentVectors } = require("../models/vectors");
const { Workspace } = require("../models/workspace");
const { WorkspaceChats } = require("../models/workspaceChats");
const { getVectorDbClass } = require("../utils/helpers");
const { userFromSession, reqBody } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function adminEndpoints(app) {
  if (!app) return;

  app.get("/admin/users", [validatedRequest], async (request, response) => {
    try {
      const user = await userFromSession(request, response);
      if (!user || user?.role !== "admin") {
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

  app.post(
    "/admin/users/new",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

        const newUserParams = reqBody(request);
        const { user: newUser, error } = await User.create(newUserParams);
        response.status(200).json({ user: newUser, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post("/admin/user/:id", [validatedRequest], async (request, response) => {
    try {
      const user = await userFromSession(request, response);
      if (!user || user?.role !== "admin") {
        response.sendStatus(401).end();
        return;
      }

      const { id } = request.params;
      const updates = reqBody(request);
      const { success, error } = await User.update(id, updates);
      response.status(200).json({ success, error });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.delete(
    "/admin/user/:id",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }
        const { id } = request.params;
        await User.delete(`id = ${id}`);
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get("/admin/invites", [validatedRequest], async (request, response) => {
    try {
      const user = await userFromSession(request, response);
      if (!user || user?.role !== "admin") {
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

  app.get(
    "/admin/invite/new",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

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
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
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
    "/admin/workspaces",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }
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
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }
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
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

        const { workspaceId } = request.params;
        const { userIds } = reqBody(request);
        const { success, error } = await Workspace.updateUsers(
          escape(workspaceId),
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
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

        const { id } = request.params;
        const VectorDb = getVectorDbClass();
        const workspace = Workspace.get(`id = ${escape(id)}`);
        if (!workspace) {
          response.sendStatus(404).end();
          return;
        }

        await Workspace.delete(`id = ${workspace.id}`);
        await DocumentVectors.deleteForWorkspace(workspace.id);
        await Document.delete(`workspaceId = ${Number(workspace.id)}`);
        await WorkspaceChats.delete(`workspaceId = ${Number(workspace.id)}`);
        try {
          await VectorDb["delete-namespace"]({ namespace: workspace.slug });
        } catch (e) {
          console.error(e.message);
        }

        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/workspace-chats",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }
        const { offset = 0 } = reqBody(request);
        const chats = await WorkspaceChats.whereWithData(
          `id >= ${escape(offset)}`,
          20
        );
        const hasPages = (await WorkspaceChats.count()) > 20;
        response.status(200).json({ chats: chats.reverse(), hasPages });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/workspace-chats/:id",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

        const { id } = request.params;
        await WorkspaceChats.delete(`id = ${id}`);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/system-preferences",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

        const settings = {
          users_can_delete_workspaces:
            (await SystemSettings.get(`label = 'users_can_delete_workspaces'`))
              ?.value === "true",
          limit_user_messages:
            (await SystemSettings.get(`label = 'limit_user_messages'`))
              ?.value === "true",
          message_limit:
            Number(
              (await SystemSettings.get(`label = 'message_limit'`))?.value
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
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
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

  app.get("/admin/api-keys", [validatedRequest], async (request, response) => {
    try {
      const user = await userFromSession(request, response);
      if (!user || user?.role !== "admin") {
        response.sendStatus(401).end();
        return;
      }

      const apiKeys = await ApiKey.whereWithUser("id IS NOT NULL");
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
  });

  app.post(
    "/admin/generate-api-key",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

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
    [validatedRequest],
    async (request, response) => {
      try {
        const { id } = request.params;
        const user = await userFromSession(request, response);
        if (!user || user?.role !== "admin") {
          response.sendStatus(401).end();
          return;
        }

        await ApiKey.delete(`id = ${id}`);
        return response.status(200).end();
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { adminEndpoints };

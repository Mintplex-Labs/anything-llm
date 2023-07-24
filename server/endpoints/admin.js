const { Invite } = require("../models/invite");
const { User } = require("../models/user");
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
}

module.exports = { adminEndpoints };

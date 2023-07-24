const { Invite } = require("../models/invite");
const { User } = require("../models/user");
const { reqBody } = require("../utils/http");

function inviteEndpoints(app) {
  if (!app) return;

  app.get("/invite/:code", async (request, response) => {
    try {
      const { code } = request.params;
      const invite = await Invite.get(`code = '${code}'`);
      if (!invite) {
        response.status(200).json({ invite: null, error: "Invite not found." });
        return;
      }

      if (invite.status !== "pending") {
        response
          .status(200)
          .json({ invite: null, error: "Invite is no longer valid." });
        return;
      }

      response
        .status(200)
        .json({ invite: { code, status: invite.status }, error: null });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.post("/invite/:code", async (request, response) => {
    try {
      const { code } = request.params;
      const userParams = reqBody(request);
      const invite = await Invite.get(`code = '${code}'`);
      if (!invite || invite.status !== "pending") {
        response
          .status(200)
          .json({ success: false, error: "Invite not found or is invalid." });
        return;
      }

      const { user, error } = await User.create(userParams);
      if (!user) {
        console.error("Accepting invite:", error);
        response
          .status(200)
          .json({ success: false, error: "Could not create user." });
        return;
      }

      await Invite.markClaimed(invite.id, user);
      response.status(200).json({ success: true, error: null });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { inviteEndpoints };

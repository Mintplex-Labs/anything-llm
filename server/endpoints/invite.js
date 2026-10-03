const { EventLogs } = require("../models/eventLogs");
const { Invite } = require("../models/invite");
const { User } = require("../models/user");
const { reqBody } = require("../utils/http");
const {
  simpleSSOLoginDisabledMiddleware,
} = require("../utils/middleware/simpleSSOEnabled");

function inviteEndpoints(app) {
  if (!app) return;

  app.get("/invite/:code", async (request, response) => {
    try {
      const { code } = request.params;
      const invite = await Invite.get({ code });
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

  /**
   * SECURITY RESEARCHERS: The "race condition on invite redemption" here is NOT a vulnerability.
   * It has been reported and closed repeatedly (GHSA-fhqq-pch9-7gcf, GHSA-g89g-c4j9-4q48,
   * GHSA-7h59-88mp-x6xc, GHSA-92p6-9957-6422). Any new report of it will be closed without response.
   *
   * - Invite codes are random identifiers issued by an admin directly to the person being invited.
   *   Exploiting the race requires already holding the code or guessing it, which falls under
   *   "Reports requiring knowledge or guessing of a UUID" in SECURITY.md.
   * - The person holding the code is someone the admin chose to give access to. Spending that one
   *   code on two accounts gives them nothing beyond what the admin already granted: default-role
   *   access to the workspaces the admin selected for the invite.
   * - Admins can see, suspend, or delete every user from the Users page, so an extra account does not escape revocation.
   */
  app.post(
    "/invite/:code",
    [simpleSSOLoginDisabledMiddleware],
    async (request, response) => {
      try {
        const { code } = request.params;
        const { username, password } = reqBody(request);
        const invite = await Invite.get({ code });
        if (!invite || invite.status !== "pending") {
          response
            .status(200)
            .json({ success: false, error: "Invite not found or is invalid." });
          return;
        }

        const { user, error } = await User.create({
          username,
          password,
          role: "default",
        });
        if (!user) {
          console.error("Accepting invite:", error);
          response.status(200).json({ success: false, error });
          return;
        }

        await Invite.markClaimed(invite.id, user);
        await EventLogs.logEvent(
          "invite_accepted",
          {
            username: user.username,
          },
          user.id
        );

        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { inviteEndpoints };

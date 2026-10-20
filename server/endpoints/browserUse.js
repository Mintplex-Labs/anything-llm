const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { userFromSession } = require("../utils/http");
const { User } = require("../models/user");
const {
  BrowserTraces,
} = require("../utils/agents/aibitat/plugins/browser-use/traces");
const {
  BrowserDriver,
} = require("../utils/agents/aibitat/plugins/browser-use/driver");
const {
  BrowserProfiles,
} = require("../utils/agents/aibitat/plugins/browser-use/driver/profiles");

/** DISABLE_VIEW_CHAT_HISTORY hides chat history from admins - other people's browser sessions too. */
function historyHidden() {
  return "DISABLE_VIEW_CHAT_HISTORY" in process.env;
}

/** userId -> username for the given ids (users that no longer exist are left out). */
async function usernames(ids = []) {
  const unique = [
    ...new Set(ids.filter((id) => id !== null && id !== undefined)),
  ];
  if (!unique.length) return new Map();
  const users = await User.where({ id: { in: unique.map(Number) } });
  return new Map(users.map((user) => [user.id, user.username]));
}

/** Session history and saved browser profiles of the browser-use agent skill. */
function browserUseEndpoints(app) {
  if (!app) return;
  const adminOnly = [validatedRequest, flexUserRoleValid([ROLES.admin])];

  app.get("/browser-use/traces", adminOnly, async (_request, response) => {
    try {
      if (historyHidden())
        return response.status(200).json({ traces: [], hidden: true });
      const traces = BrowserTraces.list();
      const names = await usernames(traces.map((trace) => trace.userId));
      response.status(200).json({
        traces: traces.map((trace) => ({
          ...trace,
          username: names.get(trace.userId) ?? null,
        })),
        hidden: false,
      });
    } catch (e) {
      console.error(e);
      response.status(500).json({ traces: [], error: e.message });
    }
  });

  // The chat card opens its own session, so whoever ran it may read it - admins may read any,
  // unless chat history is hidden from them.
  app.get(
    "/browser-use/traces/:id",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      const trace = BrowserTraces.get(request.params.id);
      const user = await userFromSession(request, response);
      const allowed =
        !!trace &&
        (!user ||
          (trace.userId ?? null) === user.id ||
          (user.role === ROLES.admin && !historyHidden()));
      if (!allowed) return response.status(404).json({ trace: null });
      response.status(200).json({ trace });
    }
  );

  app.delete(
    "/browser-use/traces/:id",
    adminOnly,
    async (request, response) => {
      BrowserTraces.delete(request.params.id);
      response.status(200).json({ success: true });
    }
  );

  app.delete("/browser-use/traces", adminOnly, async (_request, response) => {
    BrowserTraces.list().forEach((trace) => BrowserTraces.delete(trace.id));
    response.status(200).json({ success: true });
  });

  app.get("/browser-use/profiles", adminOnly, async (_request, response) => {
    try {
      const profiles = BrowserProfiles.list();
      const names = await usernames(profiles.map((profile) => profile.userId));
      response.status(200).json({
        profiles: profiles.map((profile) => ({
          ...profile,
          username: names.get(profile.userId) ?? null,
        })),
      });
    } catch (e) {
      console.error(e);
      response.status(500).json({ profiles: [], error: e.message });
    }
  });

  // Wipes the profile's cookies and sign-ins. The user's next session starts a new, empty one.
  app.delete(
    "/browser-use/profiles/:key",
    adminOnly,
    async (request, response) => {
      try {
        const deleted = await BrowserDriver.deleteProfile(request.params.key);
        response.status(deleted ? 200 : 404).json({ success: deleted });
      } catch (e) {
        console.error(e);
        response.status(500).json({ success: false, error: e.message });
      }
    }
  );
}

module.exports = { browserUseEndpoints };

const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { userFromSession } = require("../utils/http");
const {
  BrowserTraces,
} = require("../utils/agents/aibitat/plugins/browser-use/traces");

/** Session history (traces) for the browser-use agent skill. */
function browserUseEndpoints(app) {
  if (!app) return;
  const adminOnly = [validatedRequest, flexUserRoleValid([ROLES.admin])];

  app.get("/browser-use/traces", adminOnly, async (_request, response) => {
    try {
      response.status(200).json({ traces: BrowserTraces.list() });
    } catch (e) {
      console.error(e);
      response.status(500).json({ traces: [], error: e.message });
    }
  });

  // The chat card opens its own session, so whoever ran it may read it - admins may read any.
  app.get(
    "/browser-use/traces/:id",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      const trace = BrowserTraces.get(request.params.id);
      const user = await userFromSession(request, response);
      const allowed =
        !!trace &&
        (!user ||
          user.role === ROLES.admin ||
          (trace.userId ?? null) === user.id);
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
}

module.exports = { browserUseEndpoints };

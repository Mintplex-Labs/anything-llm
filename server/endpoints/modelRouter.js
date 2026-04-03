const { ModelRouter } = require("../models/modelRouter");
const { ModelRouterRule } = require("../models/modelRouterRule");
const { reqBody, userFromSession } = require("../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function modelRouterEndpoints(app) {
  if (!app) return;

  app.get(
    "/admin/model-routers",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const routers = await ModelRouter.where();
        const results = [];
        for (const router of routers) {
          const rules = await ModelRouterRule.forRouter(router.id);
          const workspaceCount = await ModelRouter.workspaceCount(router.id);
          results.push({
            ...router,
            ruleCount: rules.length,
            workspaceCount,
          });
        }
        response.status(200).json({ routers: results });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/model-routers/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const router = await ModelRouter.getWithRules({ id: Number(id) });
        if (!router) {
          response
            .status(404)
            .json({ router: null, error: "Router not found." });
          return;
        }

        const workspaceCount = await ModelRouter.workspaceCount(router.id);
        response.status(200).json({ router: { ...router, workspaceCount } });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/model-routers/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const data = reqBody(request);
        const { router, message } = await ModelRouter.create(
          data,
          user?.id || null
        );
        response.status(200).json({ router, error: message });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/model-routers/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const data = reqBody(request);
        const { router, message } = await ModelRouter.update(Number(id), data);
        response.status(200).json({ router, error: message });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/model-routers/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const success = await ModelRouter.delete(Number(id));
        response.status(200).json({
          success,
          error: success ? null : "Failed to delete router.",
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/model-routers/:id/rules/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const user = await userFromSession(request, response);
        const data = reqBody(request);
        const { rule, message } = await ModelRouterRule.create(
          Number(id),
          data,
          user?.id || null
        );
        response.status(200).json({ rule, error: message });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/model-routers/:id/rules/reorder",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { ruleUpdates } = reqBody(request);
        if (!Array.isArray(ruleUpdates)) {
          response
            .status(200)
            .json({ success: false, error: "ruleUpdates must be an array." });
          return;
        }
        const { success, message } =
          await ModelRouterRule.reorderRules(ruleUpdates);
        response.status(200).json({ success, error: message });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/model-routers/:id/rules/:ruleId",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { ruleId } = request.params;
        const data = reqBody(request);
        const { rule, message } = await ModelRouterRule.update(
          Number(ruleId),
          data
        );
        response.status(200).json({ rule, error: message });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/model-routers/:id/rules/:ruleId",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { ruleId } = request.params;
        const success = await ModelRouterRule.delete(Number(ruleId));
        response
          .status(200)
          .json({ success, error: success ? null : "Failed to delete rule." });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { modelRouterEndpoints };

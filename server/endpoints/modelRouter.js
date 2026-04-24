const { ModelRouter } = require("../models/modelRouter");
const { ModelRouterRule } = require("../models/modelRouterRule");
const { Telemetry } = require("../models/telemetry");
const { reqBody, userFromSession } = require("../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function modelRouterEndpoints(app) {
  if (!app) return;

  app.get(
    "/model-routers",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const routers = await ModelRouter.getAllWithCounts();
        response.status(200).json({ routers });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.get(
    "/model-routers/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const router = await ModelRouter.getWithRulesAndCount({
          id: Number(id),
        });
        if (!router) {
          response
            .status(404)
            .json({ router: null, error: "Router not found." });
          return;
        }
        response.status(200).json({ router });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.post(
    "/model-routers/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const data = reqBody(request);
        const { router, error } = await ModelRouter.create(
          data,
          user?.id || null
        );
        if (error) {
          response.status(400).json({ router, error });
          return;
        }
        await Telemetry.sendTelemetry("model_router_created");
        response.status(200).json({ router });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.put(
    "/model-routers/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const data = reqBody(request);
        const { router, error } = await ModelRouter.update(Number(id), data);
        if (error) {
          response.status(400).json({ router, error });
          return;
        }
        response.status(200).json({ router });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.delete(
    "/model-routers/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const success = await ModelRouter.delete(Number(id));
        if (!success) {
          response
            .status(400)
            .json({ success: false, error: "Failed to delete router." });
          return;
        }
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.post(
    "/model-routers/:id/rules/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const user = await userFromSession(request, response);
        const data = reqBody(request);
        const { rule, error } = await ModelRouterRule.create(
          Number(id),
          data,
          user?.id || null
        );
        if (error) {
          response.status(400).json({ rule, error });
          return;
        }
        response.status(200).json({ rule });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.put(
    "/model-routers/:id/rules/reorder",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { ruleUpdates } = reqBody(request);
        if (!Array.isArray(ruleUpdates)) {
          response
            .status(400)
            .json({ success: false, error: "ruleUpdates must be an array." });
          return;
        }
        const { success, error } =
          await ModelRouterRule.reorderRules(ruleUpdates);
        if (error) {
          response.status(400).json({ success, error });
          return;
        }
        response.status(200).json({ success });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.put(
    "/model-routers/:id/rules/:ruleId",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { ruleId } = request.params;
        const data = reqBody(request);
        const { rule, error } = await ModelRouterRule.update(
          Number(ruleId),
          data
        );
        if (error) {
          response.status(400).json({ rule, error });
          return;
        }
        response.status(200).json({ rule });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.delete(
    "/model-routers/:id/rules/:ruleId",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { ruleId } = request.params;
        const success = await ModelRouterRule.delete(Number(ruleId));
        if (!success) {
          response
            .status(400)
            .json({ success: false, error: "Failed to delete rule." });
          return;
        }
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );
}

module.exports = { modelRouterEndpoints };

const { validatedRequest } = require("../../middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../middleware/multiUserProtected");
const { reqBody } = require("../../http");
const { isEnabled } = require("./config");

/** The download in flight, so it can be cancelled. Downloads run one at a time - a second request is refused. */
let activeDownload = null;

function writeEvent(response, event, data) {
  response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * Engine status and model management for the embedded Lemonade engine. Registers nothing unless the engine is
 * enabled, and starts installing the engine in the background so it is ready by the time the user picks a model.
 */
function embeddedLemonadeEndpoints(app) {
  if (!app || !isEnabled()) return;
  const { EmbeddedLemonadeEngine } = require("./engine");
  const { EmbeddedLemonadeLLM } = require("./index");
  EmbeddedLemonadeEngine.prepareInBackground();

  app.get(
    "/utils/embedded-lemonade/status",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      response.status(200).json(EmbeddedLemonadeEngine.status);
    }
  );

  // Three models for this hardware, shown as cards during onboarding.
  app.get(
    "/utils/embedded-lemonade/recommendations",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const { recommendModels } = require("./recommendations");
        const models = await EmbeddedLemonadeLLM.availableModels();
        response.status(200).json(await recommendModels(models));
      } catch (error) {
        console.error("Error recommending embedded Lemonade models:", error);
        response.status(200).json({ recommendations: [] });
      }
    }
  );

  app.post(
    "/utils/embedded-lemonade/download-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      const { modelName } = reqBody(request);
      if (activeDownload)
        return response.status(409).json({
          error:
            "Another model is already downloading. Wait for it to finish or cancel it.",
        });

      response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const controller = new AbortController();
      activeDownload = controller;
      // lemond reports progress thousands of times per second - only forward whole-percent and file changes.
      let lastProgress = null;
      try {
        const { modelId } = await EmbeddedLemonadeLLM.pullModel(modelName, {
          signal: controller.signal,
          onProgress: (percentage, status) => {
            const progress = `${percentage}|${status}`;
            if (progress === lastProgress) return;
            lastProgress = progress;
            writeEvent(response, "progress", { percentage, status });
          },
        });
        writeEvent(response, "done", { done: true, modelId });
      } catch (error) {
        const cancelled = controller.signal.aborted;
        if (!cancelled)
          console.error(
            "Error downloading embedded Lemonade model:",
            error.message
          );
        writeEvent(response, "error", {
          error: cancelled ? "Download cancelled." : error.message,
        });
      } finally {
        if (activeDownload === controller) activeDownload = null;
        response.end();
      }
    }
  );

  // Closing the stream to lemond is what cancels its download.
  app.delete(
    "/utils/embedded-lemonade/download-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      activeDownload?.abort();
      activeDownload = null;
      response.status(200).json({ success: true });
    }
  );

  app.delete(
    "/utils/embedded-lemonade/remove-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { modelName } = reqBody(request);
        await EmbeddedLemonadeLLM.deleteModel(modelName);
        response.status(200).json({ success: true, error: null });
      } catch (error) {
        console.error("Error removing embedded Lemonade model:", error.message);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );
}

module.exports = { embeddedLemonadeEndpoints };

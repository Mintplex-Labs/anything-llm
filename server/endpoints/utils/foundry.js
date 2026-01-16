function foundryUtilsEndpoints(app) {
  if (!app) return;
  const {
    validatedRequest,
  } = require("../../utils/middleware/validatedRequest");
  const { reqBody } = require("../../utils/http");
  const FoundrySDK = require("../../utils/AiProviders/foundry/sdk");

  app.post(
    "/utils/foundry/download-model",
    [validatedRequest],
    async (request, response) => {
      try {
        const { modelId, basePath = "" } = reqBody(request);
        const foundrySDK = new FoundrySDK(basePath);
        response.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });

        const progressCallback = (percentage) => {
          response.write(
            `event: progress\ndata: ${JSON.stringify({ percentage })}\n\n`
          );
        };

        const { success, error } = await foundrySDK.downloadModel(
          modelId,
          progressCallback
        );
        if (!success) {
          response.write(
            `event: error\ndata: ${JSON.stringify({ error: error || "An error occurred while downloading the model" })}\n\n`
          );
          return;
        }
        response.write(
          `event: done\ndata: ${JSON.stringify({ done: true })}\n\n`
        );
      } catch (e) {
        console.error(e);
        response.write(
          `event: error\ndata: ${JSON.stringify({ error: e.message })}\n\n`
        );
      } finally {
        response.end();
      }
    }
  );

  app.delete(
    "/utils/foundry/uninstall-model",
    [validatedRequest],
    async (request, response) => {
      try {
        // Not implemented since foundry does not have an API to uninstall models
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e);
        response.status(500).json({
          error: e.message || "An error occurred while uninstalling the model",
        });
      }
    }
  );
}

module.exports = {
  foundryUtilsEndpoints,
};

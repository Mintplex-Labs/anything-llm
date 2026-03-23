const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { reqBody } = require("../../utils/http");
const { safeJsonParse, decodeHtmlEntities } = require("../../utils/http");
const {
  parseLemonadeServerEndpoint,
} = require("../../utils/AiProviders/lemonade");

function lemonadeUtilsEndpoints(app) {
  if (!app) return;

  app.post(
    "/utils/lemonade/download-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { modelId, basePath = "" } = reqBody(request);
        const lemonadeUrl = new URL(
          parseLemonadeServerEndpoint(
            basePath ?? process.env.LEMONADE_LLM_BASE_PATH,
            "base"
          )
        );
        lemonadeUrl.pathname += "api/v1/pull";
        response.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });

        const lemonadeResponse = await fetch(lemonadeUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model_name: String(modelId),
            stream: true,
          }),
        });
        if (!lemonadeResponse.ok)
          throw new Error(
            lemonadeResponse.statusText ||
              "An error occurred while downloading the model"
          );
        const reader = lemonadeResponse.body.getReader();
        let done = false;
        let currentEvent = null;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) done = true;

          const chunk = new TextDecoder("utf-8").decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.trim()) continue;

            if (line.startsWith("event:")) {
              currentEvent = line.replace("event:", "").trim();
              continue;
            }

            if (line.startsWith("data:")) {
              const jsonStr = line.replace("data:", "").trim();
              const decodedLine = decodeHtmlEntities(jsonStr);
              const data = safeJsonParse(decodedLine);
              if (!data) continue;

              if (currentEvent === "error") {
                throw new Error(
                  data.message ||
                    "An error occurred while downloading the model"
                );
              } else if (currentEvent === "complete") {
                response.write(
                  `data: ${JSON.stringify({ type: "success", percentage: 100, message: "Model downloaded successfully" })}\n\n`
                );
                done = true;
              } else if (currentEvent === "progress") {
                const percentage = data.percent ?? 0;
                const message = data.file
                  ? `Downloading ${data.file}`
                  : "Downloading model...";
                response.write(
                  `data: ${JSON.stringify({ type: "progress", percentage, message })}\n\n`
                );
              }

              currentEvent = null;
            }
          }
        }
      } catch (e) {
        console.error(e);
        response.write(
          `data: ${JSON.stringify({ type: "error", message: e.message })}\n\n`
        );
      } finally {
        response.end();
      }
    }
  );

  app.post(
    "/utils/lemonade/delete-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { modelId, basePath = "" } = reqBody(request);
        if (!modelId) {
          return response.status(400).json({
            success: false,
            error: "modelId is required",
          });
        }

        const lemonadeUrl = new URL(
          parseLemonadeServerEndpoint(
            basePath ?? process.env.LEMONADE_LLM_BASE_PATH,
            "base"
          )
        );
        lemonadeUrl.pathname += "api/v1/delete";

        const lemonadeResponse = await fetch(lemonadeUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model_name: String(modelId),
          }),
        });

        const data = await lemonadeResponse.json();
        if (!lemonadeResponse.ok || data.status === "error") {
          return response.status(lemonadeResponse.status || 500).json({
            success: false,
            error: data.message || "An error occurred while deleting the model",
          });
        }

        return response.status(200).json({
          success: true,
          message: data.message || `Deleted model: ${modelId}`,
        });
      } catch (e) {
        console.error(e);
        return response.status(500).json({
          success: false,
          error: e.message || "An error occurred while deleting the model",
        });
      }
    }
  );
}

module.exports = {
  lemonadeUtilsEndpoints,
};

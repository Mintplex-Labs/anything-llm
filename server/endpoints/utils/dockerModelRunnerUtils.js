const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { reqBody } = require("../../utils/http");
const { safeJsonParse } = require("../../utils/http");

/**
 * Decode HTML entities from a string.
 * The DMR response is encoded with HTML entities, so we need to decode them
 * so we can parse the JSON and report the progress percentage.
 * @param {string} str - The string to decode.
 * @returns {string} The decoded string.
 */
function decodeHtmlEntities(str) {
  return str
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function dockerModelRunnerUtilsEndpoints(app) {
  if (!app) return;
  const {
    parseDockerModelRunnerEndpoint,
  } = require("../../utils/AiProviders/dockerModelRunner");

  app.post(
    "/utils/dmr/download-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { modelId, basePath = "" } = reqBody(request);
        const dmrUrl = new URL(
          parseDockerModelRunnerEndpoint(
            basePath ?? process.env.DOCKER_MODEL_RUNNER_BASE_PATH,
            "dmr"
          )
        );
        dmrUrl.pathname = "/models/create";
        response.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });

        const dmrResponse = await fetch(dmrUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: String(modelId) }),
        });
        if (!dmrResponse.ok)
          throw new Error(
            dmrResponse.statusText ||
              "An error occurred while downloading the model"
          );
        const reader = dmrResponse.body.getReader();
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) done = true;

          const chunk = new TextDecoder("utf-8").decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.trim()) continue;
            const decodedLine = decodeHtmlEntities(line);
            const data = safeJsonParse(decodedLine);
            if (!data) continue;

            if (data.type === "error") {
              throw new Error(
                data.message || "An error occurred while downloading the model"
              );
            } else if (data.type === "success") {
              response.write(
                `data: ${JSON.stringify({ type: "success", percentage: 100, message: "Model downloaded successfully" })}\n\n`
              );
              done = true;
            } else if (data.type === "progress") {
              const percentage =
                data.total > 0
                  ? Math.round((data.pulled / data.total) * 100)
                  : 0;
              response.write(
                `data: ${JSON.stringify({ type: "progress", percentage, message: data.message })}\n\n`
              );
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
}

module.exports = {
  dockerModelRunnerUtilsEndpoints,
};

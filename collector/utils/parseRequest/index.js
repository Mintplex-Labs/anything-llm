const path = require("node:path");
const { reqBody } = require("../http");
const { processSingleFile } = require("../../processSingleFile");
const { runIsolatedParse } = require("./isolated");

async function handleParseRequest(request, response) {
  const { filename, options = {} } = reqBody(request);
  const safeLogging = options.safeLogging === true;
  if (safeLogging && request.payloadIntegrityVerified !== true)
    return response
      .status(400)
      .json({ msg: "Failed integrity signature check." });
  const controller = new AbortController();
  const abort = () => controller.abort();
  const closed = () => {
    if (!response.writableEnded) abort();
  };
  if (safeLogging) {
    request.once("aborted", abort);
    response.once("close", closed);
    if (request.aborted) abort();
  }
  try {
    const targetFilename = path
      .normalize(filename)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const parseOptions = {
      ...options,
      parseOnly: true,
      absolutePath: options.absolutePath || null,
    };
    const result = safeLogging
      ? await runIsolatedParse(targetFilename, parseOptions, {
          signal: controller.signal,
        })
      : await processSingleFile(targetFilename, parseOptions);
    const { success, reason, documents = [] } = result;
    if (safeLogging && !success)
      console.error(
        "[CollectorParse]",
        reason === "parse_cancelled" ? "parse_cancelled" : "parse_failed"
      );
    if (!controller.signal.aborted)
      response
        .status(200)
        .json({ filename: targetFilename, success, reason, documents });
  } catch (error) {
    if (safeLogging) console.error("[CollectorParse]", "parse_failed");
    else console.error(error);
    if (!controller.signal.aborted)
      response.status(200).json({
        filename,
        success: false,
        reason: safeLogging ? "parse_failed" : "A processing error occurred.",
        documents: [],
      });
  } finally {
    if (safeLogging) {
      request.removeListener("aborted", abort);
      response.removeListener("close", closed);
    }
  }
}

module.exports = { handleParseRequest };

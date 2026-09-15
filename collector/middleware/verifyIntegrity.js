const { CommunicationKey } = require("../utils/comKey");
const RuntimeSettings = require("../utils/runtimeSettings");
const runtimeSettings = new RuntimeSettings();
const { reqBody } = require("../utils/http");

function verifyPayloadIntegrity(request, response, next) {
  const comKey = new CommunicationKey();
  // Safe parsing is an authenticated server capability, including development.
  let safeLogging;
  try {
    safeLogging = reqBody(request)?.options?.safeLogging === true;
  } catch {
    return response
      .status(400)
      .json({ msg: "Failed integrity signature check." });
  }
  if (process.env.NODE_ENV === "development" && !safeLogging) {
    comKey.log("verifyPayloadIntegrity is skipped in development.");
    runtimeSettings.parseOptionsFromRequest(request);
    next();
    return;
  }

  const signature = request.header("X-Integrity");
  if (!signature)
    return response
      .status(400)
      .json({ msg: "Failed integrity signature check." });

  const validSignedPayload = comKey.verify(signature, request.body);
  if (!validSignedPayload)
    return response
      .status(400)
      .json({ msg: "Failed integrity signature check." });

  request.payloadIntegrityVerified = true;

  runtimeSettings.parseOptionsFromRequest(request);
  next();
}

module.exports = {
  verifyPayloadIntegrity,
};

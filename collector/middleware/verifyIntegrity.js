const { CommunicationKey } = require("../utils/comKey");

function verifyPayloadIntegrity(request, response, next) {
  const comKey = new CommunicationKey();
  if (process.env.NODE_ENV === "development") {
    comKey.log('verifyPayloadIntegrity is skipped in development.')
    next();
    return;
  }

  const signature = request.header("X-Integrity");
  if (!signature) return response.status(400).json({ msg: 'Failed integrity signature check.' })

  const validSignedPayload = comKey.verify(signature, request.body);
  if (!validSignedPayload) return response.status(400).json({ msg: 'Failed integrity signature check.' })
  next();
}

module.exports = {
  verifyPayloadIntegrity
}
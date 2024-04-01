const { CommunicationKey } = require("../utils/comKey");

function verifyPayloadIntegrity(request, response, next) {
  const signature = request.header("X-Integrity");
  if (!signature) return response.status(400).json({ msg: 'Failed integrity signature check.' })

  const validSignedPayload = new CommunicationKey().verify(signature, request.body);
  if (!validSignedPayload) return response.status(400).json({ msg: 'Failed integrity signature check.' })
  next();
}

module.exports = {
  verifyPayloadIntegrity
}
const { EncryptionWorker } = require("../utils/EncryptionWorker");
const { CommunicationKey } = require("../utils/comKey");

/** 
 * Express Response Object interface with defined encryptionWorker attached to locals property.
 * @typedef {import("express").Response & import("express").Response['locals'] & {encryptionWorker: EncryptionWorker} } ResponseWithSigner
*/

// You can use this middleware to assign the EncryptionWorker to the response locals
// property so that if can be used to encrypt/decrypt arbitrary data via response object.
// eg: Encrypting API keys in chunk sources.

// The way this functions is that the rolling RSA Communication Key is used server-side to private-key encrypt the raw
// key of the persistent EncryptionManager credentials. Since EncryptionManager credentials do _not_ roll, we should not send them
// even between server<>collector in plaintext because if the user configured the server/collector to be public they could technically
// be exposing the key in transit via the X-Payload-Signer header. Even if this risk is minimal we should not do this.

// This middleware uses the CommunicationKey public key to first decrypt the base64 representation of the EncryptionManager credentials
// and then loads that in to the EncryptionWorker as a buffer so we can use the same credentials across the system. Should we ever break the
// collector out into its own service this would still work without SSL/TLS.

/**
 * 
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
function setDataSigner(request, response, next) {
  const comKey = new CommunicationKey();
  const encryptedPayloadSigner = request.header("X-Payload-Signer");
  if (!encryptedPayloadSigner) console.log('Failed to find signed-payload to set encryption worker! Encryption calls will fail.');

  const decryptedPayloadSignerKey = comKey.decrypt(encryptedPayloadSigner);
  const encryptionWorker = new EncryptionWorker(decryptedPayloadSignerKey);
  response.locals.encryptionWorker = encryptionWorker;
  next();
}

module.exports = {
  setDataSigner
}
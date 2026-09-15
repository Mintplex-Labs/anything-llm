const { EncryptionManager } = require("../EncryptionManager");

const ENCRYPTED_PREFIX = "enc:";

function encryptConnectorSecret(secret) {
  if (!secret) return null;
  const encrypted = new EncryptionManager().encrypt(secret);
  return encrypted ? `${ENCRYPTED_PREFIX}${encrypted}` : null;
}

function decryptConnectorSecret(value) {
  if (!value) return null;
  if (!value.startsWith(ENCRYPTED_PREFIX)) return value;
  return new EncryptionManager().decrypt(value.slice(ENCRYPTED_PREFIX.length));
}

module.exports = { encryptConnectorSecret, decryptConnectorSecret };

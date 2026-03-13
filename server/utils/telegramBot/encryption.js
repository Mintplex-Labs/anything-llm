const { EncryptionManager } = require("../EncryptionManager");

const ENCRYPTED_PREFIX = "enc:";

/**
 * Encrypt a bot token for safe storage in the database.
 * @param {string} token
 * @returns {string|null}
 */
function encryptToken(token) {
  if (!token) return null;
  const manager = new EncryptionManager();
  const encrypted = manager.encrypt(token);
  return encrypted ? ENCRYPTED_PREFIX + encrypted : null;
}

/**
 * Decrypt an encrypted bot token from the database.
 * Returns plaintext tokens as-is for backward compatibility.
 * @param {string} encryptedToken
 * @returns {string|null}
 */
function decryptToken(encryptedToken) {
  if (!encryptedToken) return null;
  if (!encryptedToken.startsWith(ENCRYPTED_PREFIX)) return encryptedToken;
  const manager = new EncryptionManager();
  return manager.decrypt(encryptedToken.slice(ENCRYPTED_PREFIX.length));
}

module.exports = { encryptToken, decryptToken };

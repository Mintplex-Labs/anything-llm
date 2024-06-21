const crypto = require("crypto");
const { dumpENV } = require("../helpers/updateENV");

// Class that is used to arbitrarily encrypt/decrypt string data via a persistent passphrase/salt that
// is either user defined or is created and saved to the ENV on creation.
class EncryptionManager {
  #keyENV = "SIG_KEY";
  #saltENV = "SIG_SALT";
  #encryptionKey;
  #encryptionSalt;

  constructor({ key = null, salt = null } = {}) {
    this.#loadOrCreateKeySalt(key, salt);
    this.key = crypto.scryptSync(this.#encryptionKey, this.#encryptionSalt, 32);
    this.algorithm = "aes-256-cbc";
    this.separator = ":";

    // Used to send key to collector process to be able to decrypt data since they do not share ENVs
    // this value should use the CommunicationKey.encrypt process before sending anywhere outside the
    // server process so it is never sent in its raw format.
    this.xPayload = this.key.toString("base64");
  }

  log(text, ...args) {
    console.log(`\x1b[36m[EncryptionManager]\x1b[0m ${text}`, ...args);
  }

  #loadOrCreateKeySalt(_key = null, _salt = null) {
    if (!!_key && !!_salt) {
      this.log(
        "Pre-assigned key & salt for encrypting arbitrary data was used."
      );
      this.#encryptionKey = _key;
      this.#encryptionSalt = _salt;
      return;
    }

    if (!process.env[this.#keyENV] || !process.env[this.#saltENV]) {
      this.log("Self-assigning key & salt for encrypting arbitrary data.");
      process.env[this.#keyENV] = crypto.randomBytes(32).toString("hex");
      process.env[this.#saltENV] = crypto.randomBytes(32).toString("hex");
      if (process.env.NODE_ENV === "production") dumpENV();
    } else
      this.log("Loaded existing key & salt for encrypting arbitrary data.");

    this.#encryptionKey = process.env[this.#keyENV];
    this.#encryptionSalt = process.env[this.#saltENV];
    return;
  }

  encrypt(plainTextString = null) {
    try {
      if (!plainTextString)
        throw new Error("Empty string is not valid for this method.");
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      const encrypted = cipher.update(plainTextString, "utf8", "hex");
      return [
        encrypted + cipher.final("hex"),
        Buffer.from(iv).toString("hex"),
      ].join(this.separator);
    } catch (e) {
      this.log(e);
      return null;
    }
  }

  decrypt(encryptedString) {
    try {
      const [encrypted, iv] = encryptedString.split(this.separator);
      if (!iv) throw new Error("IV not found");
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(iv, "hex")
      );
      return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    } catch (e) {
      this.log(e);
      return null;
    }
  }
}

module.exports = { EncryptionManager };

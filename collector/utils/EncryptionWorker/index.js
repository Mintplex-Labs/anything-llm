const crypto = require("crypto");

// Differs from EncryptionManager in that is does not set or define the keys that will be used
// to encrypt or read data and it must be told the key (as base64 string) explicitly that will be used and is provided to
// the class on creation. This key should be the same `key` that is used by the EncryptionManager class.
class EncryptionWorker {
  constructor(presetKeyBase64 = "") {
    this.key = Buffer.from(presetKeyBase64, "base64");
    this.algorithm = "aes-256-cbc";
    this.separator = ":";
  }

  log(text, ...args) {
    console.log(`\x1b[36m[EncryptionManager]\x1b[0m ${text}`, ...args);
  }

  /**
   * Give a chunk source, parse its payload query param and expand that object back into the URL
   * as additional query params
   * @param {string} chunkSource
   * @returns {URL} Javascript URL object with query params decrypted from payload query param.
   */
  expandPayload(chunkSource = "") {
    try {
      const url = new URL(chunkSource);
      if (!url.searchParams.has("payload")) return url;

      const decryptedPayload = this.decrypt(url.searchParams.get("payload"));
      const encodedParams = JSON.parse(decryptedPayload);
      url.searchParams.delete("payload"); // remove payload prop

      // Add all query params needed to replay as query params
      Object.entries(encodedParams).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
      return url;
    } catch (e) {
      console.error(e);
    }
    return new URL(chunkSource);
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

module.exports = { EncryptionWorker };

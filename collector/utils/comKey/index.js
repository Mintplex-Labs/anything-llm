const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const keyPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../../server/storage/comkey`)
    : path.resolve(
        process.env.STORAGE_DIR ??
          path.resolve(__dirname, `../../../server/storage`),
        `comkey`
      );

class CommunicationKey {
  #pubKeyName = "ipc-pub.pem";
  #storageLoc = keyPath;

  constructor() {}

  log(text, ...args) {
    console.log(`\x1b[36m[CommunicationKeyVerify]\x1b[0m ${text}`, ...args);
  }

  #readPublicKey() {
    return fs.readFileSync(path.resolve(this.#storageLoc, this.#pubKeyName));
  }

  // Given a signed payload from private key from /app/server/ this signature should
  // decode to match the textData provided. This class does verification only in collector.
  // Note: The textData is typically the JSON stringified body sent to the document processor API.
  verify(signature = "", textData = "") {
    try {
      let data = textData;
      if (typeof textData !== "string") data = JSON.stringify(data);
      return crypto.verify(
        "RSA-SHA256",
        Buffer.from(data),
        this.#readPublicKey(),
        Buffer.from(signature, "hex")
      );
    } catch {}
    return false;
  }
}

module.exports = { CommunicationKey };

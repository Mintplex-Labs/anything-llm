const crypto = require('crypto');
const fs = require("fs");
const path = require("path");

const keyPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../../server/storage/comkey`)
    : path.resolve(process.env.STORAGE_DIR, `comkey`);

class CommunicationKey {
  #pubKeyName = 'ipc-pub.pem';
  #storageLoc = keyPath;

  constructor() { }

  log(text, ...args) {
    console.log(`\x1b[36m[CommunicationKeyVerify]\x1b[0m ${text}`, ...args);
  }

  #readPublicKey() {
    return fs.readFileSync(path.resolve(this.#storageLoc, this.#pubKeyName));
  }

  verify(signature = '', textData = '') {
    try {
      let data = textData;
      if (typeof textData !== 'string') data = JSON.stringify(data);
      return crypto.verify('RSA-SHA256', Buffer.from(data), this.#readPublicKey(), Buffer.from(signature, "hex"));
    } catch { }
    return false;
  }
}

module.exports = { CommunicationKey }
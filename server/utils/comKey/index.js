const crypto = require('crypto');
const fs = require("fs");
const path = require("path");

const keyPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/comkey`)
    : path.resolve(process.env.STORAGE_DIR, `comkey`);

class CommunicationKey {
  #privKeyName = 'ipc-priv.pem';
  #pubKeyName = 'ipc-pub.pem';
  #storageLoc = keyPath;

  constructor() {
    this.#generate();
  }

  log(text, ...args) {
    console.log(`\x1b[36m[CommunicationKey]\x1b[0m ${text}`, ...args);
  }

  readPublicKey() {
    return fs.readFileSync(path.resolve(this.#storageLoc, this.#pubKeyName));
  }

  #readPrivateKey() {
    return fs.readFileSync(path.resolve(this.#storageLoc, this.#privKeyName));
  }

  #generate() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    });

    if (!fs.existsSync(this.#storageLoc)) fs.mkdirSync(this.#storageLoc, { recursive: true });
    fs.writeFileSync(`${path.resolve(this.#storageLoc, this.#privKeyName)}`, keyPair.privateKey);
    fs.writeFileSync(`${path.resolve(this.#storageLoc, this.#pubKeyName)}`, keyPair.publicKey);
    this.log('Keys generated for IPC communication.')
  }

  sign(textData = '') {
    return crypto.sign('RSA-SHA256', Buffer.from(textData), this.#readPrivateKey()).toString('hex');
  }
}

module.exports = { CommunicationKey }
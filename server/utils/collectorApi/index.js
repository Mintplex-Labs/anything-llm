const { EncryptionManager } = require("../EncryptionManager");
const http = require('http');
const https = require('https');
const { URL } = require('url');

// When running locally will occupy the 0.0.0.0 hostname space but when deployed inside
// of docker this endpoint is not exposed so it is only on the Docker instances internal network
// so no additional security is needed on the endpoint directly. Auth is done however by the express
// middleware prior to leaving the node-side of the application so that is good enough >:)
class CollectorApi {
  constructor() {
    const { CommunicationKey } = require("../comKey");
    this.comkey = new CommunicationKey();
    this.endpoint = `http://0.0.0.0:${process.env.COLLECTOR_PORT || 8888}`;
    this.requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '900000', 10) - 10000; // 15분 기본값
  }

  log(text, ...args) {
    console.log(`\x1b[36m[CollectorApi]\x1b[0m ${text}`, ...args);
  }

  #attachOptions() {
    return {
      whisperProvider: process.env.WHISPER_PROVIDER || "local",
      WhisperModelPref: process.env.WHISPER_MODEL_PREF,
      openAiKey: process.env.OPEN_AI_KEY || null,
      ocr: {
        langList: process.env.TARGET_OCR_LANG || "eng",
      },
    };
  }

  async online() {
    return await fetch(this.endpoint)
      .then((res) => res.ok)
      .catch(() => false);
  }

  async acceptedFileTypes() {
    return await fetch(`${this.endpoint}/accepts`)
      .then((res) => {
        if (!res.ok) throw new Error("failed to GET /accepts");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        this.log(e.message);
        return null;
      });
  }

  async processDocument(filename = "") {
    if (!filename) return false;

    const data = JSON.stringify({
      filename,
      options: this.#attachOptions(),
    });

    return new Promise((resolve) => {
      const url = new URL(`${this.endpoint}/process`);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'X-Integrity': this.comkey.sign(data),
          'X-Payload-Signer': this.comkey.encrypt(
            new EncryptionManager().xPayload
          ),
        },
        timeout: this.requestTimeout, // 15분 타임아웃 설정
      };

      const req = http.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode < 200 || res.statusCode >= 300) {
              this.log(`HTTP 에러 상태 코드: ${res.statusCode}`);
              resolve({ success: false, reason: `HTTP 에러 상태 코드: ${res.statusCode}`, documents: [] });
              return;
            }
            const parsedData = JSON.parse(responseData);
            resolve(parsedData);
          } catch (e) {
            this.log('JSON 파싱 에러:', e.message);
            resolve({ success: false, reason: e.message, documents: [] });
          }
        });
      });

      req.on('error', (e) => {
        this.log('요청 에러:', e.message);
        resolve({ success: false, reason: e.message, documents: [] });
      });

      req.on('timeout', () => {
        this.log('요청 타임아웃');
        req.destroy();
        resolve({ success: false, reason: '요청 타임아웃', documents: [] });
      });

      // 데이터 전송 및 요청 종료
      req.write(data);
      req.end();
    });
  }

  async processLink(link = "") {
    if (!link) return false;

    const data = JSON.stringify({ link });
    return await fetch(`${this.endpoint}/process-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Integrity": this.comkey.sign(data),
        "X-Payload-Signer": this.comkey.encrypt(
          new EncryptionManager().xPayload
        ),
      },
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Response could not be completed");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        this.log(e.message);
        return { success: false, reason: e.message, documents: [] };
      });
  }

  async processRawText(textContent = "", metadata = {}) {
    const data = JSON.stringify({ textContent, metadata });
    return await fetch(`${this.endpoint}/process-raw-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Integrity": this.comkey.sign(data),
        "X-Payload-Signer": this.comkey.encrypt(
          new EncryptionManager().xPayload
        ),
      },
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Response could not be completed");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        this.log(e.message);
        return { success: false, reason: e.message, documents: [] };
      });
  }

  // We will not ever expose the document processor to the frontend API so instead we relay
  // all requests through the server. You can use this function to directly expose a specific endpoint
  // on the document processor.
  async forwardExtensionRequest({ endpoint, method, body }) {
    return await fetch(`${this.endpoint}${endpoint}`, {
      method,
      body, // Stringified JSON!
      headers: {
        "Content-Type": "application/json",
        "X-Integrity": this.comkey.sign(body),
        "X-Payload-Signer": this.comkey.encrypt(
          new EncryptionManager().xPayload
        ),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Response could not be completed");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        this.log(e.message);
        return { success: false, data: {}, reason: e.message };
      });
  }

  async getLinkContent(link = "", captureAs = "text") {
    if (!link) return false;

    const data = JSON.stringify({ link, captureAs });
    return await fetch(`${this.endpoint}/util/get-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Integrity": this.comkey.sign(data),
        "X-Payload-Signer": this.comkey.encrypt(
          new EncryptionManager().xPayload
        ),
      },
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Response could not be completed");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        this.log(e.message);
        return { success: false, content: null };
      });
  }
}

module.exports.CollectorApi = CollectorApi;

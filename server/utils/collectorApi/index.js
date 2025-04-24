const { EncryptionManager } = require("../EncryptionManager");

/**
 * @typedef {Object} CollectorOptions
 * @property {string} whisperProvider - The provider to use for whisper, defaults to "local"
 * @property {string} WhisperModelPref - The model to use for whisper if set.
 * @property {string} openAiKey - The API key to use for OpenAI interfacing, mostly passed to OAI Whisper provider.
 * @property {Object} ocr - The OCR options
 * @property {{allowAnyIp: "true"|null|undefined}} runtimeSettings - The runtime settings that are passed to the collector. Persisted across requests.
 */

// When running locally will occupy the 0.0.0.0 hostname space but when deployed inside
// of docker this endpoint is not exposed so it is only on the Docker instances internal network
// so no additional security is needed on the endpoint directly. Auth is done however by the express
// middleware prior to leaving the node-side of the application so that is good enough >:)
class CollectorApi {
  constructor() {
    const { CommunicationKey } = require("../comKey");
    this.comkey = new CommunicationKey();
    this.endpoint = `http://0.0.0.0:${process.env.COLLECTOR_PORT || 8888}`;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[CollectorApi]\x1b[0m ${text}`, ...args);
  }

  /**
   * Attach options to the request passed to the collector API
   * @returns {CollectorOptions}
   */
  #attachOptions() {
    return {
      whisperProvider: process.env.WHISPER_PROVIDER || "local",
      WhisperModelPref: process.env.WHISPER_MODEL_PREF,
      openAiKey: process.env.OPEN_AI_KEY || null,
      ocr: {
        langList: process.env.TARGET_OCR_LANG || "eng",
      },
      runtimeSettings: {
        allowAnyIp: process.env.COLLECTOR_ALLOW_ANY_IP ?? "false",
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

  /**
   * Process a document
   * - Will append the options to the request body
   * @param {string} filename - The filename of the document to process
   * @returns {Promise<Object>} - The response from the collector API
   */
  async processDocument(filename = "") {
    if (!filename) return false;

    const data = JSON.stringify({
      filename,
      options: this.#attachOptions(),
    });

    return await fetch(`${this.endpoint}/process`, {
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

  /**
   * Process a link
   * - Will append the options to the request body
   * @param {string} link - The link to process
   * @param {{[key: string]: string}} scraperHeaders - Custom headers to apply to the web-scraping request URL
   * @returns {Promise<Object>} - The response from the collector API
   */
  async processLink(link = "", scraperHeaders = {}) {
    if (!link) return false;

    const data = JSON.stringify({
      link,
      scraperHeaders,
      options: this.#attachOptions(),
    });

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

  /**
   * Process raw text as a document for the collector
   * - Will append the options to the request body
   * @param {string} textContent - The text to process
   * @param {Object} metadata - The metadata to process
   * @returns {Promise<Object>} - The response from the collector API
   */
  async processRawText(textContent = "", metadata = {}) {
    const data = JSON.stringify({
      textContent,
      metadata,
      options: this.#attachOptions(),
    });
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

  /**
   * Get the content of a link only in a specific format
   * - Will append the options to the request body
   * @param {string} link - The link to get the content of
   * @param {"text"|"html"} captureAs - The format to capture the content as
   * @returns {Promise<Object>} - The response from the collector API
   */
  async getLinkContent(link = "", captureAs = "text") {
    if (!link) return false;

    const data = JSON.stringify({
      link,
      captureAs,
      options: this.#attachOptions(),
    });
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

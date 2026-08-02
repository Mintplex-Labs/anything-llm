const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  formatChatHistory,
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { v4: uuidv4 } = require("uuid");

/**
 * GitHub Copilot LLM Provider
 *
 * Uses the official @github/copilot-sdk (JSON-RPC to Copilot CLI) instead of
 * the unauthorized api.githubcopilot.com REST endpoint. This is the TOS-compliant
 * integration path for using GitHub Copilot's models in AnythingLLM.
 *
 * @see https://github.com/github/copilot-sdk
 * @see https://github.com/github/docs/blob/main/content/site-policy/acceptable-use-policies/github-acceptable-use-policies.md
 */
class GithubCopilotLLM {
  static client = null;
  static clientRefs = 0;
  static clientInitPromise = null;

  constructor(embedder = null, modelPreference = null) {
    const { CopilotClient } = require("@github/copilot-sdk");

    this.className = "GithubCopilotLLM";
    this.model =
      modelPreference || process.env.GITHUB_COPILOT_MODEL_PREF || "auto";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this._session = null;

    // Map GITHUB_COPILOT_TOKEN to GH_TOKEN for the Copilot SDK
    if (process.env.GITHUB_COPILOT_TOKEN && !process.env.GH_TOKEN) {
      process.env.GH_TOKEN = process.env.GITHUB_COPILOT_TOKEN;
    }

    // Lazily initialize the shared CopilotClient (singleton)
    if (!GithubCopilotLLM.clientInitPromise) {
      GithubCopilotLLM.clientInitPromise = (async () => {
        GithubCopilotLLM.client = new CopilotClient({
          logLevel: "error",
        });
        await GithubCopilotLLM.client.start();
      })().catch((err) => {
        GithubCopilotLLM.clientInitPromise = null;
        throw new Error(
          `GitHub Copilot: Failed to connect to Copilot CLI. Ensure the Copilot CLI is installed and authenticated: ${err.message}`
        );
      });
    }
    GithubCopilotLLM.clientRefs++;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => {
          return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
        })
        .join("")
    );
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(_modelName) {
    const limit = process.env.GITHUB_COPILOT_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit))) return 4096;
    return Number(limit);
  }

  promptWindowLimit() {
    return GithubCopilotLLM.promptWindowLimit();
  }

  isValidChatCompletionModel(_modelName = "") {
    return true;
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...formatChatHistory(chatHistory),
      {
        role: "user",
        content: userPrompt,
      },
    ];
  }

  /**
   * Build a human-readable prompt from the messages array.
   * The Copilot SDK uses a simple string prompt, not a messages array.
   */
  #messagesToPrompt(messages) {
    if (!messages || !messages.length) return "";
    return messages
      .map((m) => {
        const role = m.role === "system" ? "Instructions" : m.role;
        return `[${role}]: ${m.content}`;
      })
      .join("\n\n");
  }

  async getChatCompletion(messages = null, options = {}) {
    const { temperature: _temperature = 0.7 } = options || {};

    // Create a fresh session for each chat completion to avoid state bleed
    if (GithubCopilotLLM.clientInitPromise) {
      await GithubCopilotLLM.clientInitPromise;
    }

    const prompt = this.#messagesToPrompt(messages);
    if (!prompt) return null;

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      (async () => {
        const session = await GithubCopilotLLM.client.createSession({
          model: this.model,
        });
        try {
          const response = await session.sendAndWait(prompt, 120_000);
          await session.disconnect();
          return response?.data?.content ?? null;
        } catch (e) {
          await session.disconnect().catch(() => {});
          throw e;
        }
      })()
    );

    if (!result.output) return null;

    return {
      textResponse: result.output,
      metrics: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, options = {}) {
    const { temperature: _temperature = 0.7 } = options || {};
    const prompt = this.#messagesToPrompt(messages);
    if (!prompt) throw new Error("No prompt provided");

    if (GithubCopilotLLM.clientInitPromise) {
      await GithubCopilotLLM.clientInitPromise;
    }

    const session = await GithubCopilotLLM.client.createSession({
      model: this.model,
    });

    // Track stream for measurement
    const stream = {
      endMeasurement: () => {},
    };

    // Wrap the session as a stream-like object
    const measuredStreamRequest = {
      stream,
      session,
      messages,
      async cleanup() {
        await session.disconnect().catch(() => {});
      },
    };

    return measuredStreamRequest;
  }

  /**
   * Handle streaming response from Copilot SDK.
   * The Copilot SDK emits events via session.on(), we bridge those to
   * the response stream format expected by AnythingLLM.
   */
  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    const { session, messages } = stream;

    return new Promise(async (resolve) => {
      let fullText = "";
      let resolved = false;

      const handleAbort = () => {
        if (!resolved) {
          resolved = true;
          stream?.endMeasurement?.({ completion_tokens: 0 });
          clientAbortedHandler(resolve, fullText);
        }
      };
      response.on("close", handleAbort);

      try {
        // Subscribe to assistant message events for real-time tokens
        session.on("assistant.message", (event) => {
          const content = event?.data?.content;
          if (content && !resolved) {
            fullText = content; // Copilot SDK gives the full message, not deltas
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: content,
              close: false,
              error: false,
            });
          }
        });

        // Subscribe to session idle to know when the response is complete
        session.on("session.idle", () => {
          if (resolved) return;
          resolved = true;
          writeResponseChunk(response, {
            uuid,
            sources,
            type: "textResponseChunk",
            textResponse: "",
            close: true,
            error: false,
          });
          response.removeListener("close", handleAbort);
          stream?.endMeasurement?.({
            completion_tokens: fullText.length,
          });
          session.disconnect().catch(() => {});
          resolve(fullText);
        });

        // Send the prompt to start the stream
        const promptText = this.#messagesToPrompt(messages);
        await session.send(promptText);
      } catch (e) {
        if (!resolved) {
          resolved = true;
          console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
          writeResponseChunk(response, {
            uuid,
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: e.message,
          });
          stream?.endMeasurement?.({ completion_tokens: 0 });
          session.disconnect().catch(() => {});
          resolve(fullText);
        }
      }
    });
  }

  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }

  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }

  /**
   * Clean up the shared CopilotClient when the last provider instance is done.
   */
  static async shutdown() {
    GithubCopilotLLM.clientRefs--;
    if (GithubCopilotLLM.clientRefs <= 0 && GithubCopilotLLM.client) {
      GithubCopilotLLM.clientRefs = 0;
      await GithubCopilotLLM.client.stop().catch(() => {});
      GithubCopilotLLM.client = null;
      GithubCopilotLLM.clientInitPromise = null;
    }
  }

  /**
   * Step 1 of device OAuth: Request a device code from GitHub.
   * The user visits verification_uri and enters user_code.
   * @returns {{ device_code: string, user_code: string, verification_uri: string, expires_in: number }}
   */
  static async initiateDeviceAuth() {
    const https = require("https");
    const data = JSON.stringify({
      client_id: "Iv1.b507a08c87ecfe98",
      scope: "read:user",
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "github.com",
          path: "/login/device/code",
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(body));
            } catch {
              reject(
                new Error(`Failed to parse device code response: ${body}`)
              );
            }
          });
        }
      );
      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * Step 2 of device OAuth: Poll GitHub until the user authorizes the device,
   * then exchange the device_code for an access token.
   * @param {string} deviceCode - from initiateDeviceAuth()
   * @param {number} timeoutMs - max polling time (default 15 minutes)
   * @returns {Promise<{ access_token: string }>}
   */
  static async completeDeviceAuth(deviceCode, timeoutMs = 900_000) {
    const https = require("https");
    const start = Date.now();

    const poll = () =>
      new Promise((resolve, reject) => {
        const data = JSON.stringify({
          client_id: "Iv1.b507a08c87ecfe98",
          device_code: deviceCode,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        });

        const req = https.request(
          {
            hostname: "github.com",
            path: "/login/oauth/access_token",
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
            },
          },
          (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
              try {
                resolve(JSON.parse(body));
              } catch {
                reject(new Error(`Failed to parse token response: ${body}`));
              }
            });
          }
        );
        req.on("error", reject);
        req.write(data);
        req.end();
      });

    while (Date.now() - start < timeoutMs) {
      const result = await poll();
      if (result.access_token) return result;
      if (result.error === "authorization_pending") {
        await new Promise((r) => setTimeout(r, result.interval * 1000 || 5000));
        continue;
      }
      throw new Error(
        `Device auth failed: ${result.error} - ${result.error_description || ""}`
      );
    }
    throw new Error("Device authorization timed out");
  }
}

module.exports = {
  GithubCopilotLLM,
};

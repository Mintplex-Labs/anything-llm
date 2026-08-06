const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { GithubCopilotLLM } = require("../../../AiProviders/githubCopilot");

/**
 * The agent provider for GitHub Copilot.
 *
 * Uses the official @github/copilot-sdk via JSON-RPC to the Copilot CLI.
 * Falls back to UnTooled prompt-based tool calling since the Copilot SDK
 * has its own native tool handling that differs from the OpenAI tool format.
 *
 * @see https://github.com/github/copilot-sdk
 */
class GithubCopilotProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    this.providerTag = "github-copilot";
    const { model = "auto" } = config;

    this.model = model;
    this.verbose = true;
    this._supportsToolCalling = false; // Use UnTooled fallback for now
  }

  get client() {
    // Return a minimal client interface that UnTooled expects.
    // We delegate actual calls to the GithubCopilotLLM provider.
    return {
      chat: {
        completions: {
          create: async (params) => {
            const provider = new GithubCopilotLLM(null, this.model);
            const messages = params.messages || [];
            const result = await provider.getChatCompletion(messages, {
              temperature: params.temperature || 0,
            });
            return {
              choices: [{ message: { content: result?.textResponse || "" } }],
            };
          },
        },
      },
    };
  }

  get supportsAgentStreaming() {
    return true;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    const provider = new GithubCopilotLLM(null, this.model);
    const result = await provider.getChatCompletion(messages, {
      temperature: 0,
    });
    return result?.textResponse || null;
  }

  async #handleFunctionCallStream({ messages = [] }) {
    const provider = new GithubCopilotLLM(null, this.model);
    const streamResult = await provider.streamGetChatCompletion(messages, {
      temperature: 0,
    });

    // Return the session as a stream-like object for the tooled handlers.
    // The UnTooled stream handler will collect chunks from the session events.
    const { session } = streamResult;

    return {
      [Symbol.asyncIterator]() {
        let done = false;
        let buffer = [];
        let resolveNext = null;

        session.on("assistant.message", (event) => {
          const content = event?.data?.content;
          if (content) {
            buffer.push({
              choices: [{ delta: { content } }],
            });
            if (resolveNext) {
              resolveNext();
              resolveNext = null;
            }
          }
        });

        session.on("session.idle", () => {
          done = true;
          if (resolveNext) {
            resolveNext();
            resolveNext = null;
          }
        });

        // Start the stream
        const promptText = messages
          .map((m) => `[${m.role}]: ${m.content}`)
          .join("\n\n");
        session.send(promptText).catch(() => {});

        return {
          async next() {
            while (buffer.length === 0 && !done) {
              await new Promise((r) => (resolveNext = r));
            }
            if (buffer.length > 0) {
              return { value: buffer.shift(), done: false };
            }
            session.disconnect().catch(() => {});
            return { done: true };
          },
        };
      },
    };
  }

  /**
   * Stream a chat completion. Falls back to UnTooled since we don't
   * support native OpenAI-style tool calling through the Copilot SDK.
   */
  async stream(messages, functions = [], eventHandler = null) {
    this.providerLog(
      "Provider.stream (untooled) - will process this chat completion via Copilot SDK."
    );

    try {
      return await UnTooled.prototype.stream.call(
        this,
        messages,
        functions,
        this.#handleFunctionCallStream.bind(this),
        eventHandler
      );
    } catch (error) {
      console.error(error.message, error);
      throw error;
    }
  }

  /**
   * Create a non-streaming completion. Falls back to UnTooled.
   */
  async complete(messages, functions = []) {
    return await UnTooled.prototype.complete.call(
      this,
      messages,
      functions,
      this.#handleFunctionCallChat.bind(this)
    );
  }

  getCost(_usage) {
    return 0;
  }
}

module.exports = GithubCopilotProvider;

/**
 * @typedef {Object} ChatTraceEvent
 * @property {string} name - trace name, prefixed by origin (eg: "chat:workspace", "chat:api", "chat:embed", "chat:agent")
 * @property {string} input - the user prompt
 * @property {string} output - the final text response
 * @property {string} [model] - model tag used for the completion
 * @property {string|null} [userId] - stable user identifier (username, api session id, embed session id)
 * @property {string|null} [sessionId] - conversation grouping id (workspace slug, thread slug, embed session)
 * @property {Array<{role: string, content: string}>} [messages] - full message array sent to the LLM
 * @property {{prompt_tokens?: number, completion_tokens?: number, total_tokens?: number, outputTps?: number, duration?: number}} [metrics]
 * @property {Object} [metadata]
 * @property {string[]} [tags]
 * @property {Array<{name: string, input?: any, output?: any, metadata?: Object}>} [spans] - retrospective child spans (eg: vector search)
 */

/**
 * @typedef {Object} TraceEvent
 * @property {string} name
 * @property {any} [input]
 * @property {any} [output]
 * @property {string|null} [userId]
 * @property {string|null} [sessionId]
 * @property {string} [model] - model used, when the event is a billable model call
 * @property {string} [observationType] - observation type override (eg: "embedding", "generation")
 * @property {{prompt_tokens?: number, inputCost?: number, outputCost?: number, totalCost?: number}} [metrics]
 * @property {Object} [metadata]
 * @property {string[]} [tags]
 */

/**
 * Facade for LLM observability providers (Langfuse, etc). All methods are
 * fire-and-forget and can never throw into a caller - if the provider is
 * unconfigured or the remote endpoint is down, tracing is a no-op.
 */
const Observability = {
  /** @type {import("./langfuse").LangfuseProvider|null|undefined} undefined = not loaded, null = disabled */
  _client: undefined,
  /** @type {Promise<void>|null} in-flight init so concurrent calls share one instance */
  _loading: null,
  /** @type {Set<Promise>} in-flight trace calls so flush() can wait for them */
  _pending: new Set(),

  _track: function (promise) {
    this._pending.add(promise);
    promise.catch(() => null).then(() => this._pending.delete(promise));
    return promise;
  },

  providers: {
    langfuse: () => {
      const { LangfuseProvider } = require("./langfuse");
      return LangfuseProvider;
    },
  },

  /**
   * Resolve the configured provider instance (cached until reset()).
   * @returns {Promise<import("./langfuse").LangfuseProvider|null>}
   */
  client: async function () {
    if (this._client !== undefined) return this._client;
    if (!this._loading) {
      this._loading = (async () => {
        try {
          const { SystemSettings } = require("../../models/systemSettings");
          const { provider, config } =
            await SystemSettings.observabilitySettings();
          if (!provider || !this.providers[provider])
            return (this._client = null);
          const ProviderClass = this.providers[provider]();
          const instance = new ProviderClass(config);
          this._client = instance.valid ? instance : null;
          if (this._client)
            console.log(`\x1b[32m[Observability]\x1b[0m ${provider} enabled.`);
        } catch (error) {
          console.error(`[Observability] failed to initialize`, error.message);
          this._client = null;
        }
      })().finally(() => (this._loading = null));
    }
    await this._loading;
    return this._client;
  },

  /** Drop the cached client so the next trace re-reads settings. Call after settings change. */
  reset: function () {
    if (this._client) this._client.shutdown();
    this._client = undefined;
  },

  /**
   * Flush any queued traces immediately. Short-lived processes (background
   * jobs) must call this before exiting or queued traces are lost.
   * @returns {Promise<void>}
   */
  /**
   * Resolve a user id to its username for trace attribution.
   * @param {number|string|null} userId
   * @returns {Promise<string|null>}
   */
  usernameForId: async function (userId) {
    if (!userId) return null;
    try {
      const { User } = require("../../models/user");
      const user = await User.get({ id: Number(userId) });
      return user?.username || null;
    } catch {
      return null;
    }
  },

  flush: async function () {
    try {
      await Promise.allSettled([...this._pending]);
      await this._client?.flush();
    } catch {
      return;
    }
  },

  /**
   * Record a completed chat interaction. Fire-and-forget - never throws.
   * @param {ChatTraceEvent} event
   */
  traceChat: function (event) {
    return this._track(
      (async () => {
        try {
          const client = await this.client();
          if (!client) return;
          client.traceChat(event);
        } catch (error) {
          console.error(`[Observability] traceChat failed`, error.message);
        }
      })()
    );
  },

  /**
   * Record a completed workspace-bound chat (UI, API, embed, OpenAI-compatible, telegram).
   * Fire-and-forget - never throws.
   * @param {Object} event
   * @param {string} event.name - trace name/tag (eg: "workspace-chat", "api-chat")
   * @param {Object} event.workspace
   * @param {Object|null} [event.thread]
   * @param {Object|null} [event.user]
   * @param {string|null} [event.sessionId] - overrides the default workspace/thread session id
   * @param {number|null} [event.chatId]
   * @param {string|null} [event.chatMode]
   * @param {string} event.message - the user prompt
   * @param {string} event.output - the final text response
   * @param {string} [event.model]
   * @param {Array} [event.messages] - full message array sent to the LLM
   * @param {Object} [event.metrics]
   * @param {Array} [event.sources] - citation sources from vector search
   */
  traceWorkspaceChat: function ({
    name,
    workspace,
    thread = null,
    user = null,
    sessionId = null,
    chatId = null,
    chatMode = null,
    message,
    output,
    model,
    messages,
    metrics,
    sources = [],
    metadata = {},
  }) {
    this.traceChat({
      name,
      input: message,
      output,
      model,
      messages,
      metrics,
      userId: user?.username || null,
      sessionId:
        sessionId ||
        (thread ? `${workspace.slug}:${thread.slug}` : workspace.slug),
      metadata: {
        workspaceId: workspace.id,
        workspaceSlug: workspace.slug,
        threadId: thread?.id || null,
        chatId,
        chatMode,
        ...metadata,
      },
      tags: [name],
      spans: sources.length
        ? [
            {
              name: "vector-search",
              input: message,
              output: sources.map(({ text: _text, ...rest }) => rest),
            },
          ]
        : [],
    });
  },

  /**
   * Record a completed agent (AIbitat) run with tool calls as child spans.
   * Fire-and-forget - never throws.
   * @param {Object} event
   * @param {Object} [event.invocation] - handlerProps invocation ({workspace, user_id, thread_id})
   * @param {string} event.input - the user prompt
   * @param {string} event.output - the final text response
   * @param {Array} [event.messages]
   * @param {string} [event.model]
   * @param {Object} [event.metrics] - cumulative usage from the agent provider
   * @param {Array<{toolName: string, arguments: any, result: any}>} [event.toolCalls]
   */
  traceAgentChat: function ({
    invocation,
    input,
    output,
    messages,
    model,
    metrics,
    toolCalls = [],
  }) {
    return this._track(
      (async () => {
        try {
          const client = await this.client();
          if (!client) return;
          const workspace = invocation?.workspace || {};
          const username = await this.usernameForId(invocation?.user_id);
          client.traceChat({
            name: "agent-chat",
            input,
            output,
            model,
            messages,
            metrics,
            userId: username,
            sessionId: invocation?.thread_id
              ? `${workspace.slug}:thread-${invocation.thread_id}`
              : workspace.slug || null,
            metadata: {
              workspaceId: workspace.id || null,
              workspaceSlug: workspace.slug || null,
              threadId: invocation?.thread_id || null,
            },
            tags: ["agent-chat"],
            spans: toolCalls.map((call) => ({
              name: `tool:${call.toolName}`,
              input: call.arguments,
              output: call.result,
            })),
          });
        } catch (error) {
          console.error(`[Observability] traceAgentChat failed`, error.message);
        }
      })()
    );
  },

  /**
   * Wraps an embedder instance so every embedChunks call is traced with
   * timing and chunk counts (never chunk contents).
   * @param {Object} embedder - an EmbeddingEngines provider instance
   * @returns {Object} the same embedder instance
   */
  wrapEmbedder: function (embedder) {
    if (typeof embedder?.embedChunks !== "function") return embedder;
    const embedChunks = embedder.embedChunks.bind(embedder);
    const embedTextInput = embedder.embedTextInput?.bind(embedder);

    embedder.embedChunks = async (textChunks = []) => {
      const start = Date.now();
      const embedContext = global.__embeddingProgress || {};
      const result = await embedChunks(textChunks);
      // embedTextInput routes through embedChunks in most engines - the flag
      // prevents a single query embed from also tracing as an ingest.
      if (!embedder._queryEmbed)
        this.traceEvent({
          name: "embedding-ingest",
          userId: await this.usernameForId(embedContext.userId),
          model: embedder.model || null,
          observationType: "embedding",
          metrics: embeddingMetrics(embedder, textChunks, start),
          metadata: {
            engine: embedder.constructor.name,
            model: embedder.model || null,
            chunkCount: textChunks.length,
            duration: (Date.now() - start) / 1000,
            workspaceSlug: embedContext.workspaceSlug || null,
          },
          tags: ["embedding"],
        });
      return result;
    };

    if (embedTextInput) {
      embedder.embedTextInput = async (textInput) => {
        const start = Date.now();
        embedder._queryEmbed = true;
        try {
          const result = await embedTextInput(textInput);
          this.traceEvent({
            name: "embedding-query",
            userId: embedder._traceUser || null,
            model: embedder.model || null,
            observationType: "embedding",
            metrics: embeddingMetrics(embedder, [String(textInput)], start),
            metadata: {
              engine: embedder.constructor.name,
              model: embedder.model || null,
              duration: (Date.now() - start) / 1000,
            },
            tags: ["embedding"],
          });
          return result;
        } finally {
          embedder._queryEmbed = false;
        }
      };
    }
    return embedder;
  },

  /**
   * Record a standalone event (eg: embedding batch). Fire-and-forget - never throws.
   * @param {TraceEvent} event
   */
  traceEvent: function (event) {
    return this._track(
      (async () => {
        try {
          const client = await this.client();
          if (!client) return;
          client.traceEvent(event);
        } catch (error) {
          console.error(`[Observability] traceEvent failed`, error.message);
        }
      })()
    );
  },
};

/**
 * Estimate token usage and cost for an embedding call. Cost is only present
 * when the configured embedding engine/model has known pricing.
 * @param {Object} embedder
 * @param {string[]} texts
 * @param {number} start - Date.now() at call start
 * @returns {{prompt_tokens: number, duration: number, inputCost?: number, outputCost?: number, totalCost?: number}}
 */
function embeddingMetrics(embedder, texts = [], start) {
  const {
    LLMPerformanceMonitor,
  } = require("../helpers/chat/LLMPerformanceMonitor");
  const { MODEL_PRICING } = require("../helpers/modelPricing");
  const prompt_tokens = LLMPerformanceMonitor.countTokens(
    texts.map((content) => ({ content }))
  );
  const cost = MODEL_PRICING.getCostBreakdown(
    process.env.EMBEDDING_ENGINE,
    embedder.model,
    { prompt_tokens }
  );
  return {
    prompt_tokens,
    duration: (Date.now() - start) / 1000,
    ...(cost ?? {}),
  };
}

// Flush any queued traces on graceful shutdown.
process.on("beforeExit", () => {
  if (Observability._client) Observability._client.shutdown();
});

module.exports = { Observability };

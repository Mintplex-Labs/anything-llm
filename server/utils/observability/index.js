const crypto = require("crypto");
const { AsyncLocalStorage } = require("async_hooks");

/**
 * @typedef {Object} TraceAttribution
 * Who and what a trace belongs to. Only resolved for the root observation of
 * a trace - nested observations inherit the trace they run inside of.
 * @property {string|Promise<string|null>|null} [userId] - stable user identifier (username, telegram tag, embed session user)
 * @property {{username?: string}|null} [user] - user record, used when `userId` is not set
 * @property {{id?: number, slug?: string}|null} [workspace]
 * @property {{id?: number, slug?: string}|null} [thread]
 * @property {string|null} [sessionId] - overrides the default workspace/thread session id
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} ObservationOptions
 * @property {string} name
 * @property {"span"|"generation"|"embedding"|"retriever"|"tool"} [type]
 * @property {any} [input]
 * @property {string|null} [model]
 * @property {Object} [metadata]
 * @property {() => TraceAttribution|Promise<TraceAttribution>} [attribution] - resolved only if this observation is a trace root
 * @property {boolean} [dropIfEmpty] - skip exporting when nothing was observed inside it (eg: a chat that hands off to an agent)
 */

/**
 * @typedef {Object} ExportedObservation
 * The shape every observability provider receives.
 * @property {string} traceId
 * @property {string} spanId
 * @property {string|null} parentSpanId
 * @property {string} name
 * @property {string} type
 * @property {number} startTime - epoch ms
 * @property {number} endTime - epoch ms
 * @property {any} [input]
 * @property {any} [output]
 * @property {string|null} [model]
 * @property {{prompt_tokens?: number, completion_tokens?: number, inputCost?: number, outputCost?: number, totalCost?: number}|null} [usage]
 * @property {Object} [metadata]
 * @property {string|null} [error]
 * @property {{userId: string|null, sessionId: string|null, tags: string[], metadata: Object, input: any, output: any}|null} trace - present on trace roots only
 */

/** Leaf observation types that never nest inside themselves - a wrapped call delegating to another wrapped call is one observation. */
const LEAF_TYPES = new Set(["generation", "embedding"]);
const instrumented = new WeakSet();
const streamObservations = new WeakMap();

/**
 * Facade for LLM observability providers (Langfuse, etc). Tracing happens at
 * the object level - LLM connectors, agent providers, embedders, vector dbs
 * and audio/image providers are wrapped where they are constructed, so every
 * caller is traced without knowing about it. Entry points open a trace with
 * `trace()` and everything that runs inside it nests under that trace via
 * AsyncLocalStorage.
 *
 * All methods are fire-and-forget and can never throw into a caller - if the
 * provider is unconfigured or the remote endpoint is down, tracing is a no-op.
 */
const Observability = {
  /** @type {import("./langfuse").LangfuseProvider|null|undefined} undefined = not loaded, null = disabled */
  _client: undefined,
  /** @type {Promise<void>|null} in-flight init so concurrent calls share one instance */
  _loading: null,
  /** @type {Set<Promise>} in-flight exports so flush() can wait for them */
  _pending: new Set(),
  _context: new AsyncLocalStorage(),

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
  flush: async function () {
    try {
      await Promise.allSettled([...this._pending]);
      await this._client?.flush();
    } catch {
      return;
    }
  },

  /**
   * Begin an observation nested under the active one, or as a new trace root
   * when nothing is active. Pair with `end()`. Returns null when tracing is
   * disabled or the observation would duplicate its parent.
   * @param {ObservationOptions} options
   * @returns {Object|null}
   */
  start: function ({
    name,
    type = "span",
    input,
    model = null,
    metadata = {},
    attribution = null,
    dropIfEmpty = false,
  }) {
    if (this._client === null) return null;
    if (this._client === undefined) this.client();

    const parent = this._context.getStore() || null;
    if (parent && LEAF_TYPES.has(type) && parent.type === type) return null;
    if (parent) parent.children++;

    const observation = {
      traceId: parent?.traceId ?? randomId(16),
      spanId: randomId(8),
      parentSpanId: parent?.spanId ?? null,
      name,
      type,
      input,
      model,
      metadata,
      attribution: parent ? null : attribution,
      parent,
      dropIfEmpty,
      startTime: Date.now(),
      children: 0,
      ended: false,
    };
    return observation;
  },

  /**
   * Complete an observation from `start()` and export it. Safe to call with null.
   * @param {Object|null} observation
   * @param {{output?: any, usage?: Object|null, metadata?: Object, error?: Error}} [result]
   */
  end: function (
    observation,
    { output, usage = null, metadata = {}, error } = {}
  ) {
    if (!observation || observation.ended) return;
    observation.ended = true;
    if (observation.dropIfEmpty && observation.children === 0 && !error) return;
    // A span's output defaults to the last model response produced inside it.
    if (observation.type === "generation" && output !== undefined)
      for (let span = observation.parent; span; span = span.parent)
        span.lastOutput = output;

    const endTime = Date.now();
    this._export(observation, {
      output: output ?? observation.lastOutput,
      usage,
      metadata,
      error,
      endTime,
    });
  },

  /**
   * Run `fn` as an observation; anything traced inside it nests underneath.
   * @template T
   * @param {ObservationOptions} options
   * @param {() => Promise<T>|T} fn
   * @param {{output?: (result: T) => any, usage?: (result: T) => Object|null}} [extract]
   * @returns {Promise<T>}
   */
  observe: async function (options, fn, { output, usage } = {}) {
    const observation = this.start(options);
    if (!observation) return fn();
    return this._context.run(observation, async () => {
      let result;
      try {
        result = await fn();
      } catch (error) {
        this.end(observation, { error });
        throw error;
      }
      this.end(observation, {
        output: output ? safely(() => output(result)) : undefined,
        usage: usage ? safely(() => usage(result)) : null,
      });
      return result;
    });
  },

  /**
   * Open a trace for a unit of work (a chat request, an agent run, a job).
   * Nested under the active trace if there is one, in which case
   * `attribution` is never resolved.
   * @template T
   * @param {{name: string, input?: any, attribution?: () => TraceAttribution|Promise<TraceAttribution>}} options
   * @param {() => Promise<T>|T} fn
   * @returns {Promise<T>}
   */
  trace: function ({ name, input, attribution }, fn) {
    return this.observe({ name, input, attribution, dropIfEmpty: true }, fn);
  },

  /**
   * Wrap an entry point function so each call runs inside its own trace.
   * @param {string} name
   * @param {Function} fn
   * @param {(...args: any[]) => TraceAttribution & {input?: any}} describe - maps the call's arguments to the trace input + attribution
   * @returns {Function}
   */
  traced: function (name, fn, describe) {
    const self = this;
    return function (...args) {
      if (self._client === null) return fn.apply(this, args);
      const { input, ...attribution } = safely(() => describe(...args)) || {};
      return self.trace({ name, input, attribution: () => attribution }, () =>
        fn.apply(this, args)
      );
    };
  },

  /**
   * Trace every completion on a chat LLM connector (`getLLMProvider`).
   * @param {Object} connector - an AiProviders instance
   * @param {string} providerSlug - used to price usage
   * @returns {Object} the same connector
   */
  wrapLLM: function (connector, providerSlug) {
    if (!markInstrumented(connector)) return connector;
    const generation = (messages) => ({
      name: "chat-completion",
      type: "generation",
      input: messages,
      model: connector.model || null,
      metadata: { provider: providerSlug },
    });
    const usage = (metrics) => withCost(providerSlug, connector.model, metrics);

    if (typeof connector.getChatCompletion === "function") {
      const getChatCompletion = connector.getChatCompletion.bind(connector);
      connector.getChatCompletion = (messages, ...args) =>
        this.observe(
          generation(messages),
          () => getChatCompletion(messages, ...args),
          {
            output: (result) => result?.textResponse,
            usage: (result) => usage(result?.metrics),
          }
        );
    }

    // Streams are opened and drained by two separate calls, so the
    // observation is carried from one to the other on the stream object.
    if (
      typeof connector.streamGetChatCompletion === "function" &&
      typeof connector.handleStream === "function"
    ) {
      const streamGetChatCompletion =
        connector.streamGetChatCompletion.bind(connector);
      const handleStream = connector.handleStream.bind(connector);
      connector.streamGetChatCompletion = async (messages, ...args) => {
        const observation = this.start(generation(messages));
        try {
          const stream = await streamGetChatCompletion(messages, ...args);
          if (observation && stream && typeof stream === "object")
            streamObservations.set(stream, observation);
          return stream;
        } catch (error) {
          this.end(observation, { error });
          throw error;
        }
      };
      connector.handleStream = async (response, stream, ...args) => {
        const observation =
          stream && typeof stream === "object"
            ? streamObservations.get(stream)
            : null;
        try {
          const text = await handleStream(response, stream, ...args);
          this.end(observation, {
            output: text,
            usage: usage(stream?.metrics),
          });
          return text;
        } catch (error) {
          this.end(observation, { error });
          throw error;
        }
      };
    }
    return connector;
  },

  /**
   * Trace every completion on an agent provider (`aibitat.getProviderForConfig`).
   * Usage comes from the provider's own per-call record, which is already priced.
   * @param {Object} provider - an aibitat Provider instance
   * @returns {Object} the same provider
   */
  wrapAgentProvider: function (provider) {
    if (!markInstrumented(provider)) return provider;
    for (const method of ["complete", "stream"]) {
      if (typeof provider[method] !== "function") continue;
      const original = provider[method].bind(provider);
      provider[method] = (messages, ...args) => {
        const start = Date.now();
        return this.observe(
          {
            name: "agent-completion",
            type: "generation",
            input: messages,
            model: provider.model || null,
            metadata: {
              provider: provider.providerSlug || provider.constructor.name,
            },
          },
          () => original(messages, ...args),
          {
            output: (result) =>
              result?.functionCall
                ? { functionCall: result.functionCall }
                : result?.textResponse ?? result?.result ?? null,
            usage: () => {
              const usage = provider.getUsage?.();
              const recordedAt = usage?.timestamp
                ? new Date(usage.timestamp).getTime()
                : 0;
              return recordedAt >= start ? usage : null;
            },
          }
        );
      };
    }
    return provider;
  },

  /**
   * Trace embedding calls (`getEmbeddingEngineSelection`) with timing and
   * chunk counts - never chunk contents.
   * @param {Object} embedder - an EmbeddingEngines provider instance
   * @returns {Object} the same embedder
   */
  wrapEmbedder: function (embedder) {
    if (!markInstrumented(embedder)) return embedder;
    const engine = embedder.constructor.name;

    if (typeof embedder.embedChunks === "function") {
      const embedChunks = embedder.embedChunks.bind(embedder);
      embedder.embedChunks = (textChunks = [], ...args) => {
        // Document ingestion runs outside any request trace - attribute it
        // to the uploading user from the embedding progress context.
        const progress = global.__embeddingProgress || {};
        return this.observe(
          {
            name: "embedding-ingest",
            type: "embedding",
            model: embedder.model || null,
            metadata: { engine, chunkCount: textChunks.length },
            attribution: async () => ({
              userId: await this.usernameForId(progress.userId),
              workspace: { slug: progress.workspaceSlug },
            }),
          },
          () => embedChunks(textChunks, ...args),
          { usage: () => embeddingUsage(embedder, textChunks) }
        );
      };
    }

    if (typeof embedder.embedTextInput === "function") {
      const embedTextInput = embedder.embedTextInput.bind(embedder);
      embedder.embedTextInput = (textInput, ...args) =>
        this.observe(
          {
            name: "embedding-query",
            type: "embedding",
            input: textInput,
            model: embedder.model || null,
            metadata: { engine },
          },
          () => embedTextInput(textInput, ...args),
          { usage: () => embeddingUsage(embedder, [String(textInput)]) }
        );
    }
    return embedder;
  },

  /**
   * Trace similarity searches (`getVectorDbClass`) with the cited sources.
   * @param {Object} vectorDb - a vectorDbProviders instance
   * @returns {Object} the same instance
   */
  wrapVectorDb: function (vectorDb) {
    if (!markInstrumented(vectorDb)) return vectorDb;
    if (typeof vectorDb.performSimilaritySearch !== "function") return vectorDb;
    const performSimilaritySearch =
      vectorDb.performSimilaritySearch.bind(vectorDb);
    vectorDb.performSimilaritySearch = (params = {}, ...args) =>
      this.observe(
        {
          name: "vector-search",
          type: "retriever",
          input: params.input,
          metadata: {
            vectorDb: vectorDb.name || vectorDb.constructor.name,
            namespace: params.namespace,
            topN: params.topN,
            rerank: !!params.rerank,
          },
        },
        () => performSimilaritySearch(params, ...args),
        {
          output: (result) =>
            (result?.sources || []).map(({ text: _text, ...rest }) => rest),
        }
      );
    return vectorDb;
  },

  /**
   * Trace an image generation provider (`getImageGeneratorProvider`). Image
   * APIs have no pricing source, so these carry no cost.
   * @param {Object} provider
   * @returns {Object} the same provider
   */
  wrapImageGenerator: function (provider) {
    if (!markInstrumented(provider)) return provider;
    for (const method of ["generateImage", "editImage"]) {
      if (typeof provider[method] !== "function") continue;
      const original = provider[method].bind(provider);
      provider[method] = (params = {}, ...args) =>
        this.observe(
          {
            name: method === "editImage" ? "image-edit" : "image-generation",
            type: "generation",
            input: params.prompt,
            model: provider.model || process.env.IMAGE_GEN_MODEL_PREF || null,
            metadata: {
              provider: provider.constructor.name,
              size: params.size || null,
              referenceImages: params.images?.length ?? 0,
            },
          },
          () => original(params, ...args),
          {
            output: (result) => ({
              imageBytes: result?.buffer?.length ?? null,
            }),
          }
        );
    }
    return provider;
  },

  /**
   * Trace a TTS provider (`getTTSProvider`) with timing and payload sizes.
   * @param {Object} provider
   * @returns {Object} the same provider
   */
  wrapTTS: function (provider) {
    if (!markInstrumented(provider) || typeof provider.ttsBuffer !== "function")
      return provider;
    const ttsBuffer = provider.ttsBuffer.bind(provider);
    provider.ttsBuffer = (textInput, ...args) =>
      this.observe(
        {
          name: "text-to-speech",
          input: textInput,
          model: provider.model || null,
          metadata: {
            provider: provider.constructor.name,
            characters: String(textInput || "").length,
          },
        },
        () => ttsBuffer(textInput, ...args),
        { output: (result) => ({ audioBytes: result?.length ?? null }) }
      );
    return provider;
  },

  /**
   * Trace an STT provider (`getSTTProvider`) with timing and payload sizes.
   * @param {Object} provider
   * @returns {Object} the same provider
   */
  wrapSTT: function (provider) {
    if (
      !markInstrumented(provider) ||
      typeof provider.transcribe !== "function"
    )
      return provider;
    const transcribe = provider.transcribe.bind(provider);
    provider.transcribe = (audioBuffer, ...args) =>
      this.observe(
        {
          name: "speech-to-text",
          input: { audioBytes: audioBuffer?.length ?? null },
          model: provider.model || null,
          metadata: { provider: provider.constructor.name },
        },
        () => transcribe(audioBuffer, ...args),
        { output: (result) => (typeof result === "string" ? result : null) }
      );
    return provider;
  },

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

  /**
   * Attribution for an agent run from its handlerProps invocation, so agent
   * traces share the same user + session as regular chats in that thread.
   * @param {Object} [invocation] - {workspace, user_id, thread_id}
   * @returns {Promise<TraceAttribution>}
   */
  agentAttribution: async function (invocation = {}) {
    let thread = null;
    if (invocation?.thread_id) {
      try {
        const { WorkspaceThread } = require("../../models/workspaceThread");
        thread = await WorkspaceThread.get({
          id: Number(invocation.thread_id),
        });
      } catch {}
    }
    return {
      userId: this.usernameForId(invocation?.user_id),
      workspace: invocation?.workspace || null,
      thread,
    };
  },

  _export: function (observation, { output, usage, metadata, error, endTime }) {
    const isRoot = !observation.parentSpanId;
    const promise = (async () => {
      try {
        const client = await this.client();
        if (!client) return;
        const trace = isRoot
          ? await resolveAttribution(observation, output)
          : null;
        client.export({
          traceId: observation.traceId,
          spanId: observation.spanId,
          parentSpanId: observation.parentSpanId,
          name: observation.name,
          type: observation.type,
          startTime: observation.startTime,
          endTime,
          input: observation.input,
          output,
          model: observation.model,
          usage,
          metadata: {
            ...observation.metadata,
            ...(trace?.metadata || {}),
            ...metadata,
          },
          error: error ? error.message || String(error) : null,
          trace,
        });
      } catch (exportError) {
        console.error(`[Observability] export failed`, exportError.message);
      }
    })();
    this._pending.add(promise);
    promise.finally(() => this._pending.delete(promise));
  },
};

/**
 * Resolve a root observation's attribution into trace-level fields.
 * @param {Object} observation
 * @param {any} output
 */
async function resolveAttribution(observation, output) {
  const attribution =
    (await safelyAsync(() => observation.attribution?.())) || {};
  const { user, workspace, thread, metadata = {} } = attribution;
  const userId =
    (await safelyAsync(() => attribution.userId)) ?? user?.username ?? null;
  const sessionId =
    attribution.sessionId ??
    (workspace?.slug
      ? thread?.slug
        ? `${workspace.slug}:${thread.slug}`
        : workspace.slug
      : null);
  return {
    userId,
    sessionId,
    tags: [observation.name],
    input: observation.input,
    output,
    metadata: {
      ...(workspace
        ? {
            workspaceId: workspace.id ?? null,
            workspaceSlug: workspace.slug ?? null,
          }
        : {}),
      ...(thread
        ? { threadId: thread.id ?? null, threadSlug: thread.slug ?? null }
        : {}),
      ...metadata,
    },
  };
}

/**
 * Add the app's model pricing to a usage record.
 * @param {string} providerSlug
 * @param {string} model
 * @param {Object} [metrics]
 */
function withCost(providerSlug, model, metrics) {
  if (!metrics) return null;
  const { MODEL_PRICING } = require("../helpers/modelPricing");
  const cost = MODEL_PRICING.getCostBreakdown(providerSlug, model, metrics);
  return { ...metrics, ...(cost ?? {}) };
}

/**
 * Estimate token usage and cost for an embedding call. Embedders never report
 * usage, so tokens are tiktoken estimates.
 * @param {Object} embedder
 * @param {string[]} texts
 */
function embeddingUsage(embedder, texts = []) {
  const {
    LLMPerformanceMonitor,
  } = require("../helpers/chat/LLMPerformanceMonitor");
  const prompt_tokens = LLMPerformanceMonitor.countTokens(
    texts.map((content) => ({ content }))
  );
  return withCost(process.env.EMBEDDING_ENGINE, embedder.model, {
    prompt_tokens,
  });
}

/** @returns {boolean} false if the object is missing or was already wrapped */
function markInstrumented(object) {
  if (!object || typeof object !== "object" || instrumented.has(object))
    return false;
  instrumented.add(object);
  return true;
}

function randomId(bytes) {
  return crypto.randomBytes(bytes).toString("hex");
}

function safely(fn) {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

async function safelyAsync(fn) {
  try {
    return await fn();
  } catch {
    return undefined;
  }
}

// Flush any queued traces on graceful shutdown.
process.on("beforeExit", () => {
  if (Observability._client) Observability._client.shutdown();
});

module.exports = { Observability };

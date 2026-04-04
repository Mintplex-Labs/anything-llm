const { resolveRouterForWorkspace, evaluateRouting } = require("../../router");
const {
  cacheKey,
  getCachedRoute,
  setCachedRoute,
} = require("../../router/cooldown");
const { getLLMProvider } = require("../../helpers");

class AnythingLLMModelRouter {
  constructor(workspace, embedder = null) {
    this.className = "AnythingLLMModelRouter";
    this.workspace = workspace;
    this.embedder = embedder;
    this.router = null;
    this.resolvedRoute = null;
    this.delegateProvider = null;
    this.defaultTemp = 0.7;
    this.log(
      `Initialized for workspace "${workspace?.name || workspace?.slug}"`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  /**
   * Resolve the route and instantiate the delegate LLM provider.
   * Must be called before any chat methods.
   * @param {Object} context - { prompt, conversationHistory, conversationTokenCount }
   * @param {Object} opts - { user, thread }
   */
  async resolve(context = {}, { user = null, thread = null } = {}) {
    this.router = await resolveRouterForWorkspace(this.workspace);
    if (!this.router)
      throw new Error("No model router found for this workspace.");

    const key = cacheKey(user?.id, this.workspace.slug, thread?.slug);
    const prompt = context.prompt || "";
    const cached = getCachedRoute(key, prompt);

    if (cached) {
      this.resolvedRoute = cached;
      this.log(
        `Using cached route: ${cached.provider}/${cached.model} (rule: ${cached.ruleTitle || "fallback"})`
      );
    } else {
      this.resolvedRoute = await evaluateRouting(
        this.router,
        this.router.rules || [],
        context
      );
      setCachedRoute(key, this.resolvedRoute, prompt);
      this.log(
        `Routed to ${this.resolvedRoute.provider}/${this.resolvedRoute.model} ` +
          `(rule: ${this.resolvedRoute.ruleTitle || "fallback"})`
      );
    }

    this.delegateProvider = getLLMProvider({
      provider: this.resolvedRoute.provider,
      model: this.resolvedRoute.model,
    });
  }

  get routingMetadata() {
    if (!this.resolvedRoute) return null;
    return {
      routedTo: {
        provider: this.resolvedRoute.provider,
        model: this.resolvedRoute.model,
        ruleTitle: this.resolvedRoute.ruleTitle,
        ruleType: this.resolvedRoute.ruleType,
        isFallback: this.resolvedRoute.isFallback,
        routerName: this.router?.name,
      },
    };
  }

  streamingEnabled() {
    return this.delegateProvider?.streamingEnabled?.() ?? false;
  }

  promptWindowLimit() {
    return this.delegateProvider?.promptWindowLimit?.() ?? 4096;
  }

  async isValidChatCompletionModel() {
    return true;
  }

  async constructPrompt(args) {
    return this.delegateProvider.constructPrompt(args);
  }

  async getChatCompletion(messages, opts = {}) {
    return this.delegateProvider.getChatCompletion(messages, opts);
  }

  async streamGetChatCompletion(messages, opts = {}) {
    return this.delegateProvider.streamGetChatCompletion(messages, opts);
  }

  async handleStream(response, stream, opts = {}) {
    return this.delegateProvider.handleStream(response, stream, opts);
  }

  async embedTextInput(textInput) {
    return this.delegateProvider.embedTextInput(textInput);
  }

  async embedChunks(textChunks) {
    return this.delegateProvider.embedChunks(textChunks);
  }

  async compressMessages(promptArgs, rawHistory) {
    return this.delegateProvider.compressMessages(promptArgs, rawHistory);
  }
}

module.exports = { AnythingLLMModelRouter };

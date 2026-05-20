const { ModelRouterService } = require("../../router");
const { getLLMProvider } = require("../../helpers");

class AnythingLLMModelRouter {
  constructor(workspace, embedder = null) {
    this.className = "AnythingLLMModelRouter";
    this.workspace = workspace;
    this.embedder = embedder;
    this.routerService = ModelRouterService.getInstance();
    this.router = null;
    this.resolvedRoute = null;
    this._routeKey = null;
    this.delegateProvider = null;
    this.defaultTemp = 0.7;
    this.routerService.log(
      `Initialized for workspace "${workspace?.name || workspace?.slug}"`
    );
  }

  /**
   * Resolve the route and instantiate the delegate LLM provider.
   * Must be called before any chat methods.
   *
   * Flow:
   * 1. Evaluate calculated rules (always — they're free)
   * 2. Evaluate LLM rules (uses cache to avoid expensive calls)
   * 3. If nothing matched, use the sticky route (previous model stays)
   * 4. If sticky expired, fall back to the default model
   *
   * @param {Object} context - { prompt, conversationHistory, conversationTokenCount }
   * @param {Object} opts - { user, thread }
   */
  async resolve(context = {}, { user = null, thread = null } = {}) {
    this.router = await this.routerService.resolveRouterForWorkspace(
      this.workspace
    );
    if (!this.router)
      throw new Error("No model router found for this workspace.");

    const rules = this.router.rules || [];
    const stickyMs = (this.router.cooldown_seconds ?? 300) * 1000;
    this._routeKey = this.routerService.routeCacheKey(
      user?.id,
      this.workspace.slug,
      thread?.slug
    );

    this.routerService.logRoutingContext(this.router, rules, context);

    // Step 1: Calculated rules (always re-evaluated, they're instant)
    const calcResult = this.routerService.evaluateCalculatedRules(
      rules,
      context
    );
    if (calcResult) {
      this.resolvedRoute = calcResult;
      this.routerService.setStickyRoute(this._routeKey, calcResult);
      this.#finalize();
      return;
    }

    // Step 2: LLM rules (cached to avoid expensive re-classification)
    const { route: llmResult } = await this.routerService.evaluateLLMRules(
      this._routeKey,
      rules,
      context,
      this.router,
      stickyMs
    );
    if (llmResult) {
      this.resolvedRoute = llmResult;
      this.routerService.setStickyRoute(this._routeKey, llmResult);
      this.#finalize();
      return;
    }

    // Step 3: No rule matched — check sticky route
    const sticky = this.routerService.getStickyRoute(this._routeKey, stickyMs);
    if (sticky) {
      this.resolvedRoute = sticky;
      this.routerService.log(
        `No rules matched → Sticky route active: ${sticky.provider}/${sticky.model} (rule: ${sticky.ruleTitle || "unknown"})`
      );
      this.#finalize();
      return;
    }

    // Step 4: Sticky expired — use fallback
    this.resolvedRoute = {
      provider: this.router.fallback_provider,
      model: this.router.fallback_model,
      ruleTitle: null,
      ruleType: null,
      isFallback: true,
    };
    this.routerService.log(
      `No rules matched, sticky expired → Fallback: ${this.router.fallback_provider}/${this.router.fallback_model}`
    );
    this.#finalize();
  }

  #finalize() {
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
        shouldNotify: this.routerService.shouldNotify(
          this._routeKey,
          this.resolvedRoute
        ),
        routerName: this.router?.name,
        fallbackProvider: this.router?.fallback_provider,
        fallbackModel: this.router?.fallback_model,
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

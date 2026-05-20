const { ModelRouter } = require("../../models/modelRouter");
const {
  classifyWithLLM,
} = require("../agents/aibitat/plugins/router-classifier");

/**
 * Singleton service for model routing with built-in caching and rule evaluation.
 *
 * Two-layer caching strategy:
 * 1. LLM classification cache — prevents expensive LLM calls on every message.
 *    Cached for the full sticky window.
 * 2. Sticky route — when a rule matches, the model "sticks" so follow-up messages
 *    that don't match any rule stay on the same model instead of bouncing to fallback.
 *
 * TTL management:
 * - LLM classification cache: cached for the full sticky window
 * - Sticky route: cached for the full sticky window
 * - LLM no match cooldown: 30s debounce for "no match" LLM results
 * -- We want to avoid spamming the LLM with no match results, but still re-evaluate quickly when the topic changes.
 * - If there has been a match, we want to keep the model for the full sticky window since we likely want to keep the same model for the same topic.
 *
 * This is purely time based caching, not classified by some other model or service simply because it is straightforward and easy to implement
 * without introducing additional complexity and overhead on lower-end devices.
 */
class ModelRouterService {
  static instance = null;
  static DEFAULT_STICKY_MS = 300_000; // 5 minutes
  static LLM_NO_MATCH_COOLDOWN_MS = 30_000; // 30s debounce for "no match" LLM results
  static REGEX_INPUT_CAP = 10_000;

  constructor() {
    if (ModelRouterService.instance) return ModelRouterService.instance;
    ModelRouterService.instance = this;

    this.routerCache = new Map();
    this.stickyRoutes = new Map();
    this.llmCache = new Map();
    this.lastNotifiedRoute = new Map();
    this.LOG_PREFIX = "\x1b[35m[ModelRouterService]\x1b[0m";
  }

  /**
   * Get the singleton instance.
   * @returns {ModelRouterService}
   */
  static getInstance() {
    if (!ModelRouterService.instance) new ModelRouterService();
    return ModelRouterService.instance;
  }

  log(text, ...args) {
    console.log(`${this.LOG_PREFIX} ${text}`, ...args);
  }

  logIndent(text, ...args) {
    console.log(`${this.LOG_PREFIX}   ${text}`, ...args);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Router resolution & caching
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Load the router config and rules for a workspace.
   * Caches the result to avoid repeated DB lookups.
   * @param {Object} workspace - A workspaces record with router_id set
   * @returns {Promise<Object|null>} Router with rules, or null if not found
   */
  async resolveRouterForWorkspace(workspace) {
    if (!workspace?.router_id) return null;

    const cacheKey = `router:${workspace.router_id}`;
    const cached = this.routerCache.get(cacheKey);
    if (cached) {
      this.log(`Using cached router "${cached.name}" (id: ${cached.id})`);
      return cached;
    }

    const router = await ModelRouter.getWithRules({ id: workspace.router_id });
    if (router) {
      this.routerCache.set(cacheKey, router);
      this.log(
        `Loaded router "${router.name}" with ${router.rules?.length ?? 0} rules`
      );
    }
    return router;
  }

  /**
   * Invalidate the cached router config (e.g., after rules are edited).
   * @param {number} routerId
   */
  static invalidateRouter(routerId) {
    const svc = ModelRouterService.getInstance();
    const cacheKey = `router:${routerId}`;
    if (!svc.routerCache.has(cacheKey)) return;
    svc.log(`Invalidated cached router (id: ${routerId})`);
    svc.routerCache.delete(cacheKey);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sticky routes
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Build a cache key from user/workspace/thread identifiers.
   * @param {number|null} userId
   * @param {string} workspaceSlug
   * @param {string|null} threadSlug
   * @returns {string}
   */
  routeCacheKey(userId, workspaceSlug, threadSlug) {
    return `${userId || 0}:${workspaceSlug}:${threadSlug || "default"}`;
  }

  /**
   * Get the sticky route if still within the window.
   * @param {string} key
   * @param {number} stickyMs
   * @returns {{ provider: string, model: string, ruleTitle: string|null, ruleType: string|null, isFallback: boolean }|null}
   */
  getStickyRoute(key, stickyMs = ModelRouterService.DEFAULT_STICKY_MS) {
    if (stickyMs <= 0) return null;
    const entry = this.stickyRoutes.get(key);
    if (!entry) {
      this.log(`Sticky route: MISS (no entry)`);
      return null;
    }
    const ageMs = Date.now() - entry.stickyAt;
    if (ageMs > stickyMs) {
      this.stickyRoutes.delete(key);
      this.log(
        `Sticky route: EXPIRED (age: ${Math.round(ageMs / 1000)}s > ${Math.round(stickyMs / 1000)}s)`
      );
      return null;
    }

    // Refresh TTL on access so follow-up messages keep the route "hot"
    entry.stickyAt = Date.now();
    this.log(
      `Sticky route: HIT → ${entry.route.provider}/${entry.route.model} (ttl reset, ${Math.round(stickyMs / 1000)}s window renewed)`
    );
    return entry.route;
  }

  /**
   * Set the sticky route (only for non-fallback matches).
   * Resets the timer so the window extends from the last match.
   * @param {string} key
   * @param {{ provider: string, model: string, ruleTitle: string|null, ruleType: string|null, isFallback: boolean }} route
   */
  setStickyRoute(key, route) {
    this.stickyRoutes.set(key, { route, stickyAt: Date.now() });
    this.log(
      `Sticky route: SET → ${route.provider}/${route.model} (rule: ${route.ruleTitle || "unknown"})`
    );
  }

  /**
   * Clear a sticky route (e.g., on new conversation).
   * @param {string} key
   */
  clearStickyRoute(key) {
    this.stickyRoutes.delete(key);
  }

  /**
   * Reset all routing state for a given workspace context (sticky route,
   * LLM classification cache, and last-notified route). Safe to call even
   * when the workspace has no router — returns early in that case.
   * @param {Object} workspace
   * @param {Object|null} user
   * @param {Object|null} thread
   */
  static resetForWorkspace(workspace, user = null, thread = null) {
    if (!workspace?.router_id) return;
    const svc = ModelRouterService.getInstance();
    const key = svc.routeCacheKey(
      user?.id ?? null,
      workspace.slug,
      thread?.slug ?? null
    );
    svc.stickyRoutes.delete(key);
    svc.llmCache.delete(key);
    svc.lastNotifiedRoute.delete(key);
    svc.log(
      `Reset routing state for key "${key}" (workspace: ${workspace.slug})`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LLM classification cache
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get cached LLM classification result if still within window.
   * @param {string} key
   * @param {number} ttlMs
   * @returns {Object|null} The cached matched rule (or null sentinel meaning "no match"), or undefined if no cache
   */
  getCachedLLMResult(key, ttlMs = ModelRouterService.DEFAULT_STICKY_MS) {
    const entry = this.llmCache.get(key);
    if (!entry) {
      this.log(`LLM cache: MISS (no entry)`);
      return undefined;
    }
    // "No match" results use a short cooldown so we don't spam the LLM on
    // rapid messages, but still re-evaluate quickly when the topic changes.
    const effectiveTtl = entry.result
      ? ttlMs
      : ModelRouterService.LLM_NO_MATCH_COOLDOWN_MS;
    const ageMs = Date.now() - entry.cachedAt;
    if (ageMs > effectiveTtl) {
      this.llmCache.delete(key);
      this.log(
        `LLM cache: EXPIRED (age: ${Math.round(ageMs / 1000)}s > ${Math.round(effectiveTtl / 1000)}s)`
      );
      return undefined;
    }
    this.log(
      `LLM cache: HIT → ${entry.result ? `"${entry.result.title}"` : "no match"} (age: ${Math.round(ageMs / 1000)}s, ttl: ${Math.round((effectiveTtl - ageMs) / 1000)}s remaining)`
    );
    return entry.result;
  }

  /**
   * Cache an LLM classification result.
   * @param {string} key
   * @param {Object|null} result - The matched rule, or null if no match
   */
  setCachedLLMResult(key, result) {
    this.llmCache.set(key, { result, cachedAt: Date.now() });
    this.log(`LLM cache: SET → ${result ? `"${result.title}"` : "no match"}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Notification deduplication
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Check if a route notification should be emitted.
   * Notifies when:
   * - First message routes to a non-fallback model (a rule matched)
   * - Model changes from one to another
   * - Falls back from a non-fallback model to fallback
   *
   * Does NOT notify when:
   * - First message uses fallback (just the default behavior)
   * - Same model as last time
   *
   * @param {string} key - The route cache key for this user/workspace/thread
   * @param {{ provider: string, model: string, isFallback: boolean }} route - The resolved route
   * @returns {boolean} true if a notification should fire
   */
  shouldNotify(key, route) {
    const last = this.lastNotifiedRoute.get(key);

    // Same model as before — no notification
    if (
      last &&
      last.provider === route.provider &&
      last.model === route.model
    ) {
      return false;
    }

    // First message (no previous route recorded)
    if (!last) {
      // Only notify if a rule matched (not just using the fallback default)
      if (route.isFallback) {
        // Record it but don't notify — this is just the default
        this.lastNotifiedRoute.set(key, {
          provider: route.provider,
          model: route.model,
        });
        return false;
      }
      // A rule matched on first message — notify
      this.lastNotifiedRoute.set(key, {
        provider: route.provider,
        model: route.model,
      });
      return true;
    }

    // Model changed — always notify (includes falling back to default)
    this.lastNotifiedRoute.set(key, {
      provider: route.provider,
      model: route.model,
    });
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Route evaluation
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Evaluate only calculated rules against the given context.
   * @param {Array} rules - All rules (will be filtered to enabled calculated rules)
   * @param {Object} context
   * @returns {{ provider: string, model: string, ruleTitle: string|null, ruleType: string|null, isFallback: boolean }|null}
   */
  evaluateCalculatedRules(rules, context) {
    const calcRules = rules.filter((r) => r.enabled && r.type === "calculated");
    for (let i = 0; i < calcRules.length; i++) {
      const rule = calcRules[i];
      const matched = this.#evaluateCalculatedRule(rule, context);
      this.log(
        `Rule "${rule.title}" (calculated, ${rule.condition_logic}): ${matched ? "MATCHED" : "no match"}`
      );
      if (matched) {
        this.log(`→ Routing to ${rule.route_provider}/${rule.route_model}`);
        return this.#routeFromRule(rule);
      }
    }
    return null;
  }

  /**
   * Evaluate LLM rules, using cache if available.
   * @param {string} cacheKey - Key for LLM result caching
   * @param {Array} rules - All rules (will be filtered to enabled LLM rules)
   * @param {Object} context
   * @param {Object} router - The router config (needed for classifyWithLLM)
   * @param {number} stickyMs - TTL for LLM cache
   * @returns {Promise<{ route: Object|null, fromCache: boolean }>}
   */
  async evaluateLLMRules(cacheKey, rules, context, router, stickyMs) {
    const llmRules = rules.filter((r) => r.enabled && r.type === "llm");
    if (llmRules.length === 0) return { route: null, fromCache: false };

    const cached = this.getCachedLLMResult(cacheKey, stickyMs);
    if (cached !== undefined) {
      this.log(
        `LLM classification cache hit → ${cached ? `"${cached.title}"` : "no match"}`
      );
      return {
        route: cached ? this.#routeFromRule(cached) : null,
        fromCache: true,
      };
    }

    this.log(
      `Evaluating LLM batch of ${llmRules.length} rules: [${llmRules.map((r) => `"${r.title}"`).join(", ")}]`
    );
    const matched = await classifyWithLLM(llmRules, context.prompt, router);
    this.setCachedLLMResult(cacheKey, matched || null);

    if (matched) {
      this.log(
        `LLM classified as "${matched.title}" → Routing to ${matched.route_provider}/${matched.route_model}`
      );
      return { route: this.#routeFromRule(matched), fromCache: false };
    }

    this.log(`LLM batch: no match`);
    return { route: null, fromCache: false };
  }

  /**
   * Full routing evaluation with logging context info.
   * @param {Object} router
   * @param {Array} rules
   * @param {Object} context
   */
  logRoutingContext(router, rules, context) {
    const enabledRules = rules.filter((r) => r.enabled);
    this.log(
      `Evaluating ${enabledRules.length} enabled rules (of ${rules.length} total) for router "${router.name}"`
    );
    this.log(
      `Context: prompt="${(context.prompt || "").slice(0, 100)}${context.prompt?.length > 100 ? "..." : ""}", ` +
        `tokens=${context.conversationTokenCount ?? 0}, messages=${context.conversationMessageCount ?? 0}, ` +
        `attachments=${context.attachments?.length ?? 0}`
    );
  }

  #routeFromRule(rule) {
    return {
      provider: rule.route_provider,
      model: rule.route_model,
      ruleTitle: rule.title,
      ruleType: rule.type,
      isFallback: false,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Deterministic rule evaluation
  // ─────────────────────────────────────────────────────────────────────────────

  #evaluateCalculatedRule(rule, context) {
    if (rule.type !== "calculated") return false;
    const { conditions, condition_logic: logic } = rule;
    if (!Array.isArray(conditions) || conditions.length === 0) return false;

    const method = logic === "OR" ? "some" : "every";
    const results = conditions.map((c) => {
      const result = this.#evaluateCondition(
        c.property,
        c.comparator,
        c.value,
        context
      );
      const contextVal = this.#getContextValue(c.property, context);
      const displayVal =
        c.property === "promptContent"
          ? `"${String(contextVal).slice(0, 50)}${contextVal?.length > 50 ? "..." : ""}"`
          : contextVal;
      this.logIndent(
        `${c.property} ${c.comparator} "${c.value}" → context=${displayVal} → ${result}`
      );
      return result;
    });
    return results[method === "some" ? "some" : "every"]((r) => r);
  }

  #evaluateCondition(property, comparator, value, context) {
    const contextValue = this.#getContextValue(property, context);
    if (contextValue === undefined) return false;

    if (property === "promptContent" || property === "hasImageAttachment")
      return this.#evaluateStringCondition(contextValue, comparator, value);

    return this.#evaluateNumericCondition(contextValue, comparator, value);
  }

  #getContextValue(property, context) {
    switch (property) {
      case "promptContent":
        return context.prompt || "";
      case "conversationTokenCount":
        return context.conversationTokenCount ?? 0;
      case "conversationMessageCount":
        return context.conversationMessageCount ?? 0;
      case "currentHour":
        return new Date().getHours();
      case "hasImageAttachment":
        return (context.attachments || []).some((a) =>
          a.mime?.startsWith("image/")
        )
          ? "true"
          : "false";
      default:
        return undefined;
    }
  }

  #evaluateStringCondition(contextValue, comparator, value) {
    switch (comparator) {
      case "contains":
        return String(value)
          .split(",")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean)
          .some((keyword) =>
            String(contextValue).toLowerCase().includes(keyword)
          );
      case "matches":
        return this.#matchesRegex(String(contextValue), String(value));
      case "eq":
        return (
          String(contextValue).toLowerCase() === String(value).toLowerCase()
        );
      case "neq":
        return (
          String(contextValue).toLowerCase() !== String(value).toLowerCase()
        );
      default:
        return false;
    }
  }

  #matchesRegex(input, value) {
    const trimmed = value.trim();
    if (!trimmed) return false;

    const delimited = trimmed.match(/^\/(.+)\/([gimsuy]*)$/);
    const pattern = delimited ? delimited[1] : trimmed;
    const flags = delimited ? delimited[2] || "i" : "i";

    try {
      const regex = new RegExp(pattern, flags);
      return regex.test(input.slice(0, ModelRouterService.REGEX_INPUT_CAP));
    } catch {
      return false;
    }
  }

  #evaluateNumericCondition(contextValue, comparator, value) {
    const numContext = Number(contextValue);
    if (isNaN(numContext)) return false;

    if (comparator === "between") {
      const parts = String(value).split(",").map(Number);
      if (parts.length !== 2 || parts.some(isNaN)) return false;
      const [min, max] = parts;
      return numContext >= min && numContext <= max;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return false;

    switch (comparator) {
      case "gt":
        return numContext > numValue;
      case "gte":
        return numContext >= numValue;
      case "lt":
        return numContext < numValue;
      case "lte":
        return numContext <= numValue;
      case "eq":
        return numContext === numValue;
      case "neq":
        return numContext !== numValue;
      default:
        return false;
    }
  }
}

module.exports = { ModelRouterService };

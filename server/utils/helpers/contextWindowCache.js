const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Context window cache for providers that discover model limits from their
 * server at runtime instead of a static model map.
 *
 * - Entries are scoped to the connection (base path, auth, ...) so changing
 *   provider settings starts from an empty cache.
 * - Entries expire after `ttl` and are refreshed on the next lookup.
 * - Concurrent lookups share a single in-flight request.
 * - A failed refresh keeps the last known values.
 *
 * Providers supply `fetchAll` (one request returns every model's limit) and
 * optionally `fetchOne` (inspect a single model). With `fetchOne`, a chat
 * only ever inspects its own model; without it, a miss refreshes the
 * inventory, at most once per `ttl`.
 */
class ContextWindowCache {
  #ttl;
  #connection;
  #fetchAll;
  #fetchOne;
  #normalize;
  #log;
  #bucket = null;

  /**
   * @param {Object} options
   * @param {() => Promise<Record<string, number>>} options.fetchAll - Map of model name to context window for every available model.
   * @param {((model: string) => Promise<number|null>)|null} [options.fetchOne] - Context window for one model, or null if it has none (eg: embedders).
   * @param {() => string} [options.connection] - Identifies the current connection; a new value discards cached entries.
   * @param {(model: string) => string} [options.normalize] - Maps equivalent model names to one cache key.
   * @param {number} [options.ttl] - Milliseconds before an entry is refreshed.
   * @param {(text: string, ...args: any[]) => void} [options.log]
   */
  constructor({
    fetchAll,
    fetchOne = null,
    connection = () => "",
    normalize = (model) => model,
    ttl = DEFAULT_TTL,
    log = () => {},
  }) {
    this.#fetchAll = fetchAll;
    this.#fetchOne = fetchOne;
    this.#connection = connection;
    this.#normalize = normalize;
    this.#ttl = ttl;
    this.#log = log;
  }

  #current() {
    const key = this.#connection();
    if (this.#bucket?.key !== key) {
      this.#bucket = {
        key,
        windows: new Map(),
        pending: new Map(),
        inventory: null,
        inventoryExpiresAt: 0,
      };
    }
    return this.#bucket;
  }

  #store(bucket, model, limit) {
    if (!(Number(limit) > 0)) return;
    bucket.windows.set(this.#normalize(model), {
      limit: Number(limit),
      expiresAt: Date.now() + this.#ttl,
    });
  }

  /** Number of models with a known context window. */
  get size() {
    return this.#current().windows.size;
  }

  /**
   * @param {string} model
   * @returns {number|null} The cached context window, expired or not.
   */
  get(model) {
    if (!model) return null;
    return this.#current().windows.get(this.#normalize(model))?.limit ?? null;
  }

  /** Record a context window learned outside of the fetchers. */
  set(model, limit) {
    if (!model) return;
    this.#store(this.#current(), model, limit);
  }

  /**
   * Refresh every model's context window.
   * @param {{force?: boolean}} options - Refresh even if the inventory has not expired.
   * @returns {Promise<void>} Never rejects.
   */
  async refresh({ force = false } = {}) {
    const bucket = this.#current();
    if (!force && bucket.inventoryExpiresAt > Date.now()) return;

    bucket.inventory ??= Promise.resolve()
      .then(() => this.#fetchAll())
      .then((limits = {}) => {
        for (const [model, limit] of Object.entries(limits))
          this.#store(bucket, model, limit);
        bucket.inventoryExpiresAt = Date.now() + this.#ttl;
        this.#log(
          `Context windows cached for ${Object.keys(limits).length} model(s)${force ? " (forced refresh)" : ""}.`
        );
      })
      .catch((e) => this.#log("Error caching context windows:", e.message))
      .finally(() => {
        bucket.inventory = null;
      });
    await bucket.inventory;
  }

  /**
   * Make sure the model's context window is cached and current.
   * @param {string} model
   * @returns {Promise<void>} Never rejects.
   */
  async ensure(model) {
    if (!model) return;
    const bucket = this.#current();
    const key = this.#normalize(model);
    const cached = bucket.windows.get(key);
    if (cached?.expiresAt > Date.now()) return;
    if (!this.#fetchOne) return this.refresh();

    if (!bucket.pending.has(key)) {
      const reason = cached ? "expired" : "not cached";
      bucket.pending.set(
        key,
        Promise.resolve()
          .then(() => this.#fetchOne(model))
          .then((limit) => {
            this.#store(bucket, model, limit);
            this.#log(
              `Context window for ${model} (${reason}): ${Number(limit) > 0 ? limit : "none reported"}.`
            );
          })
          .catch((e) =>
            this.#log(`Error caching context window for ${model}:`, e.message)
          )
          .finally(() => bucket.pending.delete(key))
      );
    }
    await bucket.pending.get(key);
  }
}

module.exports = { ContextWindowCache };

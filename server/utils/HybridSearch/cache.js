const { BM25 } = require("./tokenizers/bm25");
const { config } = require("./config");
const { logger } = require("./logger");

/**
 * Bounded LRU + TTL cache for BM25 indexes.
 *
 * Why this exists:
 *   Successive queries against the same workspace frequently produce overlapping
 *   candidate pools (the dense search is deterministic for the same query embedding).
 *   Rebuilding BM25 from scratch each time wastes 5–15ms per call on warm pools.
 *
 * Cache key:
 *   namespace::<fnv1a hash of sorted candidate IDs>
 *
 *   We deliberately key on the *set of pool IDs* rather than the query text so two
 *   different queries that return the same candidate pool share an index. The id-hash
 *   makes the key bounded in size regardless of pool count.
 *
 * Invalidation:
 *   - LRU eviction when the cache exceeds `bm25CacheSize`
 *   - TTL eviction after `bm25CacheTtlMs` to bound staleness if a workspace's
 *     ingest pipeline mutates documents (a stricter solution would hook into
 *     addDocumentToNamespace / deleteDocumentFromNamespace, but TTL is sufficient
 *     for typical chat-latency cadences and avoids tight coupling)
 *
 * Thread safety: Node is single-threaded for JS, so a Map is enough. If we move to
 * worker_threads we'll need to push this behind a SharedArrayBuffer or a small
 * IPC service.
 */

// FNV-1a 32-bit, fast and good enough for cache keys (not for security).
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16);
}

function buildKey(namespace, docs) {
  const ids = docs.map((d) => d.id).sort().join("|");
  return `${namespace}::${fnv1a(ids)}::${docs.length}`;
}

class BM25Cache {
  constructor() {
    /** @type {Map<string, {bm25:BM25, expiresAt:number}>} */
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get a BM25 index for the given namespace + candidate pool. Builds on miss.
   *
   * @param {string} namespace
   * @param {Array<{id:string, text:string, item:any}>} docs
   * @returns {BM25}
   */
  getOrBuild(namespace, docs) {
    const key = buildKey(namespace, docs);
    const now = Date.now();
    const entry = this.store.get(key);

    if (entry && entry.expiresAt > now) {
      // Refresh LRU position
      this.store.delete(key);
      this.store.set(key, entry);
      this.hits++;
      logger.debug("bm25 cache hit", { key, hits: this.hits });
      return entry.bm25;
    }

    if (entry) this.store.delete(key); // expired

    const bm25 = new BM25(docs);
    this.store.set(key, { bm25, expiresAt: now + config.bm25CacheTtlMs });
    this.misses++;
    this.evictIfOverflow();
    logger.debug("bm25 cache miss", { key, misses: this.misses, size: this.store.size });
    return bm25;
  }

  evictIfOverflow() {
    const max = config.bm25CacheSize;
    while (this.store.size > max) {
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }
  }

  /** Drop every cached index for a given namespace. Call from ingest hooks. */
  invalidateNamespace(namespace) {
    let dropped = 0;
    const prefix = `${namespace}::`;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        dropped++;
      }
    }
    if (dropped > 0) logger.info("bm25 cache invalidated", { namespace, dropped });
    return dropped;
  }

  /** Test helper: full reset. */
  clear() {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  stats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.store.size,
      hitRate: total === 0 ? 0 : this.hits / total,
    };
  }
}

// Module-scope singleton — every caller shares the same cache.
const bm25Cache = new BM25Cache();

module.exports = { bm25Cache, BM25Cache, buildKey };

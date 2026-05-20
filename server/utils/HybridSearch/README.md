# HybridSearch

Orchestrator + strategy pattern for hybrid (keyword + vector) retrieval across all
vector DB providers.

## Why this exists

Pure semantic search misses exact terms (document names, IDs, code, proper nouns).
BM25 alone misses paraphrase. Combining them ("hybrid search") fixes both.

Some vector DBs (LanceDB, Weaviate, Qdrant, Milvus, AstraDB, PGVector, Pinecone
sparse) support hybrid natively. Others (Chroma) don't. This module dispatches
to the best available strategy per provider so callers don't need to know.

## Public API

```js
const { hybridSearch } = require("./utils/HybridSearch");
const { searchWorkspace } = require("./utils/HybridSearch/dispatch");

// Direct call — explicit hybrid
await hybridSearch(provider, {
  namespace, input, LLMConnector,
  similarityThreshold, topN, filterIdentifiers,
  hybridAlpha,   // 0 = keyword only, 1 = vector only, 0.5 = balanced
  fusion,        // "rrf" (default) | "weighted"
});

// Workspace-aware — reads workspace.vectorSearchMode and dispatches
await searchWorkspace(provider, workspace, {
  namespace, input, LLMConnector,
  similarityThreshold, topN, filterIdentifiers,
});
```

`searchWorkspace` is what every chat handler uses. It routes:

| `workspace.vectorSearchMode` | Calls                                              |
|------------------------------|----------------------------------------------------|
| `"hybrid"`                   | `hybridSearch(...)`                                |
| `"rerank"`                   | `provider.performSimilaritySearch({rerank:true})`  |
| `"default"` or unset         | `provider.performSimilaritySearch({...})`          |

## Strategies

### `native`
Used when `provider.capabilities().nativeHybrid === true`. Delegates to
`provider.performHybridSearch(params)`, which the provider implements using its
DB's own keyword/sparse + vector hybrid query.

Native today: **LanceDB** (FTS index + vector, fused with RRF).

### `appSideBM25`
Universal fallback. Works against any provider:

1. Run `performSimilaritySearch` with `similarityThreshold: 0` and a widened
   `topN` (env-configurable; default 5× the requested topN, capped at 100) so
   BM25 can rescue lexically matching docs that dense search ranked low.
2. Build or fetch a **cached BM25 index** over the candidate pool's chunk text.
3. Fuse the dense ranking with the BM25 ranking (RRF by default).
4. Re-apply `similarityThreshold` against the **dense** score (fused score is
   rank-based and has no absolute meaning).
5. Trim to topN.

## Configuration

All knobs are environment-overridable (`server/utils/HybridSearch/config.js`):

| Env var                              | Default                       | Purpose                                  |
|--------------------------------------|-------------------------------|------------------------------------------|
| `HYBRID_SEARCH_POOL_MULTIPLIER`      | `5`                           | Candidate pool size vs topN              |
| `HYBRID_SEARCH_POOL_MAX`             | `100`                         | Hard cap on candidate pool               |
| `HYBRID_SEARCH_FUSION`               | `rrf`                         | `rrf` \| `weighted`                      |
| `HYBRID_SEARCH_RRF_K`                | `60`                          | RRF constant                             |
| `HYBRID_SEARCH_BM25_CACHE_SIZE`      | `64`                          | Max cached BM25 indexes                  |
| `HYBRID_SEARCH_BM25_CACHE_TTL_MS`    | `300000` (5 min)              | Safety net for stale indexes             |
| `HYBRID_SEARCH_BM25_K1`              | `1.5`                         | BM25 term-frequency saturation           |
| `HYBRID_SEARCH_BM25_B`               | `0.75`                        | BM25 length normalization                |
| `HYBRID_SEARCH_LOG_LEVEL`            | `info` (`warn` in production) | `debug` \| `info` \| `warn` \| `error`   |
| `HYBRID_SEARCH_TELEMETRY`            | `true`                        | Set to `false` to suppress events        |

## Tokenizer

Custom (`tokenizers/bm25.js`) — no external dependency.

- **Atomic preservation** before word-splitting: URLs, snake_case / kebab-case /
  camelCase / PascalCase identifiers, version strings (`v2.1.0-beta`), and long
  alphanumeric IDs with at least one digit (UUIDs, hashes). Critical for code
  corpora and ticketing-system content.
- **Multi-language stopwords** for en, es, fr, de, it, pt, nl, ru, zh, ja, ar.
  Merged into a single set — language detection at query time would cost more
  than the rare cross-lingual collisions save.
- **No stemming.** A correct Porter/Snowball impl across locales is its own
  project; naive stemming hurts precision on short chunks. Override `stopwords`
  via constructor if you have a stemmer.

## BM25 cache

`cache.js` provides a singleton LRU+TTL cache:

- **Key**: namespace + FNV-1a hash of sorted candidate IDs + pool size
- **Eviction**: LRU when `HYBRID_SEARCH_BM25_CACHE_SIZE` exceeded; TTL after
  `HYBRID_SEARCH_BM25_CACHE_TTL_MS`
- **Invalidation**: `bm25Cache.invalidateNamespace(ns)` — LanceDB calls this
  from `addDocumentToNamespace` and `deleteDocumentFromNamespace`. Other
  providers rely on TTL until they wire equivalent hooks.

```js
bm25Cache.stats(); // { hits, misses, size, hitRate }
```

## Score calibration

Returned `metadata` carries three distinct fields so downstream UI can show
the right number for the user's intent:

| Field          | Meaning                                                |
|----------------|--------------------------------------------------------|
| `score`        | Fused score used for ranking (alias of `hybridScore`)  |
| `hybridScore`  | Same as above, explicit                                |
| `denseScore`   | Original vector similarity (cosine, etc.)              |
| `sparseRank`   | 0-indexed rank from BM25, or `null` if no BM25 match   |

`similarityThreshold` filters on `denseScore`, not the fused score. Operators
who configured "below 0.5 cosine = noise" get the same behavior in hybrid mode.

## Errors

Strategy failures bubble up as `HybridSearchError` with:

```js
{
  name: "HybridSearchError",
  code: "HYBRID_STRATEGY_FAILED",
  context: { strategy, provider, namespace },
  cause: <original Error>
}
```

Telemetry fires `hybrid_search_failed` separately so dashboards can alarm on
strategy degradation without parsing stack traces.

## Telemetry

Two events to the existing Telemetry pipeline (suppressed in `NODE_ENV=test` and
when `HYBRID_SEARCH_TELEMETRY=false`):

| Event                     | Properties                                                       |
|---------------------------|------------------------------------------------------------------|
| `hybrid_search_executed`  | `strategy, provider, resultCount, latencyMs, fusion, hybridAlpha, topN` |
| `hybrid_search_failed`    | `strategy, provider, code, latencyMs`                            |

## Adding native hybrid for a new provider

1. Implement `performHybridSearch(params)` on the provider class. Return shape
   matches `performSimilaritySearch`: `{contextTexts, sources, message}`.
2. Override `capabilities()` to return `{ nativeHybrid: true, ... }`.
3. Add `bm25Cache.invalidateNamespace(namespace)` to your
   `addDocumentToNamespace` and `deleteDocumentFromNamespace` (only required if
   the orchestrator might still fall back to BM25 for this provider; not needed
   when the native path always wins).
4. The orchestrator routes to native automatically — no callsite changes.

Provider-specific notes for future PRs:

- **Weaviate**: use the `hybrid` operator with `alpha` matching `hybridAlpha`.
- **Qdrant**: store a sparse vector alongside dense; use Query API's `fusion: rrf`.
- **PGVector**: add `tsvector` column + GIN index; combine `ts_rank` and cosine.
- **Milvus / Zilliz**: BM25 sparse + dense via unified hybrid search API.
- **AstraDB**: `$hybrid` operator on collection query.
- **Pinecone**: sparse-dense index (separate index type) — needs migration UX.

## Adding a new fusion algorithm

Drop the file under `fusion/`, export the function, pass `fusion: "<name>"` to
`hybridSearch`. Branch in `strategies/appSideBM25.js`.

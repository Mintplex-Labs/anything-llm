const { GlideClient, ProtocolVersion } = require("@valkey/valkey-glide");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");
const { VectorDatabase } = require("../base");

// Named hard-limit constants - no magic numbers for limits.
const _INSERT_BATCH_SIZE = 100; // Concurrency batch size for HSET/DEL operations.
const _MAX_SCAN_ITERATIONS = 100_000; // Safety cap so a SCAN loop can never run unbounded.
const _SCAN_COUNT = 1000; // COUNT hint per SCAN iteration.
const _SEARCH_DIALECT = 2; // valkey-search query dialect required for KNN params.

/**
 * Valkey vector database provider.
 *
 * Uses the `valkey-search` module (shipped in `valkey/valkey-bundle`) for vector
 * similarity search via `FT.CREATE`/`FT.SEARCH` (HNSW + COSINE distance) issued
 * through GLIDE `customCommand` with FLOAT32 little-endian binary vectors.
 *
 * Storage design (one index per namespace, mirrors Qdrant/Milvus/Lance):
 *  - Index name : allm_idx_{normalizedNamespace}
 *  - Key prefix : allm:{namespace}:        (each chunk is a HASH at allm:{namespace}:{vectorId})
 *  - HASH fields: vector (FLOAT32 LE bytes), text (string), metadata (JSON string)
 *
 * Note: the client is created with RESP2 so that module command replies
 * (FT.SEARCH/FT.INFO/FT._LIST/SCAN) come back as predictable arrays.
 */
class Valkey extends VectorDatabase {
  /** @type {import('@valkey/valkey-glide').GlideClient|null} */
  static #client = null;

  constructor() {
    super();
  }

  get name() {
    return "Valkey";
  }

  /**
   * Build the GLIDE connection config from ENV (with optional overrides used by
   * `validateConnection`). Supports either a connection URL via
   * `VALKEY_VECTOR_DB_ENDPOINT` (redis://[user:pass@]host:port) or discrete
   * host/port/credentials env vars.
   * @param {{endpoint?:string, host?:string, port?:string|number, username?:string, password?:string, useTLS?:boolean, requestTimeout?:number}} overrides
   * @returns {import('@valkey/valkey-glide').GlideClientConfiguration}
   */
  static connection(overrides = {}) {
    const endpoint =
      overrides.endpoint ?? process.env.VALKEY_VECTOR_DB_ENDPOINT ?? null;
    let host =
      overrides.host ?? process.env.VALKEY_VECTOR_DB_HOST ?? "localhost";
    let port = Number(
      overrides.port ?? process.env.VALKEY_VECTOR_DB_PORT ?? 6379
    );
    let username =
      overrides.username ?? process.env.VALKEY_VECTOR_DB_USERNAME ?? null;
    let password =
      overrides.password ?? process.env.VALKEY_VECTOR_DB_PASSWORD ?? null;

    if (endpoint) {
      try {
        const url = new URL(endpoint);
        if (url.hostname) host = url.hostname;
        if (url.port) port = Number(url.port);
        if (url.username) username = decodeURIComponent(url.username);
        if (url.password) password = decodeURIComponent(url.password);
      } catch {
        // Malformed endpoint - fall back to discrete host/port values.
      }
    }

    const useTLS =
      overrides.useTLS ??
      String(process.env.VALKEY_VECTOR_DB_USE_TLS ?? "false") === "true";
    const requestTimeout = Number(
      overrides.requestTimeout ??
        process.env.VALKEY_VECTOR_DB_REQUEST_TIMEOUT ??
        5000
    );

    /** @type {import('@valkey/valkey-glide').GlideClientConfiguration} */
    const config = {
      addresses: [{ host, port }],
      useTLS,
      requestTimeout,
      protocol: ProtocolVersion.RESP2,
    };
    if (password)
      config.credentials = {
        username: username || undefined,
        password,
      };
    return config;
  }

  // valkey-search index/collection names only allow letters, numbers, and
  // underscores and must not start with a digit - re-normalize like Milvus does.
  normalize(namespace = "") {
    let normalized = `${namespace}`.replace(/[^a-zA-Z0-9_]/g, "_");
    if (!new RegExp(/^[a-zA-Z_]/).test(normalized.slice(0, 1)))
      normalized = `allm_${normalized}`;
    return normalized;
  }

  // The valkey-search index name for a namespace.
  indexName(namespace = "") {
    return `allm_idx_${this.normalize(namespace)}`;
  }

  // The HASH key prefix for all chunks in a namespace. Uses the raw namespace so
  // the FT.CREATE PREFIX and the stored keys always line up exactly.
  keyPrefix(namespace = "") {
    return `allm:${namespace}:`;
  }

  /**
   * Convert a COSINE distance into a clamped [0,1] similarity score.
   * @param {number} distance
   * @returns {number}
   */
  distanceToSimilarity(distance = null) {
    if (
      distance === null ||
      typeof distance !== "number" ||
      Number.isNaN(distance)
    )
      return 0.0;
    const similarity = 1 - distance;
    if (similarity < 0) return 0;
    if (similarity > 1) return 1;
    return similarity;
  }

  /**
   * Encode a numeric vector as a FLOAT32 little-endian Buffer for valkey-search.
   * @param {number[]} values
   * @returns {Buffer}
   */
  floatToBuffer(values = []) {
    return Buffer.from(Float32Array.from(values).buffer);
  }

  // Coerce a GlideString (string | Buffer) reply value to a string.
  _toStr(value) {
    if (value === null || value === undefined) return "";
    if (Buffer.isBuffer(value)) return value.toString("utf-8");
    return `${value}`;
  }

  // True when an array element is a GLIDE "record" entry: { key, value }.
  _isRecord(entry) {
    return (
      entry &&
      typeof entry === "object" &&
      !Array.isArray(entry) &&
      !Buffer.isBuffer(entry) &&
      "key" in entry
    );
  }

  // Read a single field value out of an FT.INFO reply. GLIDE decodes the map
  // reply into an array of { key, value } records; we also defensively support a
  // flat RESP2 array ([k, v, k, v, ...]) and Map/object shapes.
  _infoValue(reply, field) {
    if (Array.isArray(reply)) {
      if (reply.length && this._isRecord(reply[0])) {
        for (const entry of reply)
          if (this._toStr(entry.key) === field) return entry.value;
        return null;
      }
      for (let i = 0; i < reply.length - 1; i += 2) {
        if (this._toStr(reply[i]) === field) return reply[i + 1];
      }
      return null;
    }
    if (reply instanceof Map) return reply.get(field) ?? null;
    if (reply && typeof reply === "object") return reply[field] ?? null;
    return null;
  }

  // Collapse a single document's field list into a { field: value } object,
  // handling both the GLIDE record form ([{key,value}, ...]) and the flat RESP2
  // form ([field, value, ...]).
  _fieldsToObject(fieldsArray) {
    const fields = {};
    if (!Array.isArray(fieldsArray)) return fields;
    if (fieldsArray.length && this._isRecord(fieldsArray[0])) {
      for (const f of fieldsArray)
        fields[this._toStr(f.key)] = this._toStr(f.value);
      return fields;
    }
    for (let j = 0; j < fieldsArray.length - 1; j += 2) {
      fields[this._toStr(fieldsArray[j])] = this._toStr(fieldsArray[j + 1]);
    }
    return fields;
  }

  // Parse an FT.SEARCH reply into an array of { field: value } objects. GLIDE
  // returns [total, [{ key: docKey, value: [{key,value}, ...] }, ...]]; we also
  // support the flat RESP2 form [total, key, [f,v,...], key, [f,v,...], ...].
  _parseSearchReply(reply) {
    const matches = [];
    if (!Array.isArray(reply) || reply.length < 2) return matches;

    const docs = reply[1];
    if (
      Array.isArray(docs) &&
      docs.length &&
      docs[0] &&
      typeof docs[0] === "object" &&
      !Array.isArray(docs[0]) &&
      "value" in docs[0]
    ) {
      for (const doc of docs) matches.push(this._fieldsToObject(doc.value));
      return matches;
    }

    for (let i = 1; i < reply.length; i += 2) {
      if (!Array.isArray(reply[i + 1])) continue;
      matches.push(this._fieldsToObject(reply[i + 1]));
    }
    return matches;
  }

  /**
   * Bounded SCAN loop - returns every key matching a pattern. Guarded by
   * `_MAX_SCAN_ITERATIONS` so a pathological keyspace can never loop forever.
   * @param {import('@valkey/valkey-glide').GlideClient} client
   * @param {string} matchPattern
   * @returns {Promise<string[]>}
   */
  async _scanKeys(client, matchPattern) {
    const keys = [];
    let cursor = "0";
    let iterations = 0;
    do {
      const reply = await client.customCommand([
        "SCAN",
        cursor,
        "MATCH",
        matchPattern,
        "COUNT",
        String(_SCAN_COUNT),
      ]);
      const nextCursor = Array.isArray(reply) ? this._toStr(reply[0]) : "0";
      const batch =
        Array.isArray(reply) && Array.isArray(reply[1]) ? reply[1] : [];
      for (const key of batch) keys.push(this._toStr(key));
      cursor = nextCursor;
      iterations += 1;
      if (iterations >= _MAX_SCAN_ITERATIONS) {
        this.logger(
          "_scanKeys reached the max iteration cap (%s) - stopping scan early to avoid an unbounded loop.",
          _MAX_SCAN_ITERATIONS
        );
        break;
      }
    } while (cursor !== "0");
    return keys;
  }

  // Delete keys in bounded batches (respects DEL arg limits / avoids huge calls).
  async _deleteKeys(client, keys = []) {
    for (const batch of toChunks(keys, _INSERT_BATCH_SIZE)) {
      if (batch.length > 0) await client.del(batch);
    }
  }

  /**
   * Connect to Valkey. The client is cached statically and reused; it is created
   * on the first call and only recreated after a `disconnect()`.
   * @returns {Promise<{client: import('@valkey/valkey-glide').GlideClient}>}
   */
  async connect() {
    if (process.env.VECTOR_DB !== "valkey")
      throw new Error("Valkey::Invalid ENV settings");

    if (!Valkey.#client)
      Valkey.#client = await GlideClient.createClient(Valkey.connection());
    return { client: Valkey.#client };
  }

  // Release the cached client. Always clears the cache even if close() throws so
  // we never leak a dead client object.
  async disconnect() {
    try {
      if (Valkey.#client) Valkey.#client.close();
    } catch (e) {
      this.logger("disconnect", e.message);
    } finally {
      Valkey.#client = null;
    }
  }

  async heartbeat() {
    try {
      const { client } = await this.connect();
      await client.ping();
      return { heartbeat: Number(new Date()) };
    } catch (e) {
      // Release the client on a failed heartbeat so we never leak a connection.
      await this.disconnect();
      throw e;
    }
  }

  // Upsert a single chunk HASH. Created eagerly inside batched Promise.all calls -
  // no code between coroutine creation and await should throw here.
  async _upsertChunk(client, namespace, record) {
    const key = `${this.keyPrefix(namespace)}${record.id}`;
    await client.hset(key, {
      vector: this.floatToBuffer(record.values),
      text: record.metadata?.text || "",
      metadata: JSON.stringify(record.metadata || {}),
    });
  }

  /**
   * Create the per-namespace valkey-search index if it does not already exist.
   * Dimension is inferred from the first chunk (same as every other provider).
   * @param {import('@valkey/valkey-glide').GlideClient} client
   * @param {string} namespace
   * @param {number|null} dimensions
   */
  async getOrCreateIndex(client, namespace, dimensions = null) {
    if (await this.namespaceExists(client, namespace)) return;
    if (!dimensions)
      throw new Error(
        `${this.name}::getOrCreateIndex Unable to infer vector dimension from input. Open an issue on GitHub for support.`
      );

    await client.customCommand([
      "FT.CREATE",
      this.indexName(namespace),
      "ON",
      "HASH",
      "PREFIX",
      "1",
      this.keyPrefix(namespace),
      "SCHEMA",
      "vector",
      "VECTOR",
      "HNSW",
      "6",
      "TYPE",
      "FLOAT32",
      "DIM",
      String(dimensions),
      "DISTANCE_METRIC",
      "COSINE",
    ]);
  }

  async totalVectors() {
    const { client } = await this.connect();
    let reply;
    try {
      reply = await client.customCommand(["FT._LIST"]);
    } catch (e) {
      this.logger("totalVectors", e.message);
      return 0;
    }
    const indexes = (Array.isArray(reply) ? reply : []).map((i) =>
      this._toStr(i)
    );
    let total = 0;
    for (const index of indexes) {
      if (!index.startsWith("allm_idx_")) continue;
      try {
        const info = await client.customCommand(["FT.INFO", index]);
        total += Number(this._infoValue(info, "num_docs") ?? 0) || 0;
      } catch {
        continue;
      }
    }
    return total;
  }

  async _namespaceCount(client, namespace = null) {
    try {
      const info = await client.customCommand([
        "FT.INFO",
        this.indexName(namespace),
      ]);
      return Number(this._infoValue(info, "num_docs") ?? 0) || 0;
    } catch {
      return 0;
    }
  }

  async namespaceCount(_namespace = null) {
    const { client } = await this.connect();
    return await this._namespaceCount(client, _namespace);
  }

  async namespace(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    if (!(await this.namespaceExists(client, namespace))) return null;
    const vectorCount = await this._namespaceCount(client, namespace);
    return { name: namespace, vectorCount };
  }

  async hasNamespace(namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  }

  async namespaceExists(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    try {
      await client.customCommand(["FT.INFO", this.indexName(namespace)]);
      return true;
    } catch (e) {
      this.logger("namespaceExists", e.message);
      return false;
    }
  }

  async deleteVectorsInNamespace(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    // Step 1: drop the index. May not exist - that is fine.
    try {
      await client.customCommand(["FT.DROPINDEX", this.indexName(namespace)]);
    } catch (e) {
      this.logger(
        "deleteVectorsInNamespace - index drop skipped (%s)",
        e.message
      );
    }

    // Step 2: ALWAYS clean up the chunk keys even if step 1 failed, so a partial
    // failure can never leave orphaned vectors behind.
    const keys = await this._scanKeys(client, `${this.keyPrefix(namespace)}*`);
    await this._deleteKeys(client, keys);
    return true;
  }

  async addDocumentToNamespace(
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      let vectorDimension = null;
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      this.logger("Adding new vectorized document into namespace", namespace);
      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const { chunks } = cacheResult;
          const documentVectors = [];
          vectorDimension =
            chunks[0][0]?.values?.length ??
            chunks[0][0]?.vector?.length ??
            null;

          await this.getOrCreateIndex(client, namespace, vectorDimension);

          // Assign a fresh vectorId to each cached chunk and persist.
          const records = [];
          for (const chunk of chunks) {
            chunk.forEach((cachedChunk) => {
              const id = uuidv4();
              documentVectors.push({ docId, vectorId: id });
              records.push({
                id,
                values: cachedChunk.values,
                metadata: cachedChunk.metadata,
              });
            });
          }

          // Concurrency-batched upsert. Promise.all surfaces any rejection so a
          // partial batch failure propagates (never silently logged-and-ignored).
          for (const batch of toChunks(records, _INSERT_BATCH_SIZE)) {
            await Promise.all(
              batch.map((record) =>
                this._upsertChunk(client, namespace, record)
              )
            );
          }

          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      // If we are here then we are going to embed and store a novel document.
      // We do this manually (rather than via a LangChain helper) so we can
      // atomically manage our namespace to granularly find/remove documents.
      const EmbedderEngine = getEmbeddingEngineSelection();
      const textSplitter = new TextSplitter({
        chunkSize: TextSplitter.determineMaxChunkSize(
          await SystemSettings.getValueOrFallback({
            label: "text_splitter_chunk_size",
          }),
          EmbedderEngine?.embeddingMaxChunkLength
        ),
        chunkOverlap: await SystemSettings.getValueOrFallback(
          { label: "text_splitter_chunk_overlap" },
          20
        ),
        chunkHeaderMeta: TextSplitter.buildHeaderMeta(metadata),
        chunkPrefix: EmbedderEngine?.embeddingPrefix,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      this.logger("Snippets created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          if (!vectorDimension) vectorDimension = vector.length;
          const vectorRecord = {
            id: uuidv4(),
            values: vector,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually
            // and dont include the `text` key.
            metadata: { ...metadata, text: textChunks[i] },
          };

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      if (vectors.length > 0) {
        const chunks = [];
        const { client } = await this.connect();
        await this.getOrCreateIndex(client, namespace, vectorDimension);

        this.logger(`Inserting vectorized chunks into ${this.name}.`);
        for (const batch of toChunks(vectors, _INSERT_BATCH_SIZE)) {
          chunks.push(batch);
          await Promise.all(
            batch.map((record) => this._upsertChunk(client, namespace, record))
          );
        }
        await storeVectorResult(chunks, fullFilePath);
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      this.logger("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  }

  async deleteDocumentFromNamespace(namespace, docId) {
    const { DocumentVectors } = require("../../../models/vectors");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) return;

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const keys = knownDocuments.map(
      (doc) => `${this.keyPrefix(namespace)}${doc.vectorId}`
    );
    await this._deleteKeys(client, keys);

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
  }

  async similarityResponse({
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    const reply = await client.customCommand([
      "FT.SEARCH",
      this.indexName(namespace),
      `*=>[KNN ${topN} @vector $BLOB AS score]`,
      "PARAMS",
      "2",
      "BLOB",
      this.floatToBuffer(queryVector),
      "DIALECT",
      String(_SEARCH_DIALECT),
      "RETURN",
      "3",
      "text",
      "metadata",
      "score",
      "LIMIT",
      "0",
      String(topN),
    ]);

    const matches = this._parseSearchReply(reply);
    for (const match of matches) {
      const similarity = this.distanceToSimilarity(Number(match.score));
      if (similarity < similarityThreshold) continue;

      let metadata = {};
      try {
        metadata = match.metadata ? JSON.parse(match.metadata) : {};
      } catch {
        metadata = {};
      }

      if (filterIdentifiers.includes(sourceIdentifier(metadata))) {
        this.logger(
          "Valkey: A source was filtered from context as it's parent document is pinned."
        );
        continue;
      }

      result.contextTexts.push(metadata.text ?? match.text ?? "");
      result.sourceDocuments.push({ ...metadata, score: similarity });
      result.scores.push(similarity);
    }

    return result;
  }

  async performSimilaritySearch({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    if (!namespace || !input || !LLMConnector)
      throw new Error("Invalid request to performSimilaritySearch.");

    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) {
      return {
        contextTexts: [],
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    const queryVector = await LLMConnector.embedTextInput(input);
    const { contextTexts, sourceDocuments } = await this.similarityResponse({
      client,
      namespace,
      queryVector,
      similarityThreshold,
      topN,
      filterIdentifiers,
    });

    const sources = sourceDocuments.map((metadata, i) => {
      return { metadata: { ...metadata, text: contextTexts[i] } };
    });
    return {
      contextTexts,
      sources: this.curateSources(sources),
      message: false,
    };
  }

  async "namespace-stats"(reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  }

  async "delete-namespace"(reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");

    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${details?.vectorCount} vectors.`,
    };
  }

  async reset() {
    const { client } = await this.connect();
    let reply;
    try {
      reply = await client.customCommand(["FT._LIST"]);
    } catch (e) {
      this.logger("reset", e.message);
      reply = [];
    }

    const indexes = (Array.isArray(reply) ? reply : []).map((i) =>
      this._toStr(i)
    );
    for (const index of indexes) {
      if (!index.startsWith("allm_idx_")) continue;
      try {
        await client.customCommand(["FT.DROPINDEX", index]);
      } catch (e) {
        this.logger("reset - dropindex skipped (%s)", e.message);
      }
    }

    // Remove any remaining managed chunk keys.
    const keys = await this._scanKeys(client, "allm:*");
    await this._deleteKeys(client, keys);
    return { reset: true };
  }

  curateSources(sources = []) {
    const documents = [];
    for (const source of sources) {
      const { text, vector: _v, _distance: _d, ...rest } = source;
      const metadata = rest.hasOwnProperty("metadata") ? rest.metadata : rest;
      if (Object.keys(metadata).length > 0) {
        documents.push({
          ...metadata,
          ...(text ? { text } : {}),
        });
      }
    }

    return documents;
  }

  /**
   * Validate a Valkey connection (used by admin "test connection" + updateENV).
   * Always closes the probe client (even on failure) so it never leaks.
   * @param {{endpoint?:string, host?:string, port?:string|number, username?:string, password?:string, useTLS?:boolean, requestTimeout?:number}} overrides
   * @returns {Promise<{error: string | null, success: boolean}>}
   */
  static async validateConnection(overrides = {}) {
    const instance = new Valkey();
    let client = null;
    try {
      client = await GlideClient.createClient(Valkey.connection(overrides));
      await client.ping();
      client.close();
      client = null;
      return { error: null, success: true };
    } catch (e) {
      instance.logger("validateConnection", e.message);
      if (client) {
        try {
          client.close();
        } catch {
          // ignore close failures during cleanup
        }
      }
      return { error: e.message, success: false };
    }
  }
}

module.exports.Valkey = Valkey;

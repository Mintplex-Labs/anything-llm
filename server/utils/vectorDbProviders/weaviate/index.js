const crypto = require("crypto");
const weaviate = require("weaviate-client");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { camelCase } = require("../../helpers/camelcase");
const { sourceIdentifier } = require("../../chats");
const { VectorDatabase } = require("../base");
const { version: ANYTHINGLLM_VERSION } = require("../../../package.json");

// Oldest Weaviate server we support. From 1.29 every call this provider makes
// (including aggregations) runs over gRPC/REST, with no GraphQL.
const MIN_WEAVIATE_VERSION = { major: 1, minor: 29, patch: 0 };
const DEFAULT_GRPC_PORT = 50051;
// Max objects per insertMany and max ids per deleteMany call.
const BATCH_SIZE = 500;
// Weaviate Cloud clusters derive their gRPC host from the REST host.
const WEAVIATE_CLOUD_DOMAINS = [".weaviate.cloud", ".weaviate.network"];
// Vector compression options for WEAVIATE_QUANTIZATION, with the HNSW
// vectorIndexConfig each one sets and the oldest server that supports it.
// Servers older than that ignore or reject the setting, so it is checked here.
const QUANTIZATION_OPTIONS = {
  "rq-8": {
    config: { rq: { enabled: true, bits: 8 } },
    minVersion: [1, 32, 0],
  },
  "rq-1": {
    config: { rq: { enabled: true, bits: 1 } },
    minVersion: [1, 33, 0],
  },
  bq: { config: { bq: { enabled: true } }, minVersion: [1, 29, 0] },
  sq: { config: { sq: { enabled: true } }, minVersion: [1, 29, 0] },
  pq: { config: { pq: { enabled: true } }, minVersion: [1, 29, 0] },
};

// Multi-tenancy (WEAVIATE_MULTI_TENANCY): all workspaces share one collection
// and each workspace is a tenant. Tenant names must match TENANT_NAME; other
// namespaces get a stable hashed name.
const DEFAULT_MULTI_TENANT_COLLECTION = "AnythingLLM";
const TENANT_NAME = /^[A-Za-z0-9_-]{1,64}$/;

// A gRPC channel is expensive to open, so the client is shared by every
// Weaviate instance in this process and only rebuilt when the settings change.
let cachedConnection = null; // { key: string, promise: Promise<WeaviateClient> }
// Namespaces whose data has already been checked for moving between the
// per-collection and multi-tenant layouts in this process, and the moves in
// flight, keyed by layout + namespace.
const checkedLayouts = new Set();
const layoutMoves = new Map();
let checkedLayout = null;

class Weaviate extends VectorDatabase {
  constructor() {
    super();
  }

  get name() {
    return "Weaviate";
  }

  /**
   * The deployment type: "cloud" (Weaviate Cloud) or "custom" (self-hosted or
   * any other deployment). Set explicitly with WEAVIATE_DEPLOYMENT. Configs from
   * before that setting existed are inferred from the endpoint: a Weaviate Cloud
   * host with no explicit gRPC endpoint is "cloud".
   * @returns {"cloud"|"custom"}
   */
  deploymentMode() {
    const explicit = process.env.WEAVIATE_DEPLOYMENT?.trim().toLowerCase();
    if (explicit === "cloud" || explicit === "custom") return explicit;
    if (explicit)
      throw new Error(
        `Weaviate::Invalid WEAVIATE_DEPLOYMENT "${explicit}" - use "cloud" or "custom".`
      );

    const { hostname } = new URL(process.env.WEAVIATE_ENDPOINT);
    const isCloudHost = WEAVIATE_CLOUD_DOMAINS.some((domain) =>
      hostname.endsWith(domain)
    );
    return isCloudHost && !process.env.WEAVIATE_GRPC_ENDPOINT?.trim()
      ? "cloud"
      : "custom";
  }

  /**
   * Builds the weaviate-client connection options from the ENV settings.
   * - "cloud" uses `connectToWeaviateCloud`, which derives the gRPC host from
   *   the cluster URL and requires an API key.
   * - "custom" uses `connectToCustom`. The gRPC endpoint is taken from
   *   WEAVIATE_GRPC_ENDPOINT, or defaults to the REST host on port 50051.
   * @returns {{method: "cloud"|"custom", url?: string, options: object}}
   */
  connectionConfig() {
    const restUrl = new URL(process.env.WEAVIATE_ENDPOINT);
    const grpcEndpoint = process.env.WEAVIATE_GRPC_ENDPOINT?.trim() || null;
    const apiKey = process.env.WEAVIATE_API_KEY?.trim() || null;
    const sharedOptions = {
      headers: {
        "X-Weaviate-Client-Integration": `anything-llm/${ANYTHINGLLM_VERSION}`,
      },
      ...(apiKey ? { authCredentials: new weaviate.ApiKey(apiKey) } : {}),
    };

    if (this.deploymentMode() === "cloud") {
      if (!apiKey)
        throw new Error("Weaviate::Weaviate Cloud requires an API key.");
      return {
        method: "cloud",
        url: restUrl.origin,
        options: sharedOptions,
      };
    }

    const httpSecure = restUrl.protocol === "https:";
    const grpcUrl = grpcEndpoint
      ? new URL(
          /^[a-z]+:\/\//i.test(grpcEndpoint)
            ? grpcEndpoint
            : `${httpSecure ? "https" : "http"}://${grpcEndpoint}`
        )
      : null;
    const grpcSecure = grpcUrl ? grpcUrl.protocol === "https:" : httpSecure;
    const httpPath = restUrl.pathname.replace(/\/+$/, "");

    return {
      method: "custom",
      options: {
        ...sharedOptions,
        httpHost: restUrl.hostname,
        httpPort: Number(restUrl.port) || (httpSecure ? 443 : 80),
        httpSecure,
        ...(httpPath ? { httpPath } : {}),
        grpcHost: grpcUrl?.hostname || restUrl.hostname,
        grpcPort: grpcUrl
          ? Number(grpcUrl.port) || (grpcSecure ? 443 : 80)
          : DEFAULT_GRPC_PORT,
        grpcSecure,
      },
    };
  }

  /**
   * Opens a client and rejects servers older than MIN_WEAVIATE_VERSION.
   * @returns {Promise<import("weaviate-client").WeaviateClient>}
   */
  async createClient() {
    const { method, url, options } = this.connectionConfig();
    let client;
    try {
      client =
        method === "cloud"
          ? await weaviate.connectToWeaviateCloud(url, options)
          : await weaviate.connectToCustom(options);
    } catch (e) {
      throw new Error(
        `Weaviate::Could not connect - is the service online and are the REST and gRPC endpoints reachable? ${e.message}`
      );
    }

    const version = await client.getWeaviateVersion();
    const { major, minor, patch } = MIN_WEAVIATE_VERSION;
    if (!version.isAtLeast(major, minor, patch)) {
      await client.close();
      throw new Error(
        `Weaviate::Server version ${version.show()} is not supported. AnythingLLM requires Weaviate ${major}.${minor}.${patch} or later - please upgrade your Weaviate instance.`
      );
    }
    return client;
  }

  async connect() {
    if (process.env.VECTOR_DB !== "weaviate")
      throw new Error("Weaviate::Invalid ENV settings");

    const key = [
      process.env.WEAVIATE_DEPLOYMENT,
      process.env.WEAVIATE_ENDPOINT,
      process.env.WEAVIATE_GRPC_ENDPOINT,
      process.env.WEAVIATE_API_KEY,
    ].join("|");

    if (cachedConnection?.key !== key) {
      // A different server may hold data in either layout.
      checkedLayouts.clear();
      const previous = cachedConnection;
      const promise = this.createClient();
      cachedConnection = { key, promise };
      // Forget a failed connection so the next call retries.
      promise.catch(() => {
        if (cachedConnection?.promise === promise) cachedConnection = null;
      });
      previous?.promise.then((client) => client.close()).catch(() => {});
    }

    return { client: await cachedConnection.promise };
  }

  /**
   * Closes the shared client, if any. Settings changes are handled by
   * `connect()` itself; this is for tests and explicit shutdowns.
   */
  static async disconnect() {
    const previous = cachedConnection;
    cachedConnection = null;
    checkedLayouts.clear();
    await previous?.promise.then((client) => client.close()).catch(() => {});
  }

  /**
   * Converts a cosine distance ([0, 2]: 0 identical, 1 orthogonal, 2 opposite)
   * to a similarity score in [0, 1]. Distances at or past orthogonal floor at 0
   * so unrelated chunks can never clear a similarity threshold.
   * Weaviate's own `certainty` is 1 - distance / 2, which puts an orthogonal
   * chunk at 0.5, so it is not comparable with the other providers' scores.
   * @see https://docs.weaviate.io/weaviate/config-refs/distances
   * @param {number|null} distance - Cosine distance from the vector search.
   * @returns {number} Similarity score in [0, 1].
   */
  distanceToSimilarity(distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 0;
    if (distance < 0) return 1 - Math.abs(distance);
    return 1 - distance;
  }

  async heartbeat() {
    const { client } = await this.connect();
    if (!(await client.isLive()))
      throw new Error(
        "Weaviate::Invalid Alive signal received - is the service online?"
      );
    return { heartbeat: Number(new Date()) };
  }

  async totalVectors() {
    const { client } = await this.connect();
    const namespaces = await this.allNamespaces(client);
    var totalVectors = 0;
    for (const name of namespaces) {
      totalVectors += await this.namespaceCountWithClient(client, name);
    }
    return totalVectors;
  }

  async namespaceCountWithClient(client, namespace) {
    try {
      const { totalCount } = await this.collectionFor(
        client,
        namespace
      ).aggregate.overAll();
      return totalCount || 0;
    } catch (e) {
      this.logger(`namespaceCountWithClient`, e.message);
      return 0;
    }
  }

  async namespaceCount(namespace = null) {
    try {
      const { client } = await this.connect();
      return await this.namespaceCountWithClient(client, namespace);
    } catch (e) {
      this.logger(`namespaceCount`, e.message);
      return 0;
    }
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

    const { objects = [] } = await this.collectionFor(
      client,
      namespace
    ).query.nearVector(queryVector, {
      limit: topN,
      returnMetadata: ["distance"],
    });

    objects.forEach(({ uuid: id, properties = {}, metadata = {} }) => {
      const score = this.distanceToSimilarity(metadata?.distance);
      if (score < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(properties))) {
        this.logger(
          "A source was filtered from context as it's parent document is pinned."
        );
        return;
      }
      result.contextTexts.push(properties.text);
      result.sourceDocuments.push({ ...properties, id, score });
      result.scores.push(score);
    });

    return result;
  }

  /**
   * Collection names in per-collection mode, tenant names in multi-tenant mode.
   */
  async allNamespaces(client) {
    try {
      if (this.isMultiTenant()) {
        const collection = client.collections.get(
          this.multiTenantCollectionName()
        );
        if (!(await collection.exists())) return [];
        return Object.keys(await collection.tenants.get());
      }
      const collections = await client.collections.listAll();
      return (collections ?? []).map((collection) => collection.name);
    } catch (e) {
      this.logger("AllNamespace", e);
      return [];
    }
  }

  async namespace(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    if (!(await this.namespaceExists(client, namespace))) return null;

    const config = await client.collections
      .get(
        this.isMultiTenant()
          ? this.multiTenantCollectionName()
          : camelCase(namespace)
      )
      .config.get();

    return {
      ...config,
      ...(this.isMultiTenant() ? { tenant: this.tenantName(namespace) } : {}),
      vectorCount: await this.namespaceCountWithClient(client, namespace),
    };
  }

  /**
   * Whether workspaces are stored as tenants of one shared collection
   * (WEAVIATE_MULTI_TENANCY=true) instead of one collection per workspace.
   */
  isMultiTenant() {
    return ["true", "1", "yes", "on"].includes(
      String(process.env.WEAVIATE_MULTI_TENANCY ?? "")
        .trim()
        .toLowerCase()
    );
  }

  /**
   * The shared collection used in multi-tenant mode (WEAVIATE_COLLECTION,
   * default "AnythingLLM").
   */
  multiTenantCollectionName() {
    const raw =
      process.env.WEAVIATE_COLLECTION?.trim() ||
      DEFAULT_MULTI_TENANT_COLLECTION;
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    if (!/^[A-Z][A-Za-z0-9_]*$/.test(name))
      throw new Error(
        `Weaviate::Invalid WEAVIATE_COLLECTION "${raw}" - use letters, digits and underscores, starting with a letter.`
      );
    return name;
  }

  /**
   * The tenant for a namespace (workspace slug). Slugs that are valid tenant
   * names are used as-is; anything else (too long, other characters) gets a
   * stable hashed name.
   */
  tenantName(namespace) {
    if (TENANT_NAME.test(namespace)) return namespace;
    const hash = crypto.createHash("sha256").update(namespace).digest("hex");
    return `ws-${hash.slice(0, 32)}`;
  }

  /**
   * The collection handle holding a namespace's objects: its own collection,
   * or its tenant of the shared collection.
   */
  collectionFor(client, namespace) {
    if (!this.isMultiTenant())
      return client.collections.get(camelCase(namespace));
    return client.collections
      .get(this.multiTenantCollectionName())
      .withTenant(this.tenantName(namespace));
  }

  /**
   * Creates the storage for a namespace if it does not exist yet: its own
   * collection (same raw schema as the legacy client used, so collections
   * created before and after the v3 client migration are identical), or its
   * tenant in the shared collection.
   */
  async ensureCollection(client, namespace) {
    if (await this.namespaceExists(client, namespace)) return;
    if (this.isMultiTenant()) {
      await this.ensureMultiTenantCollection(client);
      await this.ensureTenant(client, namespace);
      return;
    }
    const vectorIndexConfig = await this.quantizationConfig(client);
    await client.collections.createFromSchema({
      class: camelCase(namespace),
      description: `Class created by AnythingLLM named ${camelCase(namespace)}`,
      vectorizer: "none",
      ...(vectorIndexConfig ? { vectorIndexConfig } : {}),
    });
  }

  async ensureMultiTenantCollection(client) {
    const name = this.multiTenantCollectionName();
    if (await client.collections.exists(name)) return;
    const vectorIndexConfig = await this.quantizationConfig(client);
    try {
      await client.collections.createFromSchema({
        class: name,
        description:
          "Collection created by AnythingLLM. Each tenant is a workspace.",
        vectorizer: "none",
        multiTenancyConfig: {
          enabled: true,
          autoTenantCreation: true,
          autoTenantActivation: true,
        },
        ...(vectorIndexConfig ? { vectorIndexConfig } : {}),
      });
    } catch (e) {
      // Another process may have created it at the same time.
      if (!(await client.collections.exists(name))) throw e;
    }
  }

  async ensureTenant(client, namespace) {
    const collection = client.collections.get(this.multiTenantCollectionName());
    const tenant = this.tenantName(namespace);
    try {
      await collection.tenants.create([{ name: tenant }]);
    } catch (e) {
      if (!(await collection.tenants.getByName(tenant))) throw e;
    }
  }

  /**
   * The vectorIndexConfig for the WEAVIATE_QUANTIZATION setting, used when a
   * collection is created. Unset means no explicit compression: the server
   * default applies (none, unless the server sets DEFAULT_QUANTIZATION).
   * @returns {Promise<object|null>}
   * @throws if the value is unknown or the server is too old for it
   */
  async quantizationConfig(client) {
    const value = process.env.WEAVIATE_QUANTIZATION?.trim().toLowerCase();
    if (!value) return null;
    const option = QUANTIZATION_OPTIONS[value];
    if (!option)
      throw new Error(
        `Weaviate::Invalid WEAVIATE_QUANTIZATION "${value}" - use one of ${Object.keys(QUANTIZATION_OPTIONS).join(", ")}.`
      );

    const version = await client.getWeaviateVersion();
    if (!version.isAtLeast(...option.minVersion))
      throw new Error(
        `Weaviate::Vector compression "${value}" requires Weaviate ${option.minVersion.join(".")} or later (server is ${version.show()}).`
      );
    return option.config;
  }

  /**
   * Inserts vector records into a namespace in batches of BATCH_SIZE.
   * @param {object} client - weaviate-client instance
   * @param {{id: string, vector: number[], properties: object}[]} vectors
   * @param {string} namespace
   * @returns {Promise<{success: boolean, errors: (string|null)[]}>}
   */
  async addVectors(client, vectors = [], namespace) {
    const response = { success: true, errors: new Set([]) };
    const collection = this.collectionFor(client, namespace);
    for (const batch of toChunks(vectors, BATCH_SIZE)) {
      const result = await collection.data.insertMany(
        batch.map(({ id, vector, properties }) => ({
          id,
          properties,
          vectors: vector,
        }))
      );
      if (!result.hasErrors) continue;
      response.success = false;
      for (const error of Object.values(result.errors))
        response.errors.add(error?.message || null);
    }

    response.errors = [...response.errors];
    return response;
  }

  async hasNamespace(namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  }

  async namespaceExists(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    await this.moveToCurrentLayout(client, namespace);
    if (!this.isMultiTenant())
      return await client.collections.exists(camelCase(namespace));

    const collection = client.collections.get(this.multiTenantCollectionName());
    if (!(await collection.exists())) return false;
    return (
      (await collection.tenants.getByName(this.tenantName(namespace))) !== null
    );
  }

  /**
   * Moves a namespace's data into the current layout if it is still stored in
   * the other one, e.g. right after WEAVIATE_MULTI_TENANCY was switched.
   * Runs once per namespace and layout in this process; concurrent callers
   * share the same move.
   */
  async moveToCurrentLayout(client, namespace) {
    const layout = this.isMultiTenant()
      ? `mt|${this.multiTenantCollectionName()}`
      : "collection";
    // A namespace checked under one layout must be checked again after the
    // layout changes (e.g. multi-tenancy switched off and back on).
    if (checkedLayout !== layout) {
      checkedLayouts.clear();
      checkedLayout = layout;
    }
    const key = `${layout}|${namespace}`;
    if (checkedLayouts.has(key)) return;
    if (!layoutMoves.has(key)) {
      const move = this.moveNamespace(client, namespace).finally(() =>
        layoutMoves.delete(key)
      );
      layoutMoves.set(key, move);
    }
    await layoutMoves.get(key);
    checkedLayouts.add(key);
  }

  /**
   * Copies a namespace from the other layout into the current one (same
   * object ids, properties and vectors, so nothing is re-embedded), checks the
   * copy, then deletes the source. Safe to re-run: re-copying upserts by id.
   * @returns {Promise<number|null>} objects moved, or null if nothing to move
   */
  async moveNamespace(client, namespace) {
    const collectionName = camelCase(namespace);
    const sharedName = this.multiTenantCollectionName();
    if (collectionName === sharedName) return null;
    const shared = client.collections.get(sharedName);
    const tenant = this.tenantName(namespace);

    let source, target, dropSource;
    if (this.isMultiTenant()) {
      const own = client.collections.get(collectionName);
      if (!(await own.exists())) return null;
      // Only move per-workspace collections, never another shared collection.
      const config = await own.config.get();
      if (config?.multiTenancy?.enabled) return null;
      await this.ensureMultiTenantCollection(client);
      await this.ensureTenant(client, namespace);
      source = own;
      target = shared.withTenant(tenant);
      dropSource = () => client.collections.delete(collectionName);
    } else {
      if (!(await shared.exists())) return null;
      if (!(await shared.tenants.getByName(tenant))) return null;
      if (!(await client.collections.exists(collectionName))) {
        const vectorIndexConfig = await this.quantizationConfig(client);
        await client.collections.createFromSchema({
          class: collectionName,
          description: `Class created by AnythingLLM named ${collectionName}`,
          vectorizer: "none",
          ...(vectorIndexConfig ? { vectorIndexConfig } : {}),
        });
      }
      source = shared.withTenant(tenant);
      target = client.collections.get(collectionName);
      dropSource = () => shared.tenants.remove([tenant]);
    }

    this.logger(
      `Moving workspace "${namespace}" to the ${this.isMultiTenant() ? `multi-tenant collection ${sharedName} (tenant ${tenant})` : `collection ${collectionName}`}.`
    );
    const moved = await this.copyObjects(source, target);
    const [sourceCount, targetCount] = await Promise.all([
      source.aggregate.overAll().then((r) => r.totalCount),
      target.aggregate.overAll().then((r) => r.totalCount),
    ]);
    if (targetCount < sourceCount)
      throw new Error(
        `Weaviate::Moving workspace "${namespace}" copied ${targetCount} of ${sourceCount} objects - the source was kept.`
      );
    await dropSource();
    this.logger(`Moved ${moved} objects of workspace "${namespace}".`);
    return moved;
  }

  /**
   * Copies every object (id, properties, vector) from one collection handle to
   * another, in batches of BATCH_SIZE.
   * @returns {Promise<number>} objects copied
   */
  async copyObjects(source, target) {
    let batch = [];
    let copied = 0;
    const flush = async () => {
      if (batch.length === 0) return;
      const result = await target.data.insertMany(batch);
      if (result.hasErrors) {
        const messages = [
          ...new Set(Object.values(result.errors).map((e) => e?.message)),
        ];
        throw new Error(`Weaviate::Copy failed: ${messages.join("; ")}`);
      }
      copied += batch.length;
      batch = [];
    };

    for await (const obj of source.iterator({ includeVector: true })) {
      batch.push({
        id: obj.uuid,
        properties: obj.properties,
        vectors: obj.vectors?.default ?? obj.vectors,
      });
      if (batch.length >= BATCH_SIZE) await flush();
    }
    await flush();
    return copied;
  }

  /**
   * Moves every workspace into the current layout. Runs in the background
   * after WEAVIATE_MULTI_TENANCY changes; workspaces not reached yet are moved
   * on first use anyway.
   */
  async moveAllToCurrentLayout() {
    const { Workspace } = require("../../../models/workspace");
    const { client } = await this.connect();
    const workspaces = await Workspace.where({});
    const report = { moved: 0, failed: [] };
    for (const { slug } of workspaces) {
      try {
        await this.moveToCurrentLayout(client, slug);
        report.moved++;
      } catch (e) {
        this.logger(`moveAllToCurrentLayout ${slug}`, e.message);
        report.failed.push(slug);
      }
    }
    return report;
  }

  async deleteVectorsInNamespace(client, namespace = null) {
    if (this.isMultiTenant()) {
      await client.collections
        .get(this.multiTenantCollectionName())
        .tenants.remove([this.tenantName(namespace)]);
      return true;
    }
    await client.collections.delete(camelCase(namespace));
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
      const {
        pageContent,
        docId,
        id: _id, // Weaviate will abort if `id` is present in properties
        ...metadata
      } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      this.logger("Adding new vectorized document into namespace", namespace);
      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          await this.ensureCollection(client, namespace);

          const { chunks } = cacheResult;
          const documentVectors = [];

          for (const chunk of chunks) {
            // Before sending to Weaviate and saving the records to our db
            // we need to assign the id of each chunk that is stored in the cached file.
            const vectors = chunk.map((chunk) => {
              const id = uuidv4();
              const flattenedMetadata = this.flattenObjectForWeaviate(
                chunk.properties ?? chunk.metadata
              );
              documentVectors.push({ docId, vectorId: id });
              return {
                id,
                class: camelCase(namespace),
                vector: chunk.vector || chunk.values || [],
                properties: { ...flattenedMetadata },
              };
            });

            const { success: additionResult, errors = [] } =
              await this.addVectors(client, vectors, namespace);
            if (!additionResult) {
              this.logger("addVectors failed to insert", errors);
              throw new Error("Error embedding into Weaviate");
            }
          }

          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `Chroma.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
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
          const flattenedMetadata = this.flattenObjectForWeaviate(metadata);
          const vectorRecord = {
            class: camelCase(namespace),
            id: uuidv4(),
            vector: vector,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            // https://github.com/hwchase17/langchainjs/blob/5485c4af50c063e257ad54f4393fa79e0aff6462/langchain/src/vectorstores/weaviate.ts#L133
            properties: { ...flattenedMetadata, text: textChunks[i] },
          };

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      const { client } = await this.connect();
      await this.ensureCollection(client, namespace);

      if (vectors.length > 0) {
        const chunks = toChunks(vectors, BATCH_SIZE);

        this.logger("Inserting vectorized chunks into Weaviate collection.");
        const { success: additionResult, errors = [] } = await this.addVectors(
          client,
          vectors,
          namespace
        );
        if (!additionResult) {
          this.logger("addVectors failed to insert", errors);
          throw new Error("Error embedding into Weaviate");
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

    const collection = this.collectionFor(client, namespace);
    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    for (const ids of toChunks(vectorIds, BATCH_SIZE)) {
      const { failed = 0 } = await collection.data.deleteMany(
        collection.filter.byId().containsAny(ids)
      );
      if (failed > 0)
        throw new Error(
          `Weaviate::Failed to delete ${failed} vectors of document ${docId}`
        );
    }

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
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
      return { ...metadata, text: contextTexts[i] };
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
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  }

  async "delete-namespace"(reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${camelCase(namespace)} was deleted along with ${
        details?.vectorCount
      } vectors.`,
    };
  }

  async reset() {
    const { client } = await this.connect();
    if (this.isMultiTenant()) {
      const name = this.multiTenantCollectionName();
      if (await client.collections.exists(name))
        await client.collections.delete(name);
      return { reset: true };
    }
    const weaviateClasses = await this.allNamespaces(client);
    for (const weaviateClass of weaviateClasses) {
      await client.collections.delete(weaviateClass);
    }
    return { reset: true };
  }

  curateSources(sources = []) {
    const documents = [];
    for (const source of sources) {
      if (Object.keys(source).length > 0) {
        const metadata = source.hasOwnProperty("metadata")
          ? source.metadata
          : source;
        documents.push({ ...metadata });
      }
    }

    return documents;
  }

  flattenObjectForWeaviate(obj = {}) {
    // Note this function is not generic, it is designed specifically for Weaviate
    // https://weaviate.io/developers/weaviate/config-refs/datatypes#introduction
    // Credit to LangchainJS
    // https://github.com/hwchase17/langchainjs/blob/5485c4af50c063e257ad54f4393fa79e0aff6462/langchain/src/vectorstores/weaviate.ts#L11C1-L50C3
    const flattenedObject = {};

    for (const key in obj) {
      if (!Object.hasOwn(obj, key) || key === "id") {
        continue;
      }
      const value = obj[key];
      if (typeof obj[key] === "object" && !Array.isArray(value)) {
        const recursiveResult = this.flattenObjectForWeaviate(value);

        for (const deepKey in recursiveResult) {
          if (Object.hasOwn(obj, key)) {
            flattenedObject[`${key}_${deepKey}`] = recursiveResult[deepKey];
          }
        }
      } else if (Array.isArray(value)) {
        if (
          value.length > 0 &&
          typeof value[0] !== "object" &&
          value.every((el) => typeof el === typeof value[0])
        ) {
          // Weaviate only supports arrays of primitive types,
          // where all elements are of the same type
          flattenedObject[key] = value;
        }
      } else {
        flattenedObject[key] = value;
      }
    }

    return flattenedObject;
  }
}

module.exports.Weaviate = Weaviate;

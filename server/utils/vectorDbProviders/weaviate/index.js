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

// Environment variables that define the connection. The shared client is
// rebuilt whenever any of them changes.
const CONNECTION_ENV_KEYS = [
  "WEAVIATE_DEPLOYMENT",
  "WEAVIATE_ENDPOINT",
  "WEAVIATE_GRPC_ENDPOINT",
  "WEAVIATE_HTTP_HOST",
  "WEAVIATE_HTTP_PORT",
  "WEAVIATE_HTTP_SECURE",
  "WEAVIATE_HTTP_PATH",
  "WEAVIATE_GRPC_HOST",
  "WEAVIATE_GRPC_PORT",
  "WEAVIATE_GRPC_SECURE",
  "WEAVIATE_GRPC_PROXY",
  "WEAVIATE_AUTH_METHOD",
  "WEAVIATE_API_KEY",
  "WEAVIATE_OIDC_CLIENT_SECRET",
  "WEAVIATE_OIDC_USERNAME",
  "WEAVIATE_OIDC_PASSWORD",
  "WEAVIATE_OIDC_SCOPES",
  "WEAVIATE_ACCESS_TOKEN",
  "WEAVIATE_ACCESS_TOKEN_EXPIRES_IN",
  "WEAVIATE_REFRESH_TOKEN",
  "WEAVIATE_HEADERS",
  "WEAVIATE_TIMEOUT_QUERY",
  "WEAVIATE_TIMEOUT_INSERT",
  "WEAVIATE_TIMEOUT_INIT",
  "WEAVIATE_SKIP_INIT_CHECKS",
];
const AUTH_METHODS = [
  "none",
  "api-key",
  "oidc-client-credentials",
  "oidc-password",
  "bearer-token",
];

/** A trimmed ENV value, or null when unset or blank. */
function env(key) {
  const value = process.env[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

/** A boolean ENV value, or null when unset. */
function envBoolean(key) {
  const value = env(key)?.toLowerCase();
  if (value === undefined || value === null) return null;
  if (["true", "1", "yes", "on"].includes(value)) return true;
  if (["false", "0", "no", "off"].includes(value)) return false;
  throw new Error(`Weaviate::${key} must be true or false.`);
}

/** A numeric ENV value, or null when unset. */
function envNumber(key, { integer = false, min = 0, max = Infinity } = {}) {
  const value = env(key);
  if (value === null) return null;
  const number = Number(value);
  if (
    !Number.isFinite(number) ||
    (integer && !Number.isInteger(number)) ||
    number <= min ||
    number > max
  )
    throw new Error(`Weaviate::${key} has an invalid value "${value}".`);
  return number;
}

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
   * any other deployment). Set explicitly with WEAVIATE_DEPLOYMENT. Without it
   * (configs from before the setting existed): custom if WEAVIATE_HTTP_HOST is
   * set, otherwise cloud for a Weaviate Cloud WEAVIATE_ENDPOINT with no
   * explicit gRPC endpoint.
   * @returns {"cloud"|"custom"}
   */
  deploymentMode() {
    const explicit = env("WEAVIATE_DEPLOYMENT")?.toLowerCase();
    if (explicit === "cloud" || explicit === "custom") return explicit;
    if (explicit)
      throw new Error(
        `Weaviate::Invalid WEAVIATE_DEPLOYMENT "${explicit}" - use "cloud" or "custom".`
      );
    if (env("WEAVIATE_HTTP_HOST") || !env("WEAVIATE_ENDPOINT")) return "custom";

    const { hostname } = new URL(env("WEAVIATE_ENDPOINT"));
    const isCloudHost = WEAVIATE_CLOUD_DOMAINS.some((domain) =>
      hostname.endsWith(domain)
    );
    return isCloudHost && !env("WEAVIATE_GRPC_ENDPOINT") ? "cloud" : "custom";
  }

  /**
   * Builds the weaviate-client connection options from the ENV settings.
   * - "cloud" uses `connectToWeaviateCloud` with the cluster URL
   *   (WEAVIATE_ENDPOINT) and an API key; the gRPC host is derived.
   * - "custom" uses `connectToCustom` with every option it supports, see
   *   customConnectionOptions().
   * Both get the auth, headers, timeouts and skipInitChecks settings.
   * @returns {{method: "cloud"|"custom", url?: string, options: object}}
   */
  connectionConfig() {
    const mode = this.deploymentMode();
    const authCredentials = this.authCredentials();
    const timeout = Object.fromEntries(
      [
        ["query", envNumber("WEAVIATE_TIMEOUT_QUERY")],
        ["insert", envNumber("WEAVIATE_TIMEOUT_INSERT")],
        ["init", envNumber("WEAVIATE_TIMEOUT_INIT")],
      ].filter(([, value]) => value !== null)
    );
    const skipInitChecks = envBoolean("WEAVIATE_SKIP_INIT_CHECKS");
    const sharedOptions = {
      headers: this.headers(),
      ...(authCredentials ? { authCredentials } : {}),
      ...(Object.keys(timeout).length > 0 ? { timeout } : {}),
      ...(skipInitChecks ? { skipInitChecks: true } : {}),
    };

    if (mode === "cloud") {
      if (!env("WEAVIATE_ENDPOINT"))
        throw new Error("Weaviate::Weaviate Cloud requires a cluster URL.");
      if (!(authCredentials instanceof weaviate.ApiKey))
        throw new Error("Weaviate::Weaviate Cloud requires an API key.");
      return {
        method: "cloud",
        url: new URL(env("WEAVIATE_ENDPOINT")).origin,
        options: sharedOptions,
      };
    }

    const grpcProxy = env("WEAVIATE_GRPC_PROXY");
    return {
      method: "custom",
      options: {
        ...sharedOptions,
        ...this.customConnectionOptions(),
        ...(grpcProxy ? { proxies: { grpc: grpcProxy } } : {}),
      },
    };
  }

  /**
   * HTTP and gRPC options for `connectToCustom`.
   * - WEAVIATE_HTTP_HOST set: the WEAVIATE_HTTP_* settings are used as given
   *   (port 8080, no TLS and no path by default).
   * - Otherwise they are read from the WEAVIATE_ENDPOINT URL (older configs).
   * - gRPC: WEAVIATE_GRPC_* when WEAVIATE_GRPC_HOST is set, else the
   *   WEAVIATE_GRPC_ENDPOINT URL, else the HTTP host on port 50051 with the
   *   same TLS setting as HTTP.
   */
  customConnectionOptions() {
    let http;
    if (env("WEAVIATE_HTTP_HOST")) {
      http = {
        httpHost: env("WEAVIATE_HTTP_HOST"),
        httpPort:
          envNumber("WEAVIATE_HTTP_PORT", { integer: true, max: 65535 }) ??
          8080,
        httpSecure: envBoolean("WEAVIATE_HTTP_SECURE") ?? false,
        httpPath: env("WEAVIATE_HTTP_PATH")?.replace(/\/+$/, "") || null,
      };
    } else if (env("WEAVIATE_ENDPOINT")) {
      const url = new URL(env("WEAVIATE_ENDPOINT"));
      const httpSecure = url.protocol === "https:";
      http = {
        httpHost: url.hostname,
        httpPort: Number(url.port) || (httpSecure ? 443 : 80),
        httpSecure,
        httpPath: url.pathname.replace(/\/+$/, "") || null,
      };
    } else {
      throw new Error(
        "Weaviate::Set the Weaviate HTTP host (WEAVIATE_HTTP_HOST)."
      );
    }

    let grpc;
    if (env("WEAVIATE_GRPC_HOST")) {
      const grpcSecure = envBoolean("WEAVIATE_GRPC_SECURE") ?? http.httpSecure;
      grpc = {
        grpcHost: env("WEAVIATE_GRPC_HOST"),
        grpcPort:
          envNumber("WEAVIATE_GRPC_PORT", { integer: true, max: 65535 }) ??
          DEFAULT_GRPC_PORT,
        grpcSecure,
      };
    } else if (env("WEAVIATE_GRPC_ENDPOINT")) {
      const endpoint = env("WEAVIATE_GRPC_ENDPOINT");
      const url = new URL(
        /^[a-z]+:\/\//i.test(endpoint)
          ? endpoint
          : `${http.httpSecure ? "https" : "http"}://${endpoint}`
      );
      const grpcSecure = url.protocol === "https:";
      grpc = {
        grpcHost: url.hostname,
        grpcPort: Number(url.port) || (grpcSecure ? 443 : 80),
        grpcSecure,
      };
    } else {
      grpc = {
        grpcHost: http.httpHost,
        grpcPort:
          envNumber("WEAVIATE_GRPC_PORT", { integer: true, max: 65535 }) ??
          DEFAULT_GRPC_PORT,
        grpcSecure: envBoolean("WEAVIATE_GRPC_SECURE") ?? http.httpSecure,
      };
    }

    const { httpPath, ...rest } = http;
    return { ...rest, ...(httpPath ? { httpPath } : {}), ...grpc };
  }

  /**
   * Credentials for WEAVIATE_AUTH_METHOD. Without it: API key auth when
   * WEAVIATE_API_KEY is set, otherwise none.
   * @returns {object|null} a weaviate-client auth credentials instance
   */
  authCredentials() {
    const method =
      env("WEAVIATE_AUTH_METHOD")?.toLowerCase() ??
      (env("WEAVIATE_API_KEY") ? "api-key" : "none");
    const require = (key) => {
      if (!env(key))
        throw new Error(`Weaviate::${key} is required for ${method} auth.`);
      return env(key);
    };
    const scopes = env("WEAVIATE_OIDC_SCOPES")
      ?.split(/[\s,]+/)
      .filter(Boolean);

    switch (method) {
      case "none":
        return null;
      case "api-key":
        return new weaviate.ApiKey(require("WEAVIATE_API_KEY"));
      case "oidc-client-credentials":
        return new weaviate.AuthClientCredentials({
          clientSecret: require("WEAVIATE_OIDC_CLIENT_SECRET"),
          ...(scopes ? { scopes } : {}),
        });
      case "oidc-password":
        return new weaviate.AuthUserPasswordCredentials({
          username: require("WEAVIATE_OIDC_USERNAME"),
          password: require("WEAVIATE_OIDC_PASSWORD"),
          ...(scopes ? { scopes } : {}),
        });
      case "bearer-token":
        return new weaviate.AuthAccessTokenCredentials({
          accessToken: require("WEAVIATE_ACCESS_TOKEN"),
          expiresIn:
            envNumber("WEAVIATE_ACCESS_TOKEN_EXPIRES_IN", { integer: true }) ??
            3600,
          ...(env("WEAVIATE_REFRESH_TOKEN")
            ? { refreshToken: env("WEAVIATE_REFRESH_TOKEN") }
            : {}),
        });
      default:
        throw new Error(
          `Weaviate::Invalid WEAVIATE_AUTH_METHOD "${method}" - use one of ${AUTH_METHODS.join(", ")}.`
        );
    }
  }

  /**
   * Extra request headers from WEAVIATE_HEADERS (a JSON object of strings),
   * plus the integration header, which always wins.
   */
  headers() {
    let extra = {};
    const raw = env("WEAVIATE_HEADERS");
    if (raw) {
      try {
        extra = JSON.parse(raw);
      } catch {
        throw new Error("Weaviate::WEAVIATE_HEADERS must be a JSON object.");
      }
      if (
        !extra ||
        typeof extra !== "object" ||
        Array.isArray(extra) ||
        Object.values(extra).some((value) => typeof value !== "string")
      )
        throw new Error(
          "Weaviate::WEAVIATE_HEADERS must be a JSON object of string values."
        );
    }
    return {
      ...extra,
      "X-Weaviate-Client-Integration": `anything-llm/${ANYTHINGLLM_VERSION}`,
    };
  }

  /**
   * Opens a client and rejects servers older than MIN_WEAVIATE_VERSION. With
   * WEAVIATE_SKIP_INIT_CHECKS the client's startup checks and this version
   * check are both skipped.
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
    if (options.skipInitChecks) {
      this.logger(
        `Skipping startup checks: the Weaviate server version is not verified (AnythingLLM needs ${Object.values(MIN_WEAVIATE_VERSION).join(".")} or later).`
      );
      return client;
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

    const key = JSON.stringify(
      CONNECTION_ENV_KEYS.map((name) => process.env[name] ?? null)
    );

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
   * @returns {Promise<number|null>} objects moved, or null if nothing was moved
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
    if (checkedLayouts.has(key)) return null;
    if (!layoutMoves.has(key)) {
      const move = this.moveNamespace(client, namespace).finally(() =>
        layoutMoves.delete(key)
      );
      layoutMoves.set(key, move);
    }
    const moved = await layoutMoves.get(key);
    checkedLayouts.add(key);
    return moved;
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
    const report = { checked: 0, moved: 0, failed: [] };
    for (const { slug } of workspaces) {
      try {
        const moved = await this.moveToCurrentLayout(client, slug);
        report.checked++;
        if (moved !== null) report.moved++;
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

const { updateENV } = require("../helpers/updateENV");

/**
 * The old URL settings a conversion was made from, stored (base64, so the
 * .env writer keeps it intact) in WEAVIATE_MIGRATED_FROM.
 */
function legacyFingerprint() {
  const value = [
    process.env.WEAVIATE_ENDPOINT?.trim() ?? "",
    process.env.WEAVIATE_GRPC_ENDPOINT?.trim() ?? "",
  ].join("|");
  return Buffer.from(value, "utf8").toString("base64");
}

/**
 * Boot migration for Weaviate connection settings.
 *
 * Older configs only have WEAVIATE_ENDPOINT (a URL), optionally
 * WEAVIATE_GRPC_ENDPOINT, and WEAVIATE_API_KEY. The Weaviate settings now store
 * the deployment type, the explicit HTTP / gRPC connection options and the
 * authentication method. This infers those from the old values, exactly as the
 * Weaviate provider already interprets old configs, and saves them.
 *
 * - Runs when WEAVIATE_ENDPOINT is set and either nothing was configured
 *   the new way yet (no WEAVIATE_DEPLOYMENT / WEAVIATE_HTTP_HOST), or the old
 *   URL settings changed since the last conversion (WEAVIATE_MIGRATED_FROM).
 *   The second case covers editing WEAVIATE_ENDPOINT in e.g. docker compose
 *   after upgrading: the environment wins over the saved .env, so without it
 *   the saved explicit settings would silently keep the old host. Settings
 *   changed on the settings page leave the old URLs alone and are kept.
 * - The old URL settings are kept: the explicit settings take precedence, and
 *   an older AnythingLLM version can still read them after a rollback.
 * - If the old values cannot be interpreted, nothing is changed; the provider
 *   reports the problem when it connects.
 * @returns {Promise<object|null>} the settings written, or null if nothing ran
 */
async function migrateWeaviateConnectionSettings() {
  const isSet = (key) => !!process.env[key]?.trim();
  if (!isSet("WEAVIATE_ENDPOINT")) return null;
  const migratedFrom = process.env.WEAVIATE_MIGRATED_FROM?.trim() || null;
  const configuredNewWay =
    isSet("WEAVIATE_DEPLOYMENT") || isSet("WEAVIATE_HTTP_HOST");
  if (configuredNewWay && migratedFrom === null) return null; // set up the new way
  if (migratedFrom !== null && migratedFrom === legacyFingerprint())
    return null; // already converted from these values

  try {
    const { Weaviate } = require("../vectorDbProviders/weaviate");
    const provider = new Weaviate();
    // Interpret the old URL settings on their own, ignoring settings written
    // by an earlier conversion (when re-converting after the URLs changed).
    const { deployment, options } = withLegacySettingsOnly(() => {
      const deployment = provider.deploymentMode();
      return {
        deployment,
        options:
          deployment === "custom" ? provider.customConnectionOptions() : null,
      };
    });
    const authMethod = isSet("WEAVIATE_API_KEY") ? "api-key" : "none";
    const settings =
      deployment === "cloud"
        ? { WeaviateDeployment: "cloud", WeaviateAuthMethod: authMethod }
        : {
            WeaviateDeployment: "custom",
            WeaviateHttpHost: options.httpHost,
            WeaviateHttpPort: String(options.httpPort),
            WeaviateHttpSecure: String(options.httpSecure),
            WeaviateHttpPath: options.httpPath ?? "",
            WeaviateGrpcHost: options.grpcHost,
            WeaviateGrpcPort: String(options.grpcPort),
            WeaviateGrpcSecure: String(options.grpcSecure),
            WeaviateAuthMethod: authMethod,
          };

    const { error } = await updateENV({
      ...settings,
      WeaviateMigratedFrom: legacyFingerprint(),
    });
    if (error) throw new Error(error);
    console.log(
      `\x1b[33m[WEAVIATE MIGRATION]\x1b[0m Converted the Weaviate endpoint URL settings to the new ${deployment} connection settings.`
    );
    return settings;
  } catch (e) {
    console.error(
      `\x1b[31m[WEAVIATE MIGRATION]\x1b[0m Could not convert the Weaviate connection settings, keeping them as they are: ${e.message}`
    );
    return null;
  }
}

/** Runs fn as if only the old URL settings were configured. */
function withLegacySettingsOnly(fn) {
  const keys = [
    "WEAVIATE_DEPLOYMENT",
    "WEAVIATE_HTTP_HOST",
    "WEAVIATE_HTTP_PORT",
    "WEAVIATE_HTTP_SECURE",
    "WEAVIATE_HTTP_PATH",
    "WEAVIATE_GRPC_HOST",
    "WEAVIATE_GRPC_PORT",
    "WEAVIATE_GRPC_SECURE",
  ];
  const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  for (const key of keys) delete process.env[key];
  try {
    return fn();
  } finally {
    for (const [key, value] of Object.entries(saved))
      if (value !== undefined) process.env[key] = value;
  }
}

module.exports = migrateWeaviateConnectionSettings;

const { updateENV } = require("../helpers/updateENV");

/**
 * Boot migration for Weaviate connection settings.
 *
 * Older configs only have WEAVIATE_ENDPOINT (a URL), optionally
 * WEAVIATE_GRPC_ENDPOINT, and WEAVIATE_API_KEY. The Weaviate settings now store
 * the deployment type, the explicit HTTP / gRPC connection options and the
 * authentication method. This infers those from the old values, exactly as the
 * Weaviate provider already interprets old configs, and saves them.
 *
 * - Runs only while WEAVIATE_DEPLOYMENT and WEAVIATE_HTTP_HOST are both unset
 *   and WEAVIATE_ENDPOINT is set, so it is a no-op once migrated.
 * - The old URL settings are kept: the explicit settings take precedence, and
 *   an older AnythingLLM version can still read them after a rollback.
 * - If the old values cannot be interpreted, nothing is changed; the provider
 *   reports the problem when it connects.
 * @returns {Promise<object|null>} the settings written, or null if nothing ran
 */
async function migrateWeaviateConnectionSettings() {
  const isSet = (key) => !!process.env[key]?.trim();
  if (
    isSet("WEAVIATE_DEPLOYMENT") ||
    isSet("WEAVIATE_HTTP_HOST") ||
    !isSet("WEAVIATE_ENDPOINT")
  )
    return null;

  try {
    const { Weaviate } = require("../vectorDbProviders/weaviate");
    const provider = new Weaviate();
    const deployment = provider.deploymentMode();
    const authMethod = isSet("WEAVIATE_API_KEY") ? "api-key" : "none";

    let settings;
    if (deployment === "cloud") {
      settings = {
        WeaviateDeployment: "cloud",
        WeaviateAuthMethod: authMethod,
      };
    } else {
      const options = provider.customConnectionOptions();
      settings = {
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
    }

    const { error } = await updateENV(settings);
    if (error) throw new Error(error);
    console.log(
      `\x1b[33m[WEAVIATE MIGRATION]\x1b[0m Converted the Weaviate endpoint URL settings to the new ${deployment} connection settings. You will not see this message again.`
    );
    return settings;
  } catch (e) {
    console.error(
      `\x1b[31m[WEAVIATE MIGRATION]\x1b[0m Could not convert the Weaviate connection settings, keeping them as they are: ${e.message}`
    );
    return null;
  }
}

module.exports = migrateWeaviateConnectionSettings;

const { AZURE_COGNITIVE_SCOPE } = require("./credentials");

/**
 * Listing what is actually deployed needs the data-plane `deployments` route,
 * which only exists on this api-version - the current ones (2024-10-21 and
 * later) dropped it and return 404. The `models` route is not a substitute: it
 * advertises the region's entire catalog (hundreds of entries), almost none of
 * which the resource can serve.
 */
const DEPLOYMENTS_API_VERSION = "2023-03-15-preview";

/** The catalog is only consulted for capability metadata, so it can use a current version. */
const CATALOG_API_VERSION = "2024-10-21";

/** Deployment listing backs a settings dropdown, so it should fail fast rather than hang the UI. */
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Azure takes the static key in its own header rather than as a bearer token,
 * so the two connection methods produce different headers entirely.
 *
 * This deliberately does not reuse the cached token provider from
 * `credentials.js`: the values here come from a settings form that may not be
 * saved yet, and a one-off listing call should not replace the cached provider
 * the live LLM clients are using.
 * @param {{connectionMethod: string, apiKey: string|null, managedIdentityClientId: string|null}} auth
 * @returns {Promise<Object>} Headers to send with the request.
 */
async function authHeaders({
  connectionMethod,
  apiKey,
  managedIdentityClientId,
}) {
  if (connectionMethod !== "managed_identity")
    return { "api-key": apiKey || process.env.AZURE_OPENAI_KEY };

  const { DefaultAzureCredential } = require("@azure/identity");
  const clientId =
    managedIdentityClientId ||
    process.env.AZURE_OPENAI_MANAGED_IDENTITY_CLIENT_ID ||
    null;
  const credential = new DefaultAzureCredential({
    ...(clientId ? { managedIdentityClientId: clientId } : {}),
  });
  const { token } = await credential.getToken(AZURE_COGNITIVE_SCOPE);
  return { Authorization: `Bearer ${token}` };
}

/**
 * Both routes hang off the resource host - the endpoint a user pastes in may
 * carry a project path (`/api/projects/...`) that has to be dropped first.
 * @param {string} endpoint
 * @returns {string} The origin of the endpoint.
 */
function resourceOrigin(endpoint) {
  const url = new URL(endpoint);
  url.protocol = "https";
  return url.origin;
}

/**
 * @param {string} url
 * @param {Object} headers
 * @returns {Promise<Object|null>} Parsed body, or null when the request fails.
 */
async function getJson(url, headers) {
  const response = await fetch(url, {
    method: "GET",
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  return await response.json();
}

/**
 * Capabilities per underlying model name, so a deployment can be sorted into
 * the chat or the embedding dropdown. Best-effort: a resource can serve models
 * that are absent from this catalog (partner models published through AI
 * Foundry, for instance), and those still work, so a miss must never be treated
 * as "unusable".
 * @param {string} origin
 * @param {Object} headers
 * @returns {Promise<Map<string, string>>} Model name to "chat"|"embedding"|"other".
 */
async function modelCapabilities(origin, headers) {
  const capabilities = new Map();
  const catalog = await getJson(
    `${origin}/openai/models?api-version=${CATALOG_API_VERSION}`,
    headers
  ).catch(() => null);

  for (const model of catalog?.data ?? []) {
    if (model?.capabilities?.chat_completion)
      capabilities.set(model.id, "chat");
    else if (model?.capabilities?.embeddings)
      capabilities.set(model.id, "embedding");
    else capabilities.set(model.id, "other");
  }
  return capabilities;
}

/**
 * The deployments on an Azure OpenAI / AI Foundry resource, which is what the
 * provider addresses models by. Only successful deployments are returned - one
 * still provisioning or failed cannot serve a request.
 * @param {Object} args
 * @param {string|null} args.endpoint - Defaults to the saved endpoint.
 * @param {string|null} args.apiKey
 * @param {string|null} args.connectionMethod - "api_key" or "managed_identity".
 * @param {string|null} args.managedIdentityClientId
 * @returns {Promise<{models: Array<{id: string, model: string, type: string}>, error: string|null}>}
 */
async function listAzureDeployments({
  endpoint = null,
  apiKey = null,
  connectionMethod = null,
  managedIdentityClientId = null,
} = {}) {
  const azureEndpoint = endpoint || process.env.AZURE_OPENAI_ENDPOINT;
  if (!azureEndpoint)
    return { models: [], error: "No Azure OpenAI endpoint was set." };

  try {
    const origin = resourceOrigin(azureEndpoint);
    const headers = await authHeaders({
      connectionMethod:
        connectionMethod || process.env.AZURE_OPENAI_CONNECTION_METHOD,
      apiKey,
      managedIdentityClientId,
    });

    const deployments = await getJson(
      `${origin}/openai/deployments?api-version=${DEPLOYMENTS_API_VERSION}`,
      headers
    );
    if (!deployments)
      return {
        models: [],
        error:
          "Could not list deployments. Check the endpoint and that these credentials can read the Azure resource.",
      };

    const capabilities = await modelCapabilities(origin, headers);
    const models = (deployments.data ?? [])
      .filter((deployment) => deployment.status === "succeeded")
      .map((deployment) => ({
        id: deployment.id,
        model: deployment.model,
        // "unknown" keeps a deployment selectable when the catalog has never
        // heard of its model - it is very likely still usable.
        type: capabilities.get(deployment.model) ?? "unknown",
      }));

    return { models, error: null };
  } catch (e) {
    console.error(`AzureOpenAi:listAzureDeployments`, e.message);
    return { models: [], error: e.message };
  }
}

module.exports = {
  DEPLOYMENTS_API_VERSION,
  listAzureDeployments,
};

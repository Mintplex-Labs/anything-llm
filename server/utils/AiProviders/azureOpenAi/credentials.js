/**
 * Credential handling for the Azure OpenAI (Azure AI Foundry) provider.
 *
 * Azure resources can authenticate two ways and both are supported here:
 *  - `api_key` (default): the static key from the resource, in AZURE_OPENAI_KEY.
 *  - `managed_identity`: a Microsoft Entra ID token fetched at request time from
 *    the ambient Azure credential chain, so no secret is ever stored. This is the
 *    only option when the resource sets `disableLocalAuth: true`.
 */

/** Scope every Azure AI Foundry / Azure OpenAI data-plane token is issued for. */
const AZURE_COGNITIVE_SCOPE = "https://cognitiveservices.azure.com/.default";

/**
 * The OpenAI SDK and LangChain both refuse to build a client without an API key,
 * but for managed identity the Authorization header is replaced per-request, so
 * the value they are handed is never sent anywhere.
 * @type {string}
 */
const MANAGED_IDENTITY_PLACEHOLDER = "managed-identity";

/** @type {{provider: (function(): Promise<string>), clientId: string|null}|null} */
let cachedTokenProvider = null;

/**
 * How this instance authenticates against Azure. Anything other than an explicit
 * "managed_identity" keeps the historical API key behavior.
 * @returns {"api_key"|"managed_identity"}
 */
function azureConnectionMethod() {
  return process.env.AZURE_OPENAI_CONNECTION_METHOD === "managed_identity"
    ? "managed_identity"
    : "api_key";
}

/**
 * @returns {boolean} Whether Entra ID / managed identity auth is in use.
 */
function usesManagedIdentity() {
  return azureConnectionMethod() === "managed_identity";
}

/**
 * A cached token provider for the configured identity. `DefaultAzureCredential`
 * covers the managed identity assigned to the host (Container Apps, App Service,
 * AKS workload identity, VMs) and falls back to the environment or a developer's
 * `az login` session, so the same setting works in production and locally.
 *
 * The provider caches the token and refreshes it before it expires, so this is
 * built once per process rather than per request.
 * @returns {function(): Promise<string>} Resolves to a bearer token.
 */
function bearerTokenProvider() {
  const clientId = process.env.AZURE_OPENAI_MANAGED_IDENTITY_CLIENT_ID || null;
  if (cachedTokenProvider && cachedTokenProvider.clientId === clientId)
    return cachedTokenProvider.provider;

  const {
    DefaultAzureCredential,
    getBearerTokenProvider,
  } = require("@azure/identity");
  const credential = new DefaultAzureCredential({
    // Omitted for a system-assigned identity - only a user-assigned one needs to
    // be picked out by client ID.
    ...(clientId ? { managedIdentityClientId: clientId } : {}),
  });
  cachedTokenProvider = {
    clientId,
    provider: getBearerTokenProvider(credential, AZURE_COGNITIVE_SCOPE),
  };
  return cachedTokenProvider.provider;
}

/**
 * Throws when the provider cannot authenticate with the current settings. With
 * managed identity there is nothing to validate up front - the credential chain
 * is only resolved once a request is actually made.
 * @returns {void}
 */
function validateAzureCredentials() {
  if (usesManagedIdentity()) return;
  if (!process.env.AZURE_OPENAI_KEY)
    throw new Error("No Azure API key was set.");
}

/**
 * Auth options for a plain `OpenAI` client (or LangChain's `configuration`)
 * pointed at an Azure endpoint. Azure's v1 API surface accepts an Entra ID token
 * in the same `Authorization: Bearer` header the SDK builds from `apiKey`, but a
 * token expires while `apiKey` is fixed at construction - so the header is set
 * from the token provider on every request instead.
 * @returns {{apiKey: string, fetch?: function}}
 */
function azureClientOptions() {
  if (!usesManagedIdentity()) return { apiKey: process.env.AZURE_OPENAI_KEY };

  const getToken = bearerTokenProvider();
  return {
    apiKey: MANAGED_IDENTITY_PLACEHOLDER,
    fetch: async (url, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${await getToken()}`);
      return fetch(url, { ...init, headers });
    },
  };
}

/**
 * Auth options for the SDK's `AzureOpenAI` client, which takes a token provider
 * directly and handles refresh itself.
 * @returns {{apiKey: string}|{azureADTokenProvider: function(): Promise<string>}}
 */
function azureOpenAiClientOptions() {
  if (!usesManagedIdentity()) return { apiKey: process.env.AZURE_OPENAI_KEY };
  return { azureADTokenProvider: bearerTokenProvider() };
}

module.exports = {
  AZURE_COGNITIVE_SCOPE,
  azureClientOptions,
  azureConnectionMethod,
  azureOpenAiClientOptions,
  usesManagedIdentity,
  validateAzureCredentials,
};

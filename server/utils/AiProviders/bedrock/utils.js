const { BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");
const { fromStatic } = require("@aws-sdk/token-providers");
const { ChatBedrockConverse } = require("@langchain/aws");

/** @typedef {'jpeg' | 'png' | 'gif' | 'webp'} */
const SUPPORTED_BEDROCK_IMAGE_FORMATS = ["jpeg", "png", "gif", "webp"];

/** @type {number} */
const DEFAULT_MAX_OUTPUT_TOKENS = 4096;

/** @type {number} */
const DEFAULT_CONTEXT_WINDOW_TOKENS = 8191;

/** @type {'iam' | 'iam_role' | 'sessionToken' | 'apiKey'} */
const SUPPORTED_CONNECTION_METHODS = [
  "iam",
  "iam_role",
  "sessionToken",
  "apiKey",
];

/**
 * Gets the AWS Bedrock authentication method from the environment variables.
 * @returns {"iam" | "iam_role" | "sessionToken" | "apiKey"} The authentication method.
 */
function getBedrockAuthMethod() {
  const method = process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD || "iam";
  return SUPPORTED_CONNECTION_METHODS.includes(method) ? method : "iam";
}

/**
 * Creates the AWS Bedrock credentials object based on the authentication method.
 * @param {"iam" | "iam_role" | "sessionToken" | "apiKey"} authMethod - The authentication method.
 * @returns {object | undefined} The credentials object.
 */
function createBedrockCredentials(authMethod) {
  switch (authMethod) {
    case "iam": // explicit credentials
      return {
        accessKeyId: process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_BEDROCK_LLM_ACCESS_KEY,
      };
    case "sessionToken": // Session token is used for temporary credentials
      return {
        accessKeyId: process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_BEDROCK_LLM_ACCESS_KEY,
        sessionToken: process.env.AWS_BEDROCK_LLM_SESSION_TOKEN,
      };
    // IAM role is used for long-term credentials implied by system process
    // is filled by the AWS SDK automatically if we pass in no credentials
    // returning undefined will allow this to happen
    case "iam_role":
      return undefined;
    case "apiKey":
      return fromStatic({
        token: { token: process.env.AWS_BEDROCK_LLM_API_KEY },
      });
    default:
      return undefined;
  }
}

/**
 * Creates the AWS Bedrock runtime client based on the authentication method.
 * @param {"iam" | "iam_role" | "sessionToken" | "apiKey"} authMethod - The authentication method.
 * @param {object | undefined} credentials - The credentials object.
 * @returns {BedrockRuntimeClient} The runtime client.
 */
function createBedrockRuntimeClient(authMethod, credentials) {
  const clientOpts = {
    region: process.env.AWS_BEDROCK_LLM_REGION,
  };

  switch (authMethod) {
    case "apiKey":
      clientOpts.token = credentials;
      clientOpts.authSchemePreference = ["httpBearerAuth"];
      break;
    default:
      clientOpts.credentials = credentials;
      break;
  }
  return new BedrockRuntimeClient(clientOpts);
}

/**
 * Creates the AWS Bedrock chat client based on the authentication method.
 * Used explicitly by the agent provider for the AWS Bedrock provider.
 * @param {object} config - The configuration object.
 * @param {"iam" | "iam_role" | "sessionToken" | "apiKey"} authMethod - The authentication method.
 * @param {object | undefined} credentials - The credentials object.
 * @param {string | null} model - The model to use.
 * @returns {ChatBedrockConverse} The chat client.
 */
function createBedrockChatClient(config = {}, authMethod, credentials, model) {
  authMethod ||= getBedrockAuthMethod();
  credentials ||= createBedrockCredentials(authMethod);
  model ||= process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE ?? null;
  const client = createBedrockRuntimeClient(authMethod, credentials);
  return new ChatBedrockConverse({
    region: process.env.AWS_BEDROCK_LLM_REGION,
    client,
    model,
    ...config,
  });
}

/**
 * Parses a MIME type string (e.g., "image/jpeg") to extract and validate the image format
 * supported by Bedrock Converse. Handles 'image/jpg' as 'jpeg'.
 * @param {string | null | undefined} mimeType - The MIME type string.
 * @returns {string | null} The validated image format (e.g., "jpeg") or null if invalid/unsupported.
 */
function getImageFormatFromMime(mimeType = "") {
  if (!mimeType) return null;
  const parts = mimeType.toLowerCase().split("/");
  if (parts?.[0] !== "image") return null;
  let format = parts?.[1];
  if (!format) return null;

  // Remap jpg to jpeg
  switch (format) {
    case "jpg":
      format = "jpeg";
      break;
    default:
      break;
  }

  if (!SUPPORTED_BEDROCK_IMAGE_FORMATS.includes(format)) return null;
  return format;
}

/**
 * Decodes a pure base64 string (without data URI prefix) into a Uint8Array using the atob method.
 * This approach matches the technique previously used by Langchain's implementation.
 * @param {string} base64String - The pure base64 encoded data.
 * @returns {Uint8Array | null} The resulting byte array or null on decoding error.
 */
function base64ToUint8Array(base64String) {
  try {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  } catch (e) {
    console.error(
      `[AWSBedrock] Error decoding base64 string with atob: ${e.message}`
    );
    return null;
  }
}

module.exports = {
  SUPPORTED_CONNECTION_METHODS,
  SUPPORTED_BEDROCK_IMAGE_FORMATS,
  DEFAULT_MAX_OUTPUT_TOKENS,
  DEFAULT_CONTEXT_WINDOW_TOKENS,
  getImageFormatFromMime,
  base64ToUint8Array,
  getBedrockAuthMethod,
  createBedrockCredentials,
  createBedrockRuntimeClient,
  createBedrockChatClient,
};

/**
 * AWS Bedrock exposes two HTTP endpoint surfaces that both accept Bedrock API
 * key (bearer) auth, but with disjoint model ID support:
 *
 * - `bedrock-mantle.{region}.api.aws` - the Mantle catalog. Accepts plain
 *   catalog IDs (eg: `anthropic.claude-haiku-4-5`, `minimax.minimax-m2.1`)
 *   but rejects cross-region inference profile IDs. Only exists in a subset
 *   of regions.
 * - `bedrock-runtime.{region}.amazonaws.com` - the primary runtime. Its
 *   `/anthropic` route accepts cross-region inference profile IDs
 *   (eg: `eu.anthropic.claude-sonnet-4-5-20250929-v1:0`) but rejects plain
 *   catalog IDs for models without on-demand throughput. Exists in every
 *   region where Bedrock is offered, including GovCloud.
 *
 * In many regions (eg: EU) Claude is ONLY available via cross-region
 * inference profiles, so we route by model ID shape: geo-prefixed profile
 * IDs go to bedrock-runtime, everything else keeps the Mantle path.
 *
 * The `bedrock.{region}.amazonaws.com` control plane also accepts bearer
 * auth and is used to list inference profiles the Mantle catalog omits.
 *
 * Each host can be overridden via env for air-gapped partitions (ISO/C2S)
 * whose domains do not follow the commercial naming scheme.
 */

// Geography prefixes AWS uses for system-defined cross-region inference
// profiles. Vendor prefixes (anthropic., meta., mistral., ...) never collide.
const INFERENCE_PROFILE_PREFIXES = [
  "us.",
  "eu.",
  "apac.",
  "global.",
  "us-gov.",
  "jp.",
  "au.",
  "ca.",
];

/**
 * Whether a model ID is a cross-region inference profile ID.
 * @param {string|null} modelId
 * @returns {boolean}
 */
function isInferenceProfileId(modelId = "") {
  if (!modelId) return false;
  return INFERENCE_PROFILE_PREFIXES.some((prefix) =>
    modelId.startsWith(prefix)
  );
}

/**
 * Base host for the Mantle (OpenAI-compatible catalog) endpoint.
 * @param {string} region
 * @returns {string}
 */
function mantleHost(region) {
  return (
    process.env.AWS_BEDROCK_LLM_MANTLE_ENDPOINT ||
    `https://bedrock-mantle.${region}.api.aws`
  );
}

/**
 * Base host for the bedrock-runtime endpoint.
 * @param {string} region
 * @returns {string}
 */
function runtimeHost(region) {
  return (
    process.env.AWS_BEDROCK_LLM_RUNTIME_ENDPOINT ||
    `https://bedrock-runtime.${region}.amazonaws.com`
  );
}

/**
 * Base host for the Bedrock control plane (model/profile listing).
 * @param {string} region
 * @returns {string}
 */
function controlPlaneHost(region) {
  return (
    process.env.AWS_BEDROCK_LLM_CONTROL_ENDPOINT ||
    `https://bedrock.${region}.amazonaws.com`
  );
}

/**
 * OpenAI-compatible base URL for chat completions.
 * @param {string} region
 * @returns {string}
 */
function openaiBaseURL(region) {
  return `${mantleHost(region)}/v1`;
}

/**
 * Anthropic Messages API base URL for the given model. Cross-region
 * inference profile IDs are only served by bedrock-runtime; plain catalog
 * IDs are only served by Mantle.
 * @param {string} region
 * @param {string|null} modelId
 * @returns {string}
 */
function anthropicBaseURL(region, modelId = "") {
  return isInferenceProfileId(modelId)
    ? `${runtimeHost(region)}/anthropic`
    : `${mantleHost(region)}/anthropic`;
}

module.exports = {
  isInferenceProfileId,
  mantleHost,
  runtimeHost,
  controlPlaneHost,
  openaiBaseURL,
  anthropicBaseURL,
};

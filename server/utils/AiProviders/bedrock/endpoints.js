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
 * Whether a model ID is a proprietary OpenAI GPT model (eg: `openai.gpt-6-sol`,
 * `us.openai.gpt-5.5`). These are served on the `/openai/v1` route, not the
 * Mantle `/v1` route. Open-weight `openai.gpt-oss-*` models are excluded since
 * they are served on Mantle `/v1` like other catalog models.
 * @param {string|null} modelId
 * @returns {boolean}
 */
function isOpenAIModelId(modelId = "") {
  if (!modelId) return false;
  const prefix = INFERENCE_PROFILE_PREFIXES.find((p) => modelId.startsWith(p));
  const baseId = prefix ? modelId.slice(prefix.length) : modelId;
  return (
    baseId.startsWith("openai.gpt-") && !baseId.startsWith("openai.gpt-oss")
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
 * OpenAI-compatible base URL for chat completions. OpenAI GPT models use the
 * `/openai/v1` route: inference profile IDs on bedrock-runtime, plain catalog
 * IDs on Mantle. All other models use Mantle `/v1`.
 * @param {string} region
 * @param {string|null} modelId
 * @returns {string}
 */
function openaiBaseURL(region, modelId = "") {
  if (!isOpenAIModelId(modelId)) return `${mantleHost(region)}/v1`;
  return isInferenceProfileId(modelId)
    ? `${runtimeHost(region)}/openai/v1`
    : `${mantleHost(region)}/openai/v1`;
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
  isOpenAIModelId,
  mantleHost,
  runtimeHost,
  controlPlaneHost,
  openaiBaseURL,
  anthropicBaseURL,
};

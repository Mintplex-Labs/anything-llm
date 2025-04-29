const { SystemSettings } = require("../models/systemSettings");

function utilEndpoints(app) {
  if (!app) return;

  app.get("/utils/metrics", async (_, response) => {
    try {
      const metrics = {
        online: true,
        version: getGitVersion(),
        mode: (await SystemSettings.isMultiUserMode())
          ? "multi-user"
          : "single-user",
        vectorDB: process.env.VECTOR_DB || "lancedb",
        storage: await getDiskStorage(),
      };
      response.status(200).json(metrics);
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });
}

function getGitVersion() {
  if (process.env.ANYTHING_LLM_RUNTIME === "docker") return "--";
  try {
    return require("child_process")
      .execSync("git rev-parse HEAD")
      .toString()
      .trim();
  } catch (e) {
    console.error("getGitVersion", e.message);
    return "--";
  }
}

function byteToGigaByte(n) {
  return n / Math.pow(10, 9);
}

async function getDiskStorage() {
  try {
    const checkDiskSpace = require("check-disk-space").default;
    const { free, size } = await checkDiskSpace("/");
    return {
      current: Math.floor(byteToGigaByte(free)),
      capacity: Math.floor(byteToGigaByte(size)),
    };
  } catch {
    return {
      current: null,
      capacity: null,
    };
  }
}

/**
 * Returns the model tag based on the provider set in the environment.
 * This information is used to identify the parent model for the system
 * so that we can prioritize the correct model and types for future updates
 * as well as build features in AnythingLLM directly for a specific model or capabilities.
 *
 * Disable with  {@link https://github.com/Mintplex-Labs/anything-llm?tab=readme-ov-file#telemetry--privacy|Disable Telemetry}
 * @returns {string} The model tag.
 */
function getModelTag() {
  let model = null;
  const provider = process.env.LLM_PROVIDER;

  switch (provider) {
    case "openai":
      model = process.env.OPEN_MODEL_PREF;
      break;
    case "anthropic":
      model = process.env.ANTHROPIC_MODEL_PREF;
      break;
    case "lmstudio":
      model = process.env.LMSTUDIO_MODEL_PREF;
      break;
    case "ollama":
      model = process.env.OLLAMA_MODEL_PREF;
      break;
    case "groq":
      model = process.env.GROQ_MODEL_PREF;
      break;
    case "togetherai":
      model = process.env.TOGETHER_AI_MODEL_PREF;
      break;
    case "azure":
      model = process.env.OPEN_MODEL_PREF;
      break;
    case "koboldcpp":
      model = process.env.KOBOLD_CPP_MODEL_PREF;
      break;
    case "localai":
      model = process.env.LOCAL_AI_MODEL_PREF;
      break;
    case "openrouter":
      model = process.env.OPENROUTER_MODEL_PREF;
      break;
    case "mistral":
      model = process.env.MISTRAL_MODEL_PREF;
      break;
    case "generic-openai":
      model = process.env.GENERIC_OPEN_AI_MODEL_PREF;
      break;
    case "perplexity":
      model = process.env.PERPLEXITY_MODEL_PREF;
      break;
    case "textgenwebui":
      model = "textgenwebui-default";
      break;
    case "bedrock":
      model = process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE;
      break;
    case "fireworksai":
      model = process.env.FIREWORKS_AI_LLM_MODEL_PREF;
      break;
    case "deepseek":
      model = process.env.DEEPSEEK_MODEL_PREF;
      break;
    case "litellm":
      model = process.env.LITE_LLM_MODEL_PREF;
      break;
    case "apipie":
      model = process.env.APIPIE_LLM_MODEL_PREF;
      break;
    case "xai":
      model = process.env.XAI_LLM_MODEL_PREF;
      break;
    case "novita":
      model = process.env.NOVITA_LLM_MODEL_PREF;
      break;
    case "nvidia-nim":
      model = process.env.NVIDIA_NIM_LLM_MODEL_PREF;
      break;
    case "ppio":
      model = process.env.PPIO_MODEL_PREF;
      break;
    case "gemini":
      model = process.env.GEMINI_LLM_MODEL_PREF;
      break;
    default:
      model = "--";
      break;
  }
  return model;
}

module.exports = {
  utilEndpoints,
  getGitVersion,
  getModelTag,
};

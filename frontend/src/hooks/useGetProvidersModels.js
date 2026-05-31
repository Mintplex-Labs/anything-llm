import System from "@/models/system";
import { useEffect, useState } from "react";

// Providers which cannot use this feature for workspace<>model selection
export const DISABLED_PROVIDERS = [
  "azure",
  "textgenwebui",
  "generic-openai",
  "bedrock",
];
const PROVIDER_DEFAULT_MODELS = {
  openai: [],
  gemini: [],
  anthropic: [],
  azure: [],
  lmstudio: [],
  localai: [],
  ollama: [],
  togetherai: [],
  fireworksai: [],
  "nvidia-nim": [],
  groq: [],
  cohere: [
    "command-r",
    "command-r-plus",
    "command",
    "command-light",
    "command-nightly",
    "command-light-nightly",
  ],
  textgenwebui: [],
  "generic-openai": [],
  bedrock: [],
  xai: ["grok-beta"],
};

// For providers with large model lists (e.g. togetherAi) - we subgroup the options
// by their creator organization (eg: Meta, Mistral, etc)
// which makes selection easier to read.
function groupModels(models) {
  return models.reduce((acc, model) => {
    acc[model.organization] = acc[model.organization] || [];
    acc[model.organization].push(model);
    return acc;
  }, {});
}

const groupedProviders = [
  "togetherai",
  "fireworksai",
  "openai",
  "novita",
  "openrouter",
  "ppio",
  "docker-model-runner",
  "sambanova",
];
/**
 * @typedef {Object} UseGetProviderModelsOptions
 * @property {string|null} [basePath]   Per-connection Ollama base URL override.
 * @property {string|null} [authToken]  Per-connection Ollama auth token override.
 * @property {boolean}     [skip]       When true, no fetch is performed and
 *                                      `loading` stays in its initial state.
 *                                      Useful to gate the fetch on async
 *                                      state still being resolved upstream.
 */

/**
 * @param {string|null} provider
 * @param {UseGetProviderModelsOptions} [options]
 */
export default function useGetProviderModels(provider = null, options = {}) {
  // Pulled out so the effect deps stay primitives — passing `options`
  // directly would re-fire on every parent render due to a new object identity.
  const basePath = options.basePath ?? null;
  const authToken = options.authToken ?? null;
  const skip = options.skip ?? false;

  const [defaultModels, setDefaultModels] = useState([]);
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchProviderModels() {
      if (!provider || skip) return;
      setLoading(true);
      const { models = [] } = await System.customModels(
        provider,
        authToken,
        basePath
      );
      // A newer fetch (e.g. user switched connections) has superseded this one.
      if (cancelled) return;
      if (
        PROVIDER_DEFAULT_MODELS.hasOwnProperty(provider) &&
        !groupedProviders.includes(provider)
      ) {
        setDefaultModels(PROVIDER_DEFAULT_MODELS[provider]);
      } else {
        setDefaultModels([]);
      }

      groupedProviders.includes(provider)
        ? setCustomModels(groupModels(models))
        : setCustomModels(models);
      setLoading(false);
    }
    fetchProviderModels();
    return () => {
      cancelled = true;
    };
  }, [provider, basePath, authToken, skip]);

  return { defaultModels, customModels, loading };
}

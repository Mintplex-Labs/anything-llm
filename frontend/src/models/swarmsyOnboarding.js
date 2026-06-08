import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));
  if (response.ok) return data;
  return {
    success: false,
    ...data,
    message: data?.message || fallbackMessage,
  };
}

const SwarmsyOnboarding = {
  status: async function () {
    return await fetch(`${API_BASE}/swarmsy/onboarding/status`, {
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(response, "Failed to resolve SWARMSY onboarding status.")
      )
      .catch(() => ({
        success: false,
        message: "Failed to resolve SWARMSY onboarding status.",
      }));
  },
  createHive: async function () {
    return await fetch(`${API_BASE}/swarmsy/onboarding/create-hive`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(response, "Failed to create SWARMSY HIVE.")
      )
      .catch(() => ({
        success: false,
        message: "Failed to create SWARMSY HIVE.",
      }));
  },
  applySparkyPrompt: async function (workspaceSlug, confirmApply = false) {
    return await fetch(
      `${API_BASE}/swarmsy/workspaces/${encodeURIComponent(
        workspaceSlug
      )}/sparky-prompt/apply`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ confirmApply }),
      }
    )
      .then((response) =>
        parseResponse(response, "Failed to apply SPARKY system prompt.")
      )
      .catch(() => ({
        success: false,
        message: "Failed to apply SPARKY system prompt.",
      }));
  },

  ingestRequiredDocs: async function () {
    return await fetch(`${API_BASE}/swarmsy/onboarding/ingest-required-docs`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(
          response,
          "Failed to ingest SWARMSY required doctrine docs."
        )
      )
      .catch(() => ({
        success: false,
        message: "Failed to ingest SWARMSY required doctrine docs.",
      }));
  },

  sparkyWikiSeedPacks: async function () {
    return await fetch(`${API_BASE}/swarmsy/sparky-wiki/seed-packs`, {
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(response, "Failed to list SPARKY Wiki seed packs.")
      )
      .catch(() => ({
        success: false,
        packs: [],
        message: "Failed to list SPARKY Wiki seed packs.",
      }));
  },
  importSparkyWikiSeedPack: async function (packId, workspaceSlug = null) {
    return await fetch(
      `${API_BASE}/swarmsy/sparky-wiki/seed-packs/${encodeURIComponent(
        packId
      )}/import`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ workspaceSlug }),
      }
    )
      .then((response) =>
        parseResponse(response, "Failed to import SPARKY Wiki seed pack.")
      )
      .catch(() => ({
        success: false,
        message: "Failed to import SPARKY Wiki seed pack.",
      }));
  },
  localUserOllamaStatus: async function ({ signal } = {}) {
    return await fetch(`${API_BASE}/swarmsy/local-user/ollama/status`, {
      headers: baseHeaders(),
      signal,
    })
      .then((response) =>
        parseResponse(
          response,
          "Failed to resolve SWARMSY local-user Ollama status."
        )
      )
      .catch((error) => {
        if (error?.name === "AbortError") throw error;
        return {
          success: false,
          mode: "unknown",
          provider: "ollama",
          status: "error",
          reachable: false,
          models: [],
          source: "fallback",
          message: "Failed to resolve SWARMSY local-user Ollama status.",
        };
      });
  },

  localUserImageEngineGenerate: async function (payload = {}, options = {}) {
    return await fetch(`${API_BASE}/swarmsy/local-user/image-engine/generate`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(payload),
      signal: options.signal,
    })
      .then((response) =>
        parseResponse(
          response,
          "Failed to generate an image with the local image engine."
        )
      )
      .catch((error) => {
        if (error?.name === "AbortError") throw error;
        return {
          success: false,
          mode: "unknown",
          engine: "comfyui",
          status: "unavailable",
          source: "fallback",
          message:
            "ComfyUI is not connected. Start your local image engine before image generation.",
        };
      });
  },
  localUserImageEngineStatus: async function ({ signal } = {}) {
    return await fetch(`${API_BASE}/swarmsy/local-user/image-engine/status`, {
      headers: baseHeaders(),
      signal,
    })
      .then((response) =>
        parseResponse(
          response,
          "Failed to resolve SWARMSY local image engine status."
        )
      )
      .catch((error) => {
        if (error?.name === "AbortError") throw error;
        return {
          success: false,
          mode: "unknown",
          available: false,
          engine: "comfyui",
          url: "http://localhost:8188",
          source: "fallback",
          message: "Failed to resolve SWARMSY local image engine status.",
        };
      });
  },
};

export default SwarmsyOnboarding;

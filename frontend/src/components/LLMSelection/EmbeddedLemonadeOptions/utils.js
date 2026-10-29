import { API_BASE } from "@/utils/constants";
import { baseHeaders, safeJsonParse } from "@/utils/request";

/**
 * API calls for the embedded Lemonade engine (`embedded_lemonade`).
 * See server/utils/AiProviders/embeddedLemonade/endpoints.js
 */
const EmbeddedLemonadeUtils = {
  /**
   * @returns {Promise<{state: 'idle'|'installing'|'starting'|'ready'|'error', message: string|null, progress: number|null}|null>}
   */
  status: async function () {
    return await fetch(`${API_BASE}/utils/embedded-lemonade/status`, {
      headers: baseHeaders(),
    })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);
  },

  /**
   * Three models for this server's hardware (fastest, balanced, most capable), for onboarding.
   * @returns {Promise<{ramGb?: number, vramGb?: number, recommendations: Array<{category: string, label: string, description: string, model: object}>}>}
   */
  recommendations: async function () {
    return await fetch(`${API_BASE}/utils/embedded-lemonade/recommendations`, {
      headers: baseHeaders(),
    })
      .then((res) => (res.ok ? res.json() : { recommendations: [] }))
      .catch(() => ({ recommendations: [] }));
  },

  /**
   * Downloads a model (a model id or a Hugging Face checkpoint like owner/repo:QUANT), streaming progress.
   * @param {string} modelName
   * @param {(percentage: number) => void} progressCallback
   * @returns {Promise<{success: boolean, error: string|null, modelId?: string}>} modelId is the id lemond registered the model under.
   */
  downloadModel: async function (modelName, progressCallback = () => {}) {
    try {
      const response = await fetch(
        `${API_BASE}/utils/embedded-lemonade/download-model`,
        {
          method: "POST",
          headers: baseHeaders(),
          body: JSON.stringify({ modelName }),
        }
      );
      if (!response.ok) {
        // eg: 409 when another model is already downloading.
        const { error } = await response.json().catch(() => ({}));
        throw new Error(
          error || "Error downloading model: " + response.statusText
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let event = null;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("event:")) {
            event = line.slice(6).trim();
            continue;
          }
          if (!line.startsWith("data:")) continue;
          const data = safeJsonParse(line.slice(5));
          if (event === "progress") progressCallback(data?.percentage ?? 0);
          if (event === "done")
            return { success: true, error: null, modelId: data?.modelId };
          if (event === "error")
            return { success: false, error: data?.error ?? "Download failed." };
        }
      }
      return { success: false, error: "The download ended unexpectedly." };
    } catch (error) {
      console.error("Error downloading model:", error);
      return {
        success: false,
        error:
          error?.message || "An error occurred while downloading the model",
      };
    }
  },

  /**
   * Cancels the download in flight. Its downloadModel call resolves with the error "Download cancelled."
   * @returns {Promise<boolean>}
   */
  cancelDownload: async function () {
    return await fetch(`${API_BASE}/utils/embedded-lemonade/download-model`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch(() => false);
  },

  /**
   * @param {string} modelName
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  removeModel: async function (modelName) {
    return await fetch(`${API_BASE}/utils/embedded-lemonade/remove-model`, {
      method: "DELETE",
      headers: baseHeaders(),
      body: JSON.stringify({ modelName }),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },
};

export default EmbeddedLemonadeUtils;

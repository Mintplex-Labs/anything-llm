import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import { safeJsonParse } from "@/utils/request";

const FoundryUtils = {
  /**
   * Report what the configured Foundry service supports. Model management is
   * only possible against a daemon that exposes the REST management routes.
   * @param {string} basePath - The base path of the Foundry service.
   * @returns {Promise<{source: 'rest'|'openai', canManage: boolean}>}
   */
  capabilities: async function (basePath = "") {
    try {
      const response = await fetch(`${API_BASE}/utils/foundry/capabilities`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ basePath }),
      });
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (error) {
      console.error("Error fetching Foundry capabilities:", error);
      return { source: "openai", canManage: false };
    }
  },

  /**
   * Download a Foundry model into the service's local storage.
   * @param {string} modelId - The alias of the model to download.
   * @param {string} basePath - The base path of the Foundry service.
   * @param {(percentage: number) => void} progressCallback - Receives download progress.
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  downloadModel: async function (
    modelId,
    basePath = "",
    progressCallback = () => {}
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const response = await fetch(
          `${API_BASE}/utils/foundry/download-model`,
          {
            method: "POST",
            headers: baseHeaders(),
            body: JSON.stringify({ modelId, basePath }),
          }
        );

        if (!response.ok)
          throw new Error("Error downloading model: " + response.statusText);
        const reader = response.body.getReader();
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) {
            done = true;
            resolve({ success: true, error: null });
            break;
          }

          const chunk = new TextDecoder("utf-8").decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const data = safeJsonParse(line.slice(5));
            switch (data?.type) {
              case "success":
                done = true;
                resolve({ success: true, error: null });
                break;
              case "error":
                done = true;
                resolve({
                  success: false,
                  error: data?.error || data?.message,
                });
                break;
              case "progress":
                progressCallback(data?.percentage);
                break;
              default:
                break;
            }
          }
        }
      } catch (error) {
        console.error("Error downloading model:", error);
        resolve({
          success: false,
          error:
            error?.message || "An error occurred while downloading the model",
        });
      }
    });
  },

  /**
   * Remove a Foundry model from local storage.
   * @param {string} modelId - The alias of the model to delete.
   * @param {string} basePath - The base path of the Foundry service.
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  deleteModel: async function (modelId, basePath = "") {
    try {
      const response = await fetch(`${API_BASE}/utils/foundry/delete-model`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ modelId, basePath }),
      });

      const data = await response.json();
      if (!response.ok || !data.success)
        return {
          success: false,
          error: data.error || "An error occurred while deleting the model",
        };

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error deleting model:", error);
      return {
        success: false,
        error: error?.message || "An error occurred while deleting the model",
      };
    }
  },
};

export default FoundryUtils;

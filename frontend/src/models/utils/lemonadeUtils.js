import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import { safeJsonParse } from "@/utils/request";

const LemonadeUtils = {
  /**
   * Download a Lemonade model.
   * @param {string} modelId - The ID of the model to download.
   * @param {(percentage: number) => void} progressCallback - The callback to receive the progress percentage. If the model is already downloaded, it will be called once with 100.
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
          `${API_BASE}/utils/lemonade/download-model`,
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
            resolve({ success: true });
          } else {
            const chunk = new TextDecoder("utf-8").decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data:")) {
                const data = safeJsonParse(line.slice(5));
                switch (data?.type) {
                  case "success":
                    done = true;
                    resolve({ success: true });
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
   * Delete a Lemonade model from local storage.
   * If the model is currently loaded, it will be unloaded first.
   * @param {string} modelId - The ID of the model to delete.
   * @param {string} basePath - The base path of the Lemonade server.
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  deleteModel: async function (modelId, basePath = "") {
    try {
      const response = await fetch(`${API_BASE}/utils/lemonade/delete-model`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ modelId, basePath }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || "An error occurred while deleting the model",
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error("Error deleting model:", error);
      return {
        success: false,
        error: error?.message || "An error occurred while deleting the model",
      };
    }
  },
};

export default LemonadeUtils;

import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import { safeJsonParse } from "@/utils/request";

const DMRUtils = {
  /**
   * Download a DMR model.
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
        const response = await fetch(`${API_BASE}/utils/dmr/download-model`, {
          method: "POST",
          headers: baseHeaders(),
          body: JSON.stringify({ modelId, basePath }),
        });

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
  // Uninstall a DMR model is not supported via the API
};

export default DMRUtils;

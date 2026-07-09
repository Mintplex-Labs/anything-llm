import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const StorageFiles = {
  /**
   * Download a file from the server
   * @param {string} filename - The filename to download
   * @returns {Promise<Blob|null>}
   */
  download: async function (storageFilename) {
    return await fetch(
      `${API_BASE}/agent-skills/generated-files/${encodeURIComponent(storageFilename)}`,
      { headers: baseHeaders() }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to download file");
        return res.blob();
      })
      .catch((e) => {
        console.error("Download failed:", e);
        return null;
      });
  },

  /**
   * Load an inline PDF preview of a generated file
   * @param {string} storageFilename - The storage filename to preview
   * @returns {Promise<Blob|null>}
   */
  preview: async (storageFilename) => {
    return await fetch(
      `${API_BASE}/agent-skills/generated-files/${storageFilename}/preview`,
      { method: "GET", headers: baseHeaders() }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load preview");
        return res.blob();
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
};

export default StorageFiles;

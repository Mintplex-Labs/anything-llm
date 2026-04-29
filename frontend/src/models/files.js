import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const StorageFiles = {
  /**
   * Download a file as a Blob (triggers browser save-as).
   * @param {string} storageFilename
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
   * Returns a URL for inline preview of a file (PDF, images).
   * Passes the auth token as a query param so it works in
   * <iframe src="..."> and <img src="..."> which can't send headers.
   * @param {string} storageFilename
   * @returns {string}
   */
  previewUrl: function (storageFilename) {
    const token = window?.localStorage?.getItem("anythingllm_token") ?? null;
    const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${API_BASE}/agent-skills/generated-files/${encodeURIComponent(storageFilename)}/preview${tokenParam}`;
  },

  /**
   * Fetches a file's content as a plain string.
   * Used for code, text, CSV, JSON, Markdown, and HTML previews.
   * @param {string} storageFilename
   * @returns {Promise<string>}
   */
  fetchText: async function (storageFilename) {
    const res = await fetch(
      `${API_BASE}/agent-skills/generated-files/${encodeURIComponent(storageFilename)}`,
      { headers: baseHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch file for preview");
    return res.text();
  },
};

export default StorageFiles;

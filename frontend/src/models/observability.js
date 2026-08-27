import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

/**
 * @typedef {Object} ObservabilitySettings
 * @property {string|null} provider - the enabled observability provider (eg: "langfuse") or null when disabled
 * @property {Object<string, string>} config - provider-specific credentials (eg: publicKey, secretKey, host)
 */

const Observability = {
  /**
   * Get current observability settings.
   * @returns {Promise<{success: boolean, error: string|null} & ObservabilitySettings>}
   */
  getSettings: async () => {
    return await fetch(`${API_BASE}/observability/settings`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
        provider: null,
        config: {},
      }));
  },

  /**
   * Update observability settings.
   * @param {string|null} provider - provider slug or null/"none" to disable
   * @param {Object<string, string>} config - provider-specific credentials
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  updateSettings: async (provider, config = {}) => {
    return await fetch(`${API_BASE}/observability/settings`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ provider, config }),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },
};

export default Observability;

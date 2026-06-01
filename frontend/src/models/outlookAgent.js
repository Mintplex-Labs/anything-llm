import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const OutlookAgent = {
  /**
   * Save Outlook credentials and get the OAuth authorization URL.
   * @param {Object} credentials - The credentials to save
   * @param {string} credentials.clientId - Application (Client) ID
   * @param {string} credentials.tenantId - Directory (Tenant) ID
   * @param {string} credentials.clientSecret - Client Secret
   * @param {string} credentials.authType - Authentication type (organization, common, consumers)
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  saveCredentialsAndGetAuthUrl: async ({
    clientId,
    tenantId,
    clientSecret,
    authType,
  }) => {
    return await fetch(`${API_BASE}/admin/agent-skills/outlook/auth-url`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ clientId, tenantId, clientSecret, authType }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  /**
   * Get the current authentication status for Outlook.
   * @returns {Promise<{success: boolean, isConfigured?: boolean, hasCredentials?: boolean, isAuthenticated?: boolean, tokenExpiry?: number, config?: {clientId: string, tenantId: string, clientSecret: string}, error?: string}>}
   */
  getStatus: async () => {
    return await fetch(`${API_BASE}/admin/agent-skills/outlook/status`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  /**
   * Revoke the Outlook authentication tokens.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  revokeAccess: async () => {
    return await fetch(`${API_BASE}/admin/agent-skills/outlook/revoke`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default OutlookAgent;

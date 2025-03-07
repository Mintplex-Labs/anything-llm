const { default: axios } = require("axios");
const setLogger = require("../logger");
const querystring = require("querystring");
const logger = setLogger();

const KEYCLOAK_CONFIG = {
  redirectUrl: process.env.KC_REDIRECT_URL,
  baseUrl: process.env.KC_BASE_URL,
  realm: process.env.KC_REALM,
  clientId: process.env.KC_CLIENT_ID,
  clientSecret: process.env.KC_CLIENT_SECRET,
  adminClientSecret: process.env.KC_ADMIN_CLIENT_SECRET,
  redirectUrlChatPlugin: process.env.KC_REDIRECT_URL_CHAT_PLUGIN,
};

const AUTH_SERVER_URL = `${KEYCLOAK_CONFIG.baseUrl}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect`;

class KeycloakHelper {
  constructor() {}
  static extractError(e) {
    return e?.response?.data || e?.data || e?.message || e?.error || e;
  }
  static getAdminToken = async () => {
    try {
      logger.info("Getting admin token from keycloak...");
      const configs = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "admin-cli",
        client_secret: KEYCLOAK_CONFIG.adminClientSecret,
      }).toString();
      const url = `${KEYCLOAK_CONFIG.baseUrl}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;
      const response = await axios.post(url, body, configs);
      return response?.data?.access_token;
    } catch (e) {
      logger.error(
        "Something went wrong while getting admin token from keycloak",
        this.extractError(e)
      );
      throw e;
    }
  };
  static getConfigs = async (includeAuth = true, additionalConfigs = {}) => {
    logger.info("Getting common config for keycloak");
    let token = "";
    if (includeAuth) {
      token = await this.getAdminToken();
    }
    const configs = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(includeAuth && { Authorization: `Bearer ${token}` }),
      },
      ...additionalConfigs,
    };
    return configs;
  };

  static logoutUser = async (uid) => {
    try {
      logger.info(`Logging out user with uid - ${uid} from keycloak`);
      const configs = await this.getConfigs();
      const url = `${KEYCLOAK_CONFIG.baseUrl}/admin/realms/${KEYCLOAK_CONFIG.realm}/users/${uid}/logout`;
      await axios.post(url, {}, configs);
      return true;
    } catch (e) {
      logger.error(
        `Something went wrong while logging out user - ${uid}`,
        this.extractError(e)
      );
      return false;
    }
  };

  static getUserInfoByCode = async (code, redirectUrl, clientId, clientSecret) => {
    try {
      logger.info(`Getting token by Authorization code from keycloak`);
      const configs = await this.getConfigs(false);
      const body = querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUrl,
        client_id: clientId,
        client_secret: clientSecret,
      });
      const url = `${AUTH_SERVER_URL}/token`;
      const response = await axios.post(url, body, configs);
      const token = response?.data?.access_token;

      logger.info("Getting userinfo by token from keycloak");
      const userinfoResponse = await axios.get(`${AUTH_SERVER_URL}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return userinfoResponse.data;
    } catch (e) {
      logger.error(
        `Something went wrong while getting user info by code`,
        this.extractError(e)
      );
      return false;
    }
  };
  static getAuthRedirectUrl = (redirectUrl = KEYCLOAK_CONFIG.redirectUrl) => {
    return (
      `${AUTH_SERVER_URL}/auth?` +
      querystring.stringify({
        client_id: KEYCLOAK_CONFIG.clientId,
        response_type: "code",
        scope: "openid",
        redirect_uri: redirectUrl,
      })
    );
  };
}

module.exports = { KeycloakHelper, KEYCLOAK_CONFIG };

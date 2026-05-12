const {
  ExternalCommunicationConnector,
} = require("../models/externalCommunicationConnector");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { isSingleUserMode } = require("../utils/middleware/multiUserProtected");
const { reqBody, isValidUrl } = require("../utils/http");
const { EncryptionManager } = require("../utils/EncryptionManager");

const CONNECTOR_TYPE = "advanced_gateway";
const ENCRYPTED_PREFIX = "enc:";

const DEFAULT_CONFIG = {
  active: false,
  gateway_url: "",
  api_key: null,
  api_secret: null,
};

function encryptSecret(secret = null) {
  if (!secret) return null;
  const manager = new EncryptionManager();
  const encrypted = manager.encrypt(secret);
  return encrypted ? ENCRYPTED_PREFIX + encrypted : null;
}

function decryptSecret(secret = null) {
  if (!secret) return null;
  if (!secret.startsWith(ENCRYPTED_PREFIX)) return secret;
  const manager = new EncryptionManager();
  return manager.decrypt(secret.slice(ENCRYPTED_PREFIX.length));
}

function hasSecret(value = null) {
  return typeof value === "string" && value.length > 0;
}

function persistedConfig(connector = null) {
  if (!connector) return { ...DEFAULT_CONFIG };
  return {
    ...DEFAULT_CONFIG,
    ...connector.config,
    active: Boolean(connector.active),
  };
}

function publicConfig(connector = null) {
  const config = persistedConfig(connector);
  return {
    active: config.active,
    gateway_url: config.gateway_url || "",
    has_api_key: hasSecret(config.api_key),
    has_api_secret: hasSecret(config.api_secret),
  };
}

function validateGatewayUrl(url = "") {
  if (!url) return { valid: true, value: "" };
  const value = String(url).trim();
  return { valid: isValidUrl(value), value };
}

function advancedGatewayEndpoints(app) {
  if (!app) return;

  app.get(
    "/advanced-gateway/config",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const connector =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        return response
          .status(200)
          .json({ config: connector ? publicConfig(connector) : null });
      } catch (e) {
        console.error(e.message, e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/advanced-gateway/config",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const existing =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        const current = persistedConfig(existing);
        const body = reqBody(request) || {};
        const gatewayUrl = validateGatewayUrl(body.gateway_url);

        if (!gatewayUrl.valid) {
          return response.status(400).json({
            success: false,
            error: "Gateway URL must be a valid http(s) URL.",
          });
        }

        const nextConfig = {
          active: Boolean(body.active),
          gateway_url: gatewayUrl.value,
          api_key: body.api_key?.trim()
            ? encryptSecret(body.api_key.trim())
            : current.api_key,
          api_secret: body.api_secret?.trim()
            ? encryptSecret(body.api_secret.trim())
            : current.api_secret,
        };

        const { connector, error } =
          await ExternalCommunicationConnector.upsert(
            CONNECTOR_TYPE,
            nextConfig
          );
        if (error) return response.status(500).json({ success: false, error });

        return response
          .status(200)
          .json({ success: true, config: publicConfig(connector) });
      } catch (e) {
        console.error(e.message, e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/advanced-gateway/test",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const connector =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        const config = persistedConfig(connector);

        if (!connector || !config.gateway_url) {
          return response.status(400).json({
            success: false,
            status: "missing_config",
            message: "Gateway URL is required before testing.",
          });
        }

        return response.status(200).json({
          success: true,
          status: "mock",
          message: "Advanced Gateway test placeholder.",
        });
      } catch (e) {
        console.error(e.message, e);
        return response.sendStatus(500);
      }
    }
  );
}

module.exports = {
  advancedGatewayEndpoints,
  decryptSecret,
  encryptSecret,
  publicConfig,
  persistedConfig,
};

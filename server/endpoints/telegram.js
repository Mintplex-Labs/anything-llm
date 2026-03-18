const {
  ExternalCommunicationConnector,
} = require("../models/externalCommunicationConnector");
const { Telemetry } = require("../models/telemetry");
const { TelegramBotService } = require("../utils/telegramBot");
const {
  encryptToken,
  decryptToken,
} = require("../utils/telegramBot/encryption");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { reqBody } = require("../utils/http");
const { EventLogs } = require("../models/eventLogs");

function telegramEndpoints(app) {
  if (!app) return;

  /**
   * Get the current Telegram bot configuration (token masked).
   */
  app.get(
    "/telegram/config",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        if (response.locals?.multiUserMode) {
          return response.status(403).json({
            config: null,
            error: "Telegram bot is only available in single-user mode.",
          });
        }

        const connector = await ExternalCommunicationConnector.get("telegram");
        if (!connector) {
          return response.status(200).json({ config: null });
        }

        const plainToken = decryptToken(connector.config.bot_token);
        const service = new TelegramBotService();
        return response.status(200).json({
          config: {
            active: connector.active,
            connected: service.isRunning,
            bot_username: connector.config.bot_username || null,
            default_workspace: connector.config.default_workspace || null,
            bot_token_masked: ExternalCommunicationConnector.maskToken(plainToken),
            voice_response_mode:
              connector.config.voice_response_mode || "text_only",
          },
        });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Verify token, save config, and start the Telegram bot.
   */
  app.post(
    "/telegram/connect",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        if (response.locals?.multiUserMode) {
          return response.status(403).json({
            success: false,
            error: "Telegram bot is only available in single-user mode.",
          });
        }

        const { bot_token, default_workspace } = reqBody(request);
        if (!bot_token || !default_workspace) {
          return response.status(400).json({
            success: false,
            error: "Bot token and default workspace are required.",
          });
        }

        // Verify the token with Telegram API
        const verification = await TelegramBotService.verifyToken(bot_token);
        if (!verification.valid) {
          return response.status(400).json({
            success: false,
            error: `Invalid bot token: ${verification.error}`,
          });
        }

        // Preserve approved users when reconnecting with a new token
        const existing = await ExternalCommunicationConnector.get("telegram");
        const storedConfig = {
          bot_token: encryptToken(bot_token),
          bot_username: verification.username,
          default_workspace,
          owner_chat_id: null,
          approved_users: existing?.config?.approved_users || [],
          voice_response_mode:
            existing?.config?.voice_response_mode || "text_only",
        };

        // Save config with encrypted token
        const { error } = await ExternalCommunicationConnector.upsert(
          "telegram",
          storedConfig,
          true
        );
        if (error) {
          return response.status(500).json({ success: false, error });
        }

        // Start the bot with the plaintext token
        const service = new TelegramBotService();
        await service.start({ ...storedConfig, bot_token });

        await EventLogs.logEvent("telegram_bot_connected", {
          bot_username: verification.username,
        });
        await Telemetry.sendTelemetry("telegram_bot_connected");

        return response.status(200).json({
          success: true,
          bot_username: verification.username,
        });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Stop the Telegram bot and deactivate the connector.
   */
  app.post(
    "/telegram/disconnect",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const service = new TelegramBotService();
        await service.stop();

        const connector = await ExternalCommunicationConnector.get("telegram");
        if (connector) {
          await ExternalCommunicationConnector.setActive("telegram", false);
        }

        await EventLogs.logEvent("telegram_bot_disconnected");

        return response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Get the bot's current connection status.
   */
  app.get(
    "/telegram/status",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const connector = await ExternalCommunicationConnector.get("telegram");
        const service = new TelegramBotService();
        return response.status(200).json({
          active: connector?.active && service.isRunning,
          bot_username: connector?.config?.bot_username || null,
        });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Get pending pairing requests waiting for approval.
   */
  app.get(
    "/telegram/pending-users",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const service = new TelegramBotService();
        return response
          .status(200)
          .json({ users: service.pendingPairings || [] });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Get approved users list from connector config.
   */
  app.get(
    "/telegram/approved-users",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const connector = await ExternalCommunicationConnector.get("telegram");
        const approved = connector?.config?.approved_users || [];
        return response.status(200).json({ users: approved });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Approve a pending user's pairing request.
   */
  app.post(
    "/telegram/approve-user",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { chatId } = reqBody(request);
        if (!chatId)
          return response
            .status(400)
            .json({ success: false, error: "chatId is required." });

        const service = new TelegramBotService();
        await service.approveUser(chatId);
        await EventLogs.logEvent("telegram_user_approved", { chatId });
        return response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Deny a pending user's pairing request.
   */
  app.post(
    "/telegram/deny-user",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { chatId } = reqBody(request);
        if (!chatId)
          return response
            .status(400)
            .json({ success: false, error: "chatId is required." });

        const service = new TelegramBotService();
        await service.denyUser(chatId);
        await EventLogs.logEvent("telegram_user_denied", { chatId });
        return response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Revoke an approved user's access.
   */
  app.post(
    "/telegram/revoke-user",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { chatId } = reqBody(request);
        if (!chatId)
          return response
            .status(400)
            .json({ success: false, error: "chatId is required." });

        const service = new TelegramBotService();
        await service.revokeUser(chatId);
        await EventLogs.logEvent("telegram_user_revoked", { chatId });
        return response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Update the Telegram bot configuration (voice mode, etc).
   */
  app.post(
    "/telegram/update-config",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { voice_response_mode } = reqBody(request);
        const updates = {};

        if (
          voice_response_mode &&
          ["text_only", "mirror", "always_voice"].includes(voice_response_mode)
        ) {
          updates.voice_response_mode = voice_response_mode;
        }

        if (Object.keys(updates).length === 0) {
          return response
            .status(400)
            .json({ success: false, error: "No valid updates provided." });
        }

        const { error } =
          await ExternalCommunicationConnector.updateConfig("telegram", updates);
        if (error) {
          return response.status(500).json({ success: false, error });
        }

        // Update the running bot's config so changes take effect immediately
        const service = new TelegramBotService();
        if (service.isRunning) service.updateConfig(updates);

        return response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { telegramEndpoints };

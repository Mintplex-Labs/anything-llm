const { v4: uuidv4, validate } = require("uuid");
const { VALID_CHAT_MODE } = require("../chats/stream");
const { EmbedChats } = require("../../models/embedChats");
const { EmbedConfig } = require("../../models/embedConfig");
const { reqBody, safeJsonParse } = require("../http");

// Finds or Aborts request for a /:embedId/ url. This should always
// be the first middleware and the :embedID should be in the URL.
async function validEmbedConfig(request, response, next) {
  const { embedId } = request.params;

  const embed = await EmbedConfig.getWithWorkspace({ uuid: embedId });
  if (!embed) {
    response.sendStatus(404).end();
    return;
  }

  response.locals.embedConfig = embed;
  next();
}

function setConnectionMeta(request, response, next) {
  response.locals.connection = {
    host: request.headers?.origin,
    ip: request?.ip,
  };
  next();
}

async function validEmbedConfigId(request, response, next) {
  const { embedId } = request.params;

  const embed = await EmbedConfig.get({ id: Number(embedId) });
  if (!embed) {
    response.sendStatus(404).end();
    return;
  }

  response.locals.embedConfig = embed;
  next();
}

async function canRespond(request, response, next) {
  try {
    const embed = response.locals.embedConfig;
    if (!embed) {
      response.sendStatus(404).end();
      return;
    }

    // Block if disabled by admin.
    if (!embed.enabled) {
      response.status(503).json({
        id: uuidv4(),
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error:
          "This chat has been disabled by the administrator - try again later.",
      });
      return;
    }

    // Check if requester hostname is in the valid allowlist of domains.
    const host = request.headers.origin ?? "";
    const allowedHosts = EmbedConfig.parseAllowedHosts(embed);
    if (allowedHosts !== null && !allowedHosts.includes(host)) {
      response.status(401).json({
        id: uuidv4(),
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: "Invalid request.",
      });
      return;
    }

    const { sessionId, message } = reqBody(request);
    if (typeof sessionId !== "string" || !validate(String(sessionId))) {
      response.status(404).json({
        id: uuidv4(),
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: "Invalid session ID.",
      });
      return;
    }

    if (!message?.length || !VALID_CHAT_MODE.includes(embed.chat_mode)) {
      response.status(400).json({
        id: uuidv4(),
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: !message?.length
          ? "Message is empty."
          : `${embed.chat_mode} is not a valid mode.`,
      });
      return;
    }

    const currentIp = response.locals.connection?.ip;
    const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);

    // Verifies ip matches the first ip used with this session
    if (embed.ip_session_binding === true) {
      const previousChat = await EmbedChats.get(
        {
          embed_id: embed.id,
          session_id: sessionId,
        },
        1,
        { id: "asc" }
      );

      if (previousChat) {
        const previousConnection = safeJsonParse(
          previousChat.connection_information,
          {}
        );
        if (previousConnection.ip && previousConnection.ip !== currentIp) {
          response.status(429).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: "Invalid request.",
            errorMsg: "Invalid request.",
          });
          return;
        }
      }
    }

    if (
      !isNaN(embed.max_chats_per_day) &&
      Number(embed.max_chats_per_day) > 0
    ) {
      const dailyChatCount = await EmbedChats.count({
        embed_id: embed.id,
        createdAt: {
          gte: oneDayAgo,
        },
      });

      if (dailyChatCount >= Number(embed.max_chats_per_day)) {
        response.status(429).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: "Rate limit exceeded",
          errorMsg:
            "The quota for this chat has been reached. Try again later or contact the site owner.",
        });
        return;
      }
    }

    if (
      !isNaN(embed.max_chats_per_session) &&
      Number(embed.max_chats_per_session) > 0
    ) {
      const dailySessionCount = await EmbedChats.count({
        embed_id: embed.id,
        session_id: sessionId,
        createdAt: {
          gte: oneDayAgo,
        },
      });

      if (dailySessionCount >= Number(embed.max_chats_per_session)) {
        response.status(429).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error:
            "Your quota for this chat has been reached. Try again later or contact the site owner.",
        });
        return;
      }
    }

    // Checks number of chats per ip per day across all sessions
    if (
      !isNaN(embed.max_chats_per_ip_per_day) &&
      Number(embed.max_chats_per_ip_per_day) > 0
    ) {
      const recentChats = await EmbedChats.where(
        {
          embed_id: embed.id,
          createdAt: {
            gte: oneDayAgo,
          },
        },
        null,
        null
      );

      const ipChatCount = recentChats.filter((chat) => {
        const connection = safeJsonParse(chat.connection_information, {});
        return connection.ip === currentIp;
      }).length;

      if (ipChatCount >= Number(embed.max_chats_per_ip_per_day)) {
        response.status(429).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: "Rate limit exceeded for this IP address per day.",
          errorMsg:
            "Your quota for this chat has been reached. Try again later or contact the site owner.",
        });
        return;
      }
    }

    // Checks number of chats per ip per session
    if (
      !isNaN(embed.max_chats_per_ip_per_session) &&
      Number(embed.max_chats_per_ip_per_session) > 0
    ) {
      const recentSessionChats = await EmbedChats.where(
        {
          embed_id: embed.id,
          session_id: sessionId,
          createdAt: {
            gte: oneDayAgo,
          },
        },
        null,
        null
      );

      const ipSessionChatCount = recentSessionChats.filter((chat) => {
        const connection = safeJsonParse(chat.connection_information, {});
        return connection.ip === currentIp;
      }).length;

      if (ipSessionChatCount >= Number(embed.max_chats_per_ip_per_session)) {
        response.status(429).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: "Rate limit exceeded for this IP address per session.",
          errorMsg:
            "Your quota for this chat has been reached. Try again later or contact the site owner.",
        });
        return;
      }
    }

    next();
  } catch (e) {
    response.status(500).json({
      id: uuidv4(),
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: "Invalid request.",
    });
    return;
  }
}

module.exports = {
  setConnectionMeta,
  validEmbedConfig,
  validEmbedConfigId,
  canRespond,
};

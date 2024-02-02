const { v4: uuidv4 } = require("uuid");
const { VALID_CHAT_MODE } = require("../chats/stream");
const { EmbedChats } = require("../../models/embedChats");
const { EmbedConfig } = require("../../models/embedConfig");
const { reqBody } = require("../http");

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

  if (!isNaN(embed.max_chats_per_day) && Number(embed.max_chats_per_day) > 0) {
    const dailyChatCount = await EmbedChats.count({
      embed_id: embed.id,
      createdAt: {
        gte: new Date(new Date() - 24 * 60 * 60 * 1000),
      },
    });

    if (dailyChatCount >= Number(embed.max_chats_per_day)) {
      response.status(429).json({
        id: uuidv4(),
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error:
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
        gte: new Date(new Date() - 24 * 60 * 60 * 1000),
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

  next();
}

module.exports = {
  setConnectionMeta,
  validEmbedConfig,
  validEmbedConfigId,
  canRespond,
};

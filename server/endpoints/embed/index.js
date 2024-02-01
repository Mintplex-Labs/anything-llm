const { v4: uuidv4 } = require("uuid");
const { reqBody, multiUserMode } = require("../../utils/http");
const { Telemetry } = require("../../models/telemetry");
const {
  writeResponseChunk,
  VALID_CHAT_MODE,
} = require("../../utils/chats/stream");
const { streamChatWithForEmbed } = require("../../utils/chats/embed");
const { convertToChatHistory } = require("../../utils/chats");
const { EmbedConfig } = require("../../models/embedConfig");
const { EmbedChats } = require("../../models/embedChats");

function embeddedEndpoints(app) {
  if (!app) return;

  // TODO: middleware
  app.post("/embed/:embedId/stream-chat", async (request, response) => {
    try {
      const { embedId } = request.params;
      const {
        sessionId,
        message,
        // optional keys for override of defaults if enabled.
        prompt = null,
        model = null,
        temperature = null,
      } = reqBody(request);

      const embed = await EmbedConfig.getWithWorkspace({ uuid: embedId });
      if (!embed) {
        response.sendStatus(400).end();
        return;
      }

      if (!embed.enabled) {
        response.status(200).json({
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

      if (!message?.length || !VALID_CHAT_MODE.includes(embed.chat_mode)) {
        response.status(200).json({
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

      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Connection", "keep-alive");
      response.flushHeaders();

      // TODO Per-user and Per-day limit checks for embed_config

      await streamChatWithForEmbed(response, embed, message, sessionId, {
        prompt,
        model,
        temperature,
      });
      await Telemetry.sendTelemetry("embed_sent_chat", {
        multiUserMode: multiUserMode(response),
        LLMSelection: process.env.LLM_PROVIDER || "openai",
        Embedder: process.env.EMBEDDING_ENGINE || "inherit",
        VectorDbSelection: process.env.VECTOR_DB || "pinecone",
      });
      response.end();
    } catch (e) {
      console.error(e);
      writeResponseChunk(response, {
        id: uuidv4(),
        type: "abort",
        textResponse: null,
        close: true,
        error: e.message,
      });
      response.end();
    }
  });

  // TODO: middleware
  app.get("/embed/:embedId/:sessionId", async (request, response) => {
    try {
      const { embedId, sessionId } = request.params;
      const embed = await EmbedConfig.get({ uuid: embedId });
      if (!embed) {
        response.sendStatus(400).end();
        return;
      }

      const history = await EmbedChats.forEmbedByUser(embed.id, sessionId);
      response.status(200).json({
        history: convertToChatHistory(history),
      });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { embeddedEndpoints };

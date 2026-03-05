const { v4: uuidv4 } = require("uuid");
const { reqBody, multiUserMode } = require("../../utils/http");
const { Telemetry } = require("../../models/telemetry");
const { streamChatWithForEmbed } = require("../../utils/chats/embed");
const { EmbedChats } = require("../../models/embedChats");
const {
  validEmbedConfig,
  canRespond,
  setConnectionMeta,
} = require("../../utils/middleware/embedMiddleware");
const { EmbedConfig } = require("../../models/embedConfig");
const {
  fetchEmbedLogo,
  determineEmbedLogoFilepath,
} = require("../../utils/files/embedLogo");
const {
  convertToChatHistory,
  writeResponseChunk,
} = require("../../utils/helpers/chat/responses");
const { getTTSProvider, isTTSConfigured } = require("../../utils/TextToSpeech");
const { getSTTProvider, isSTTConfigured } = require("../../utils/SpeechToText");
const multer = require("multer");

// Configure multer for audio file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept common audio formats
    const allowedMimes = [
      "audio/webm",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/mp4",
      "audio/m4a",
      "audio/ogg",
      "audio/flac",
      "audio/x-flac",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported audio format: ${file.mimetype}. Supported formats: webm, wav, mp3, mp4, m4a, ogg, flac`
        ),
        false
      );
    }
  },
});

function embeddedEndpoints(app) {
  if (!app) return;

  // Public endpoint: Get visual configuration for an embed widget
  app.get(
    "/embed/:embedId/config",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;
        const visualConfig = await EmbedConfig.getVisualConfig(embed.uuid);

        // Map simplified fields to widget data-attributes
        const mapped = {};
        if (visualConfig.accentColor) {
          mapped.buttonColor = visualConfig.accentColor;
          mapped.userBgColor = visualConfig.accentColor;
          mapped.linkColor = visualConfig.accentColor;
        }
        if (visualConfig.name) {
          mapped.brandText = visualConfig.name;
          mapped.assistantName = visualConfig.name;
        }
        if (visualConfig.chatIcon) mapped.chatIcon = visualConfig.chatIcon;
        if (visualConfig.position) mapped.position = visualConfig.position;
        if (visualConfig.greeting) mapped.greeting = visualConfig.greeting;
        if (visualConfig.sendMessageText) mapped.sendMessageText = visualConfig.sendMessageText;
        if (visualConfig.supportEmail) mapped.supportEmail = visualConfig.supportEmail;

        if (visualConfig.defaultMessages && visualConfig.defaultMessages.length > 0) {
          mapped.defaultMessages = visualConfig.defaultMessages.join(",");
        }
        if (visualConfig.chatbotBubblesMessages && visualConfig.chatbotBubblesMessages.length > 0) {
          mapped.chatbotBubblesMessages = visualConfig.chatbotBubblesMessages.join(",");
        }

        // Logo: serve from upload endpoint or use URL
        if (visualConfig.logoFilename) {
          const { embedId } = request.params;
          const baseUrl = `${request.protocol}://${request.get("host")}`;
          const logoUrl = `${baseUrl}/api/embed/${embedId}/logo`;
          mapped.brandImageUrl = logoUrl;
          mapped.assistantIcon = logoUrl;
        } else if (visualConfig.logoUrl) {
          mapped.brandImageUrl = visualConfig.logoUrl;
          mapped.assistantIcon = visualConfig.logoUrl;
        }

        response.setHeader("Cache-Control", "public, max-age=300");
        response.status(200).json(mapped);
      } catch (e) {
        console.error("[Embed Config]", e.message);
        response.status(200).json({});
      }
    }
  );

  // Public endpoint: Serve embed logo image
  app.get(
    "/embed/:embedId/logo",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;
        const logoPath = await determineEmbedLogoFilepath(embed.id);
        if (!logoPath) {
          response.sendStatus(404).end();
          return;
        }

        const { found, buffer, size, mime } = fetchEmbedLogo(logoPath);
        if (!found) {
          response.sendStatus(404).end();
          return;
        }

        response.writeHead(200, {
          "Content-Type": mime,
          "Content-Length": size,
          "Cache-Control": "public, max-age=3600",
        });
        response.end(buffer);
      } catch (e) {
        console.error("[Embed Logo]", e.message);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/embed/:embedId/stream-chat",
    [validEmbedConfig, setConnectionMeta, canRespond],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;
        const {
          sessionId,
          message,
          conversationId = null, // NEW: Conversation ID from widget
          // optional keys for override of defaults if enabled.
          prompt = null,
          model = null,
          temperature = null,
          username = null,
        } = reqBody(request);

        // Fallback: If no conversationId, use sessionId for backwards compatibility
        const effectiveConversationId = conversationId || sessionId;

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        await streamChatWithForEmbed(response, embed, message, sessionId, {
          conversationId: effectiveConversationId, // Pass conversation ID
          promptOverride: prompt,
          modelOverride: model,
          temperatureOverride: temperature,
          username,
        });
        await Telemetry.sendTelemetry("embed_sent_chat", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
        });
        response.end();
      } catch (e) {
        console.error(e);
        writeResponseChunk(response, {
          id: uuidv4(),
          type: "abort",
          sources: [],
          textResponse: null,
          close: true,
          error: e.message,
        });
        response.end();
      }
    }
  );

  // Endpoint to check if embed is enabled (for widget hide/show)
  app.get(
    "/embed/:embedId/status",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;
        response.status(200).json({ enabled: embed.enabled });
      } catch (e) {
        console.error(e.message, e);
        // On error, return enabled=true so widget still shows
        response.status(200).json({ enabled: true });
      }
    }
  );

  app.get(
    "/embed/:embedId/:sessionId",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const { sessionId } = request.params;
        const { conversationId } = request.query; // Optional query param for conversation_id
        const embed = response.locals.embedConfig;

        // Use conversationId if provided, otherwise fallback to sessionId
        const identifier = conversationId || sessionId;
        const identifierType = conversationId ? 'conversation_id' : 'session_id';

        const history = await EmbedChats.forEmbedByUser(
          embed.id,
          identifier,
          null,
          null,
          identifierType
        );

        response.status(200).json({ history: convertToChatHistory(history) });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/embed/:embedId/:sessionId",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const { sessionId } = request.params;
        const { conversationId } = request.query; // Optional query param for conversation_id
        const embed = response.locals.embedConfig;

        // Use conversationId if provided, otherwise fallback to sessionId
        const identifier = conversationId || sessionId;
        const identifierType = conversationId ? 'conversation_id' : 'session_id';

        await EmbedChats.markHistoryInvalid(embed.id, identifier, identifierType);
        response.status(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // ============================================
  // Audio Endpoints for Embed Widget (STT/TTS)
  // ============================================

  /**
   * GET /embed/:embedId/audio/status
   * Returns whether STT and TTS are configured on the server
   */
  app.get(
    "/embed/:embedId/audio/status",
    [validEmbedConfig],
    async (request, response) => {
      try {
        response.status(200).json({
          stt: isSTTConfigured(),
          tts: isTTSConfigured(),
          sttProvider: process.env.STT_PROVIDER || "native",
          ttsProvider: process.env.TTS_PROVIDER || "native",
        });
      } catch (e) {
        console.error("[Embed Audio Status]", e.message);
        response.status(200).json({ stt: false, tts: false });
      }
    }
  );

  /**
   * POST /embed/:embedId/audio/tts
   * Converts text to speech using the configured TTS provider
   *
   * Request body: { text: "Text to speak" }
   * Response: Audio buffer (audio/mpeg)
   */
  app.post(
    "/embed/:embedId/audio/tts",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const { text } = reqBody(request);

        if (!text || typeof text !== "string" || text.trim().length === 0) {
          return response.status(400).json({
            success: false,
            error: "No text provided for TTS.",
          });
        }

        if (!isTTSConfigured()) {
          return response.status(400).json({
            success: false,
            error: "TTS is not configured on this server.",
          });
        }

        const TTSProvider = getTTSProvider();
        if (!TTSProvider) {
          return response.status(500).json({
            success: false,
            error: "Failed to initialize TTS provider.",
          });
        }

        const audioBuffer = await TTSProvider.ttsBuffer(text);
        if (!audioBuffer) {
          return response.status(204).end(); // No content
        }

        // Detect audio format from buffer header
        let contentType = "audio/mpeg"; // default
        if (audioBuffer.length >= 4) {
          const header = audioBuffer.slice(0, 4).toString("hex");
          if (header.startsWith("52494646")) {
            // "RIFF" = WAV
            contentType = "audio/wav";
          } else if (header.startsWith("4f676753")) {
            // "OggS" = OGG
            contentType = "audio/ogg";
          } else if (header.startsWith("664c6143")) {
            // "fLaC" = FLAC
            contentType = "audio/flac";
          }
          // MP3 starts with FF FB, FF FA, FF F3, or ID3
        }

        response.writeHead(200, {
          "Content-Type": contentType,
          "Content-Length": audioBuffer.length,
        });
        response.end(audioBuffer);
      } catch (e) {
        console.error("[Embed TTS]", e.message);
        response.status(500).json({
          success: false,
          error: "TTS generation failed.",
        });
      }
    }
  );

  /**
   * POST /embed/:embedId/audio/tts-stream
   * Streams TTS audio as chunks for reduced latency
   *
   * Request body: { text: "Text to speak" }
   * Response: Streaming audio (chunked transfer encoding)
   */
  app.post(
    "/embed/:embedId/audio/tts-stream",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const { text } = reqBody(request);

        if (!text || typeof text !== "string" || text.trim().length === 0) {
          return response.status(400).json({
            success: false,
            error: "No text provided for TTS.",
          });
        }

        if (!isTTSConfigured()) {
          return response.status(400).json({
            success: false,
            error: "TTS is not configured on this server.",
          });
        }

        const TTSProvider = getTTSProvider();
        if (!TTSProvider) {
          return response.status(500).json({
            success: false,
            error: "Failed to initialize TTS provider.",
          });
        }

        // Check if provider supports streaming
        if (typeof TTSProvider.ttsStream === 'function') {
          // Get requested format from query param (mp3 default, webm for Firefox)
          const format = request.query.format === 'webm' ? 'webm' : 'mp3';
          const contentType = format === 'webm' ? 'audio/webm' : 'audio/mpeg';

          response.writeHead(200, {
            "Content-Type": contentType,
            "Transfer-Encoding": "chunked",
            "Cache-Control": "no-cache",
          });

          await TTSProvider.ttsStream(text, response, format);
          response.end();
        } else {
          // Fallback to non-streaming
          const audioBuffer = await TTSProvider.ttsBuffer(text);
          if (!audioBuffer) {
            return response.status(204).end();
          }

          response.writeHead(200, {
            "Content-Type": "audio/wav",
          });
          response.end(audioBuffer);
        }
      } catch (e) {
        console.error("[Embed TTS Stream]", e.message);
        if (!response.headersSent) {
          response.status(500).json({
            success: false,
            error: "TTS streaming failed.",
          });
        }
      }
    }
  );

  /**
   * POST /embed/:embedId/audio/stt
   * Transcribes audio to text using the configured STT provider
   *
   * Request: multipart/form-data with 'file' field containing audio
   * Optional query param: language (e.g., 'de', 'en')
   * Response: { success: true, text: "transcribed text" }
   */
  app.post(
    "/embed/:embedId/audio/stt",
    [validEmbedConfig, upload.single("file")],
    async (request, response) => {
      try {
        if (!isSTTConfigured()) {
          return response.status(400).json({
            success: false,
            error: "STT is not configured on this server.",
          });
        }

        if (!request.file) {
          return response.status(400).json({
            success: false,
            error: "No audio file provided.",
          });
        }

        const sttProvider = getSTTProvider();
        if (!sttProvider) {
          return response.status(500).json({
            success: false,
            error: "Failed to initialize STT provider.",
          });
        }

        // Get optional language hint from query params
        const language = request.query.language || null;

        // Derive filename from mimetype for proper content-type handling
        const mimeToExt = {
          "audio/webm": "webm",
          "audio/wav": "wav",
          "audio/wave": "wav",
          "audio/mpeg": "mp3",
          "audio/mp3": "mp3",
          "audio/mp4": "mp4",
          "audio/m4a": "m4a",
          "audio/ogg": "ogg",
          "audio/flac": "flac",
        };
        const ext = mimeToExt[request.file.mimetype] || "webm";
        const filename = `recording.${ext}`;

        console.log("[Embed STT] Processing audio:", {
          originalName: request.file.originalname,
          mimetype: request.file.mimetype,
          size: request.file.buffer?.length,
          filename,
        });

        // Transcribe the audio
        const result = await sttProvider.transcribe(request.file.buffer, {
          language,
          filename,
        });

        const text = result?.text || "";

        response.status(200).json({
          success: true,
          text: text.trim(),
        });
      } catch (e) {
        console.error("[Embed STT]", e.message);
        response.status(500).json({
          success: false,
          error: "Transcription failed.",
        });
      }
    }
  );
}

module.exports = { embeddedEndpoints };

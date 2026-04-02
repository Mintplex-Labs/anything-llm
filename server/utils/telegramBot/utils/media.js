/**
 * Download a file from Telegram by file ID.
 * @param {TelegramBot} bot
 * @param {string} fileId
 * @returns {Promise<Buffer>}
 */
async function downloadTelegramFile(bot, fileId) {
  const fileLink = await bot.getFileLink(fileId);
  const response = await fetch(fileLink);
  if (!response.ok) throw new Error("Failed to download file from Telegram");
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Get appropriate file extension from MIME type.
 * @param {string} mimeType
 * @returns {string}
 */
function getExtensionFromMime(mimeType) {
  const mimeToExt = {
    "audio/ogg": ".ogg",
    "audio/oga": ".ogg",
    "audio/opus": ".opus",
    "audio/mp3": ".mp3",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/mp4": ".m4a",
    "audio/m4a": ".m4a",
    "audio/webm": ".webm",
    "audio/flac": ".flac",
  };
  return mimeToExt[mimeType] || ".ogg"; // Default to .ogg for unknown (common for Telegram mobile)
}

/**
 * Transcribe an audio buffer using the configured whisper provider.
 * Writes the audio to the collector hotdir and runs it through the
 * same parse pipeline used for document processing.
 * @param {Buffer} audioBuffer
 * @param {string} [mimeType] - The MIME type of the audio (e.g., "audio/ogg")
 * @returns {Promise<string>}
 */
async function transcribeAudio(audioBuffer, mimeType = "audio/ogg") {
  const fs = require("fs");
  const path = require("path");
  const { CollectorApi } = require("../../collectorApi");
  const { hotdirPath } = require("../../files");

  if (!fs.existsSync(hotdirPath)) fs.mkdirSync(hotdirPath, { recursive: true });

  const ext = getExtensionFromMime(mimeType);
  const filename = `telegram-voice-${Date.now()}${ext}`;
  fs.writeFileSync(path.join(hotdirPath, filename), audioBuffer);

  const collector = new CollectorApi();
  const result = await collector.parseDocument(filename);
  if (!result?.success || !result.documents?.length) {
    throw new Error(result?.reason || "Failed to transcribe audio.");
  }
  return result.documents[0].pageContent;
}

/**
 * Parse a document buffer and extract its text content.
 * Writes the document to the collector hotdir and runs it through
 * the collector's parse pipeline.
 * @param {Buffer} documentBuffer
 * @param {string} originalFilename - The original filename with extension
 * @returns {Promise<{text: string, filename: string}>}
 */
async function documentToText(documentBuffer, originalFilename) {
  const fs = require("fs");
  const path = require("path");
  const { CollectorApi } = require("../../collectorApi");
  const { hotdirPath } = require("../../files");

  if (!fs.existsSync(hotdirPath)) fs.mkdirSync(hotdirPath, { recursive: true });

  const sanitizedName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `telegram-doc-${Date.now()}-${sanitizedName}`;
  fs.writeFileSync(path.join(hotdirPath, filename), documentBuffer);

  const collector = new CollectorApi();
  if (!(await collector.online())) {
    throw new Error(
      "Document processing is unavailable. The collector service is offline."
    );
  }

  const result = await collector.parseDocument(filename);
  if (!result?.success || !result.documents?.length) {
    throw new Error(
      result?.reason || `Failed to parse document: ${originalFilename}`
    );
  }

  const text = result.documents.map((doc) => doc.pageContent).join("\n\n");
  return { text, filename: originalFilename };
}

/**
 * Download the largest photo from a Telegram photo array and return
 * it as an attachment object compatible with the LLM chat pipeline.
 * @param {TelegramBot} bot
 * @param {Array} photos - Telegram PhotoSize array (ascending size)
 * @returns {Promise<{name: string, mime: string, contentString: string}>}
 */
async function photoToAttachment(bot, photos) {
  const largest = photos[photos.length - 1];
  const buffer = await downloadTelegramFile(bot, largest.file_id);
  const base64 = buffer.toString("base64");
  return {
    name: "telegram-photo.jpg",
    mime: "image/jpeg",
    contentString: `data:image/jpeg;base64,${base64}`,
  };
}

/**
 * Convert text to speech and send as an audio message in Telegram.
 * Silently does nothing if TTS is not configured.
 * @param {TelegramBot} bot
 * @param {number} chatId
 * @param {string} text
 */
/**
 * @returns {Promise<boolean>} true if voice was sent, false if TTS failed
 */
async function sendVoiceResponse(bot, chatId, text) {
  try {
    const { getTTSProvider } = require("../../TextToSpeech");
    const provider = getTTSProvider();
    const buffer = await provider.ttsBuffer(text);
    if (!buffer) return false;
    await bot.sendAudio(
      chatId,
      buffer,
      {},
      {
        filename: `${chatId}-response.mp3`,
        contentType: "audio/mpeg",
      }
    );
    return true;
  } catch {
    await bot
      .sendMessage(
        chatId,
        "Voice responses require a text-to-speech provider. Set one up in Settings > Voice & Speech > Text-to-Speech Preference."
      )
      .catch(() => {});
    return false;
  }
}

module.exports = {
  downloadTelegramFile,
  transcribeAudio,
  documentToText,
  photoToAttachment,
  sendVoiceResponse,
};

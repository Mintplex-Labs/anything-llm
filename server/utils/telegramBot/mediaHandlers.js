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
 * Transcribe an audio buffer using the configured whisper provider.
 * Writes the audio to the collector hotdir and runs it through the
 * same parse pipeline used for document processing.
 * @param {Buffer} audioBuffer
 * @returns {Promise<string>}
 */
async function transcribeAudio(audioBuffer) {
  const fs = require("fs");
  const path = require("path");
  const { CollectorApi } = require("../collectorApi");
  const { hotdirPath } = require("../files");

  if (!fs.existsSync(hotdirPath)) fs.mkdirSync(hotdirPath, { recursive: true });

  const filename = `telegram-voice-${Date.now()}.wav`;
  fs.writeFileSync(path.join(hotdirPath, filename), audioBuffer);

  const collector = new CollectorApi();
  const result = await collector.parseDocument(filename);
  if (!result?.success || !result.documents?.length) {
    throw new Error(result?.reason || "Failed to transcribe audio.");
  }
  return result.documents[0].pageContent;
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
 * @returns {boolean} true if voice was sent, false if TTS failed
 */
async function sendVoiceResponse(bot, chatId, text) {
  try {
    const { getTTSProvider } = require("../TextToSpeech");
    const provider = getTTSProvider();
    const buffer = await provider.ttsBuffer(text);
    if (!buffer) return false;
    await bot.sendAudio(
      chatId,
      buffer,
      {},
      {
        filename: "response.mp3",
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
  photoToAttachment,
  sendVoiceResponse,
};

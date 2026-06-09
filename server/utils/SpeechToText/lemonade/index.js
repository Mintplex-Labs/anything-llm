const path = require("path");
const { parseLemonadeServerEndpoint } = require("../../AiProviders/lemonade");
const { convertAudioBufferToWav } = require("../helpers");

class LemonadeSTT {
  constructor() {
    if (!process.env.STT_LEMONADE_BASE_PATH)
      throw new Error("No Lemonade base path was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: parseLemonadeServerEndpoint(
        process.env.STT_LEMONADE_BASE_PATH,
        "openai"
      ),
      apiKey: process.env.LEMONADE_LLM_API_KEY || null,
    });
    this.model = process.env.STT_LEMONADE_MODEL_PREF ?? "whisper-1";
    this.#log(
      `Service (${process.env.STT_LEMONADE_BASE_PATH}) with model: ${this.model}`
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[LemonadeSTT]\x1b[0m ${text}`, ...args);
  }

  /**
   * Transcribes an audio buffer to text using the Lemonade STT service.
   * Whisper backends behind Lemonade reject webm/opus, so any non-wav input
   * is converted to 16kHz mono WAV via the collector before being forwarded.
   * @param {Buffer} audioBuffer - The audio buffer to be transcribed.
   * @param {string} filename - Original filename, used to hint the audio container/codec to the service.
   * @returns {Promise<string>} The transcribed text.
   */
  async transcribe(audioBuffer, filename = "audio.webm") {
    const { toFile } = require("openai");
    const extension = path.extname(filename).toLowerCase() || ".webm";
    let payloadBuffer = audioBuffer;
    let payloadFilename = filename;
    if (extension !== ".wav") {
      payloadBuffer = await convertAudioBufferToWav(audioBuffer, extension);
      payloadFilename = "audio.wav";
    }
    const file = await toFile(payloadBuffer, payloadFilename);
    const result = await this.openai.audio.transcriptions.create({
      file,
      model: this.model,
    });
    return result?.text ?? "";
  }
}

module.exports = { LemonadeSTT };

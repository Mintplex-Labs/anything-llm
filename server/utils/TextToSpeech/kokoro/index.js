class KokoroTTS {
  constructor() {
    if (!process.env.TTS_KOKORO_ENDPOINT)
      throw new Error(
        "No Kokoro endpoint was set. Please set TTS_KOKORO_ENDPOINT to the base URL of your kokoro-fastapi server (e.g. http://localhost:8880/v1)."
      );

    const endpoint = new URL(process.env.TTS_KOKORO_ENDPOINT);
    if (!endpoint.pathname.endsWith("/v1")) endpoint.pathname = "/v1";
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      apiKey: process.env.TTS_KOKORO_KEY || null,
      baseURL: endpoint.toString(),
    });

    this.model = "kokoro";
    this.voice = process.env.TTS_KOKORO_VOICE_MODEL ?? "af_bella";
    this.#log(
      `Service (${process.env.TTS_KOKORO_ENDPOINT}) with voice: ${this.voice}`
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[KokoroTTS]\x1b[0m ${text}`, ...args);
  }

  /**
   * Generates a buffer from the given text input using a kokoro-fastapi server
   * via its OpenAI-compatible /audio/speech endpoint.
   * @param {string} textInput - The text to be converted to audio.
   * @returns {Promise<Buffer>} A buffer containing the audio data.
   */
  async ttsBuffer(textInput) {
    try {
      const result = await this.openai.audio.speech.create({
        model: this.model,
        voice: this.voice,
        input: textInput,
      });
      return Buffer.from(await result.arrayBuffer());
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

module.exports = {
  KokoroTTS,
};

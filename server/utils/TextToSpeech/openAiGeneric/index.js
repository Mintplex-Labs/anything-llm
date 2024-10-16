class GenericOpenAiTTS {
  constructor() {
    if (!process.env.TTS_OPEN_AI_COMPATIBLE_KEY)
      this.#log(
        "No OpenAI compatible API key was set. You might need to set this to use your OpenAI compatible TTS service."
      );
    if (!process.env.TTS_OPEN_AI_COMPATIBLE_VOICE_MODEL)
      this.#log(
        "No OpenAI compatible voice model was set. We will use the default voice model 'alloy'. This may not exist for your selected endpoint."
      );
    if (!process.env.TTS_OPEN_AI_COMPATIBLE_ENDPOINT)
      throw new Error(
        "No OpenAI compatible endpoint was set. Please set this to use your OpenAI compatible TTS service."
      );

    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      apiKey: process.env.TTS_OPEN_AI_COMPATIBLE_KEY || null,
      baseURL: process.env.TTS_OPEN_AI_COMPATIBLE_ENDPOINT,
    });
    this.voice = process.env.TTS_OPEN_AI_COMPATIBLE_VOICE_MODEL ?? "alloy";
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[OpenAiGenericTTS]\x1b[0m ${text}`, ...args);
  }

  /**
   * Generates a buffer from the given text input using the OpenAI compatible TTS service.
   * @param {string} textInput - The text to be converted to audio.
   * @returns {Promise<Buffer>} A buffer containing the audio data.
   */
  async ttsBuffer(textInput) {
    try {
      const result = await this.openai.audio.speech.create({
        model: "tts-1",
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
  GenericOpenAiTTS,
};

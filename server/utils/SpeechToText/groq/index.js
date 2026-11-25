class GroqSTT {
  constructor() {
    if (!process.env.STT_GROQ_API_KEY)
      throw new Error("No Groq API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.STT_GROQ_API_KEY,
    });
    this.model = process.env.STT_GROQ_MODEL ?? "whisper-large-v3-turbo";
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[GroqSTT]\x1b[0m ${text}`, ...args);
  }

  /**
   * Transcribes an audio buffer to text using the Groq STT service.
   * @param {Buffer} audioBuffer - The audio buffer to be transcribed.
   * @param {string} filename - Original filename, used to hint the audio container/codec to Groq.
   * @returns {Promise<string>} The transcribed text.
   */
  async transcribe(audioBuffer, filename = "audio.webm") {
    const { toFile } = require("openai");
    this.#log(`Transcribing audio buffer to text using model: ${this.model}`);
    const file = await toFile(audioBuffer, filename);
    const result = await this.openai.audio.transcriptions.create({
      file,
      model: this.model,
    });
    return result?.text ?? "";
  }
}

module.exports = { GroqSTT };

class OpenAiTTS {
  constructor() {
    if (!process.env.TTS_OPEN_AI_KEY)
      throw new Error("No OpenAI API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      apiKey: process.env.TTS_OPEN_AI_KEY,
    });
    this.voice = process.env.TTS_OPEN_AI_VOICE_MODEL ?? "alloy";
  }

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
  OpenAiTTS,
};

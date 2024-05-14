function getTTSProvider() {
  const provider = process.env.TTS_PROVIDER || "openai";
  switch (provider) {
    case "openai":
      const { OpenAiTTS } = require("./openAi");
      return new OpenAiTTS();
    case "elevenlabs":
      const { ElevenLabsTTS } = require("./elevenLabs");
      return new ElevenLabsTTS();
    default:
      throw new Error("ENV: No TTS_PROVIDER value found in environment!");
  }
}

module.exports = { getTTSProvider };

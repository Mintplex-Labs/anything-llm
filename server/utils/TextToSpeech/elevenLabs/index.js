const { ElevenLabsClient, stream } = require("elevenlabs");

class ElevenLabsTTS {
  constructor() {
    if (!process.env.TTS_ELEVEN_LABS_KEY)
      throw new Error("No ElevenLabs API key was set.");
    this.elevenLabs = new ElevenLabsClient({
      apiKey: process.env.TTS_ELEVEN_LABS_KEY,
    });

    // Rachel as default voice
    // https://api.elevenlabs.io/v1/voices
    this.voiceId =
      process.env.TTS_ELEVEN_LABS_VOICE_MODEL ?? "21m00Tcm4TlvDq8ikWAM";
    this.modelId = "eleven_multilingual_v2";
  }

  static async voices(apiKey = null) {
    try {
      const client = new ElevenLabsClient({
        apiKey: apiKey ?? process.env.TTS_ELEVEN_LABS_KEY ?? null,
      });
      return (await client.voices.getAll())?.voices ?? [];
    } catch {}
    return [];
  }

  #stream2buffer(stream) {
    return new Promise((resolve, reject) => {
      const _buf = [];
      stream.on("data", (chunk) => _buf.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(_buf)));
      stream.on("error", (err) => reject(err));
    });
  }

  async ttsBuffer(textInput) {
    try {
      const audio = await this.elevenLabs.generate({
        voice: this.voiceId,
        text: textInput,
        model_id: "eleven_multilingual_v2",
      });
      return Buffer.from(await this.#stream2buffer(audio));
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

module.exports = {
  ElevenLabsTTS,
};

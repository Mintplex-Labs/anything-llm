class CambAiTTS {
  constructor() {
    if (!process.env.TTS_CAMB_AI_KEY)
      throw new Error("No CAMB AI API key was set.");

    this.apiKey = process.env.TTS_CAMB_AI_KEY;
    this.voiceId = process.env.TTS_CAMB_AI_VOICE_MODEL ?? null;
    this.speechModel = process.env.TTS_CAMB_AI_SPEECH_MODEL ?? "mars-flash";
    this.language = process.env.TTS_CAMB_AI_LANGUAGE ?? "en-us";
  }

  static async voices(apiKey = null) {
    try {
      const key = apiKey ?? process.env.TTS_CAMB_AI_KEY ?? null;
      const response = await fetch(
        "https://client.camb.ai/apis/list-voices",
        {
          headers: { "x-api-key": key },
        }
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data?.voices ?? [];
    } catch {}
    return [];
  }

  async ttsBuffer(textInput) {
    try {
      const response = await fetch(
        "https://client.camb.ai/apis/tts-stream",
        {
          method: "POST",
          headers: {
            "x-api-key": this.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: textInput,
            voice_id: Number(this.voiceId),
            language: this.language,
            speech_model: this.speechModel,
            output_configuration: { format: "mp3" },
          }),
        }
      );

      if (!response.ok) {
        console.error(
          `CambAiTTS: Failed to generate speech - ${response.status}`
        );
        return null;
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

module.exports = {
  CambAiTTS,
};

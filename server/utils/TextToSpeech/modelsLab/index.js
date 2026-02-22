const { default: fetch } = require("node-fetch");

// ModelsLab voice name → voice_id mapping
// Full list: https://docs.modelslab.com/text-to-audio/realtime/tts
const VOICE_MAP = {
  Bella: 1,
  Antoni: 2,
  Elli: 3,
  Josh: 4,
  Arnold: 5,
  Adam: 6,
  Sam: 7,
  Rachel: 8,
  Domi: 9,
  Gigi: 10,
};

const API_URL = "https://modelslab.com/api/v6/voice/text_to_speech";
const FETCH_URL = "https://modelslab.com/api/v6/voice/fetch/";

class ModelsLabTTS {
  constructor() {
    if (!process.env.TTS_MODELSLAB_KEY)
      throw new Error("No ModelsLab API key was set.");
    this.apiKey = process.env.TTS_MODELSLAB_KEY;
    this.voiceName = process.env.TTS_MODELSLAB_VOICE_MODEL ?? "Bella";
  }

  static voices() {
    return Object.keys(VOICE_MAP).map((name) => ({
      name,
      voice_id: VOICE_MAP[name],
    }));
  }

  async ttsBuffer(textInput) {
    try {
      const voiceId = VOICE_MAP[this.voiceName] ?? 1;

      // Enforce ModelsLab 2 500-character limit
      const text =
        textInput.length > 2500 ? textInput.slice(0, 2500) : textInput;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: this.apiKey,
          prompt: text,
          language: "English",
          voice_id: voiceId,
          audio_format: "mp3",
        }),
      });

      if (!response.ok)
        throw new Error(`ModelsLab TTS HTTP error: ${response.status}`);

      const data = await response.json();
      const audioUrl = await this._resolveAudioUrl(data);
      if (!audioUrl) throw new Error("ModelsLab TTS: no audio URL returned.");

      const audioResp = await fetch(audioUrl);
      if (!audioResp.ok)
        throw new Error(
          `ModelsLab TTS: failed to download audio (${audioResp.status})`
        );

      const arrayBuffer = await audioResp.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      console.error("[ModelsLabTTS] ttsBuffer error:", e.message);
    }
    return null;
  }

  async _resolveAudioUrl(data) {
    const { status } = data;

    if (status === "success") return this._extractUrl(data);

    if (status === "processing") {
      const requestId = data.id;
      if (!requestId) throw new Error("ModelsLab: processing but no id.");

      // Poll for up to 5 minutes (60 × 5 s)
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const fetchResp = await fetch(`${FETCH_URL}${requestId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: this.apiKey }),
        });
        if (!fetchResp.ok) continue;
        const fetchData = await fetchResp.json();
        if (fetchData.status === "success") return this._extractUrl(fetchData);
        if (fetchData.status !== "processing") {
          console.error("[ModelsLabTTS] Unexpected fetch status:", fetchData);
          break;
        }
      }
      throw new Error("ModelsLab TTS timed out waiting for audio.");
    }

    throw new Error(`ModelsLab TTS API error: ${JSON.stringify(data)}`);
  }

  _extractUrl(data) {
    const output = data.output ?? data.output_url;
    if (!output) return null;
    return Array.isArray(output) ? output[0] : output;
  }
}

module.exports = { ModelsLabTTS };

class DeepgramTTS {
  constructor() {
    if (!process.env.TTS_DEEPGRAM_API_KEY)
      throw new Error("No Deepgram API key was set.");
    this.apiKey = process.env.TTS_DEEPGRAM_API_KEY;
    // Default to aura-asteria-en if no model is set
    this.model = process.env.TTS_DEEPGRAM_MODEL ?? "aura-asteria-en";
  }

  /**
   * Fetches all available TTS voice models from Deepgram.
   * @param {string|null} apiKey - Optional API key override.
   * @returns {Promise<Array<{voice_id: string, name: string, category: string}>>}
   */
  static async voices(apiKey = null) {
    try {
      const key = apiKey ?? process.env.TTS_DEEPGRAM_API_KEY ?? null;
      if (!key) return [];

      const res = await fetch("https://api.deepgram.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Token ${key}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(
          `Deepgram:voices - Failed to fetch models: ${res.status}`
        );
        return [];
      }

      const data = await res.json();
      const ttsModels = data?.tts ?? [];

      // Normalize to the shape AnythingLLM expects for voice selection
      return ttsModels.map((model) => ({
        voice_id: model.canonical_name ?? model.model_id ?? model.name,
        name: model.name ?? model.canonical_name ?? "Unknown",
        category: model.metadata?.accent ?? "deepgram",
      }));
    } catch (e) {
      console.error(`Deepgram:voices`, e.message);
    }
    return [];
  }

  /**
   * Generates a TTS audio buffer from the given text input.
   * Uses the Deepgram REST API endpoint POST /v1/speak.
   * @param {string} textInput - The text to convert to speech.
   * @returns {Promise<Buffer|null>} A buffer containing the mp3 audio data.
   */
  async ttsBuffer(textInput) {
    try {
      const url = new URL("https://api.deepgram.com/v1/speak");
      url.searchParams.set("model", this.model);
      url.searchParams.set("encoding", "mp3");

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput }),
      });

      if (!res.ok) {
        console.error(
          `Deepgram:ttsBuffer - Request failed with status ${res.status}`
        );
        return null;
      }

      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

module.exports = {
  DeepgramTTS,
};

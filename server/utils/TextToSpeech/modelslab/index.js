class ModelsLabTTS {
  static VOICES = [
    "en_us_001",
    "en_us_006",
    "en_us_007",
    "en_us_009",
    "en_us_010",
    "en_uk_001",
    "en_uk_003",
    "en_au_001",
    "en_au_002",
  ];

  static DEFAULT_VOICE = "en_us_001";

  constructor() {
    if (!process.env.TTS_MODELSLAB_API_KEY)
      throw new Error("No ModelsLab API key was set for TTS.");
    this.apiKey = process.env.TTS_MODELSLAB_API_KEY;
    this.voice = process.env.TTS_MODELSLAB_VOICE_ID ?? ModelsLabTTS.DEFAULT_VOICE;
    this.language = process.env.TTS_MODELSLAB_LANGUAGE ?? "english";
    this.speed = parseFloat(process.env.TTS_MODELSLAB_SPEED ?? "1");
    this.#log(`Initialized with voice: ${this.voice}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[ModelsLabTTS]\x1b[0m ${text}`, ...args);
  }

  /**
   * Fetches a URL and returns the response body as a Buffer.
   * @param {string} url
   * @returns {Promise<Buffer>}
   */
  async #fetchUrl(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Polls the ModelsLab fetch endpoint until the audio is ready.
   * Uses exponential backoff for better performance.
   * @param {string|number} requestId
   * @param {number} maxAttempts
   * @returns {Promise<Buffer|null>}
   */
  async #pollForResult(requestId, maxAttempts = 20) {
    const fetchUrl = "https://modelslab.com/api/v6/voice/fetch";
    let delayMs = 1000; // Start with 1 second
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, delayMs));
      
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: this.apiKey, request_id: String(requestId) }),
      });
      
      const data = await response.json();
      
      if (data.status === "success" && data.output?.length > 0) {
        return await this.#fetchUrl(data.output[0]);
      }
      
      if (data.status === "error") {
        this.#log("Poll error:", data.message || data.messege || "Unknown error");
        return null;
      }
      
      this.#log(`Polling attempt ${attempt + 1}/${maxAttempts}...`);
      
      // Exponential backoff: 1s, 2s, 3s, 4s... up to 5s max
      delayMs = Math.min(delayMs + 1000, 5000);
    }
    
    this.#log("Timed out waiting for audio generation.");
    return null;
  }

  /**
   * Generates a buffer from the given text input using the ModelsLab TTS API.
   * @param {string} textInput - The text to be converted to audio.
   * @returns {Promise<Buffer|null>} A buffer containing the audio data.
   */
  async ttsBuffer(textInput) {
    try {
      const response = await fetch(
        "https://modelslab.com/api/v6/voice/text_to_speech",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: this.apiKey,
            prompt: textInput,
            voice_id: this.voice,
            language: this.language,
            speed: this.speed,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.output?.length > 0) {
        return await this.#fetchUrl(data.output[0]);
      }

      if (data.status === "processing" && data.id) {
        this.#log(`Processing... polling for request ID: ${data.id}`);
        return await this.#pollForResult(data.id);
      }

      this.#log("Unexpected response:", JSON.stringify(data));
      return null;
    } catch (e) {
      console.error("[ModelsLabTTS] Error:", e);
      return null;
    }
  }
}

module.exports = { ModelsLabTTS };

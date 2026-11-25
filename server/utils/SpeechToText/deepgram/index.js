class DeepgramSTT {
  constructor() {
    if (!process.env.STT_DEEPGRAM_API_KEY)
      throw new Error("No Deepgram API key was set.");

    this.apiKey = process.env.STT_DEEPGRAM_API_KEY;
    this.model = process.env.STT_DEEPGRAM_MODEL ?? "nova-3";
    this.endpoint = "https://api.deepgram.com/v1/listen";
    this.#log(`Service ready with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[DeepgramSTT]\x1b[0m ${text}`, ...args);
  }

  // Map common audio file extensions to a Content-Type that Deepgram accepts.
  // Deepgram auto-detects most containers from the bytes but a hint is best.
  #contentTypeFromFilename(filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "wav":
        return "audio/wav";
      case "mp3":
        return "audio/mpeg";
      case "ogg":
      case "oga":
        return "audio/ogg";
      case "m4a":
      case "mp4":
        return "audio/mp4";
      case "flac":
        return "audio/flac";
      case "webm":
      default:
        return "audio/webm";
    }
  }

  /**
   * Transcribes an audio buffer to text using the Deepgram pre-recorded REST API.
   * @param {Buffer} audioBuffer - The audio buffer to be transcribed.
   * @param {string} filename - Original filename, used to hint the audio container/codec to Deepgram.
   * @returns {Promise<string>} The transcribed text.
   */
  async transcribe(audioBuffer, filename = "audio.webm") {
    const url = new URL(this.endpoint);
    url.searchParams.set("model", this.model);
    url.searchParams.set("smart_format", "true");

    return await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": this.#contentTypeFromFilename(filename),
      },
      body: audioBuffer,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errBody = await response.text().catch(() => "");
          throw new Error(
            `Deepgram transcription failed (${response.status}) - ${errBody}`
          );
        }
        return response.json();
      })
      .then((result) => {
        return (
          result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? ""
        );
      })
      .catch((error) => {
        this.#log(`Deepgram transcription failed - ${error.message}`);
        throw new Error(`Deepgram transcription failed - ${error.message}`);
      });
  }
}

module.exports = { DeepgramSTT };

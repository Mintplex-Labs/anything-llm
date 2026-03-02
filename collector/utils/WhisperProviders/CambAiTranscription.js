const fs = require("fs");
const path = require("path");

class CambAiTranscription {
  constructor({ options }) {
    if (!options.cambAiTranscriptionKey)
      throw new Error("No CAMB AI Transcription API key was set.");

    this.apiKey = options.cambAiTranscriptionKey;
    this.#log("Initialized.");
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[CambAiTranscription]\x1b[0m ${text}`, ...args);
  }

  async processFile(fullFilePath) {
    try {
      // Step 1: Upload file for transcription
      const fileBuffer = fs.readFileSync(fullFilePath);
      const fileName = path.basename(fullFilePath);
      const file = new File([fileBuffer], fileName);

      const formData = new FormData();
      formData.append("media_file", file);
      formData.append("language", "1"); // 1 = English

      const uploadResponse = await fetch(
        "https://client.camb.ai/apis/transcribe",
        {
          method: "POST",
          headers: { "x-api-key": this.apiKey },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        this.#log(`Upload failed: ${uploadResponse.status} - ${errorText}`);
        return { content: "", error: `Upload failed: ${uploadResponse.status}` };
      }

      const { task_id } = await uploadResponse.json();
      if (!task_id) {
        return { content: "", error: "No task_id returned from transcription API." };
      }

      this.#log(`Transcription task created: ${task_id}`);

      // Step 2: Poll for completion
      let status = "PENDING";
      let runId = null;
      const maxAttempts = 60; // 10 minutes max (60 * 10s)
      let attempts = 0;

      while (status === "PENDING" && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        attempts++;

        const pollResponse = await fetch(
          `https://client.camb.ai/apis/transcribe/${task_id}`,
          {
            headers: { "x-api-key": this.apiKey },
          }
        );

        if (!pollResponse.ok) {
          this.#log(`Poll failed: ${pollResponse.status}`);
          continue;
        }

        const pollData = await pollResponse.json();
        status = pollData.status;
        runId = pollData.run_id;

        this.#log(`Poll attempt ${attempts}: status=${status}`);
      }

      if (status !== "SUCCESS" || !runId) {
        return {
          content: "",
          error: `Transcription failed with status: ${status}`,
        };
      }

      // Step 3: Fetch transcription result
      const resultResponse = await fetch(
        `https://client.camb.ai/apis/transcription-result/${runId}?format_type=txt&data_type=json`,
        {
          headers: { "x-api-key": this.apiKey },
        }
      );

      if (!resultResponse.ok) {
        return {
          content: "",
          error: `Failed to fetch transcription result: ${resultResponse.status}`,
        };
      }

      const resultData = await resultResponse.json();
      const segments = resultData?.segments ?? [];
      const transcribedText = segments.map((seg) => seg.text).join(" ").trim();

      if (!transcribedText) {
        return {
          content: "",
          error: "No content was able to be transcribed.",
        };
      }

      this.#log(`Transcription complete: ${transcribedText.length} characters`);
      return { content: transcribedText, error: null };
    } catch (error) {
      this.#log(`Could not transcribe file`, error.message);
      return { content: "", error: error.message };
    }
  }
}

module.exports = {
  CambAiTranscription,
};

const fs = require("fs");

class OpenAiWhisper {
  constructor({ options }) {
    const { Configuration, OpenAIApi } = require("openai");
    if (!options.openAiKey) throw new Error("No OpenAI API key was set.");

    const config = new Configuration({
      apiKey: options.openAiKey,
    });
    this.openai = new OpenAIApi(config);
    this.model = "whisper-1";
    this.temperature = 0;
    this.#log("Initialized.");
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[OpenAiWhisper]\x1b[0m ${text}`, ...args);
  }

  async processFile(fullFilePath) {
    return await this.openai
      .createTranscription(
        fs.createReadStream(fullFilePath),
        this.model,
        undefined,
        "text",
        this.temperature
      )
      .then((res) => {
        if (res.hasOwnProperty("data"))
          return { content: res.data, error: null };
        return { content: "", error: "No content was able to be transcribed." };
      })
      .catch((e) => {
        this.#log(`Could not get any response from openai whisper`, e.message);
        return { content: "", error: e.message };
      });
  }
}

module.exports = {
  OpenAiWhisper,
};

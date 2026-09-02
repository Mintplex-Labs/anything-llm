const { imageToDataUrl, DESCRIPTION_PROMPT } = require("./utils");

class OpenAiVision {
  constructor({ options }) {
    const { OpenAI: OpenAIApi } = require("openai");
    if (!options.openAiKey) throw new Error("No OpenAI API key was set.");

    this.openai = new OpenAIApi({
      apiKey: options.openAiKey,
    });
    this.model = "gpt-4o-mini";
    this.temperature = 0;
    this.#log("Initialized.");
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[OpenAiVision]\x1b[0m ${text}`, ...args);
  }

  async describeImage(fullFilePath) {
    const dataUrl = imageToDataUrl(fullFilePath);
    if (!dataUrl)
      return { content: "", error: "Image could not be read from disk." };

    return await this.openai.chat.completions
      .create({
        model: this.model,
        temperature: this.temperature,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: DESCRIPTION_PROMPT },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      })
      .then((response) => {
        const content = response?.choices?.[0]?.message?.content;
        if (!content)
          return { content: "", error: "No description was returned." };
        return { content: content.trim(), error: null };
      })
      .catch((error) => {
        this.#log(
          `Could not get any response from openai vision`,
          error.message
        );
        return { content: "", error: error.message };
      });
  }
}

module.exports = {
  OpenAiVision,
};

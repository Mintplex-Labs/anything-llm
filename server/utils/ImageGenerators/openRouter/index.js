const { BaseImageGenerator } = require("../base");

class OpenRouterImageGenerator extends BaseImageGenerator {
  _extractImageBuffer(dataUrl) {
    if (!dataUrl) throw new Error("OpenRouter returned no image data.");
    return Buffer.from(dataUrl.split(",").pop(), "base64");
  }

  constructor() {
    if (!process.env.IMAGE_GEN_OPENROUTER_API_KEY)
      throw new Error("No OpenRouter image generation API key was set.");
    if (!process.env.IMAGE_GEN_MODEL_PREF)
      throw new Error("No OpenRouter image generation model was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    super({
      client: new OpenAIApi({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.IMAGE_GEN_OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": "https://anythingllm.com",
          "X-Title": "AnythingLLM",
        },
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF,
      className: "OpenRouterImageGenerator",
    });
  }

  // OpenRouter does not expose /images/generations. Its image models return
  // images through chat completions with the "image" output modality, where the
  // image comes back as a base64 data URL in `message.images`.
  // IMAGE_GEN_SIZE_PREF is intentionally not used here — the chat completions
  // endpoint has no size parameter; dimensions are model-determined.
  async generateImage({ prompt, signal }) {
    this.log(`Generating image with ${this.model}.`);
    const completion = await this.client.chat.completions.create(
      {
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      },
      { signal: signal ?? undefined }
    );

    const dataUrl =
      completion?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return { buffer: this._extractImageBuffer(dataUrl) };
  }

  async editImage({ prompt, images, signal }) {
    this.log(
      `Editing image with ${this.model} (${images.length} reference(s)).`
    );
    const content = [
      ...images.map((buf) => ({
        type: "image_url",
        image_url: {
          url: `data:image/png;base64,${buf.toString("base64")}`,
        },
      })),
      { type: "text", text: prompt },
    ];

    const completion = await this.client.chat.completions.create(
      {
        model: this.model,
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      },
      { signal: signal ?? undefined }
    );

    const dataUrl =
      completion?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return { buffer: this._extractImageBuffer(dataUrl) };
  }
}

module.exports = { OpenRouterImageGenerator };

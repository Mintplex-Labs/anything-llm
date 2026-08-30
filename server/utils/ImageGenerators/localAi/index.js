const { BaseImageGenerator } = require("../base");

class LocalAiImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_LOCALAI_BASE_PATH)
      throw new Error("No LocalAI image generation base path was set.");
    if (!process.env.IMAGE_GEN_MODEL_PREF)
      throw new Error("No LocalAI image generation model was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    super({
      client: new OpenAIApi({
        baseURL: process.env.IMAGE_GEN_LOCALAI_BASE_PATH,
        apiKey: process.env.IMAGE_GEN_LOCALAI_API_KEY || null,
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF,
      className: "LocalAiImageGenerator",
    });
  }

  // LocalAI does not implement the OpenAI `/v1/images/edits` endpoint, but it
  // DOES support image editing through the same `/v1/images/generations`
  // endpoint used for generation: reference images are passed as `ref_images`,
  // an array of RAW base64 strings (no `data:` URI prefix). Two LocalAI
  // specifics make base64 the only reliable reference format:
  //   1. Non-public http(s) URLs (localhost/private IPs) are rejected by
  //      LocalAI's SSRF validation.
  //   2. A `data:image/...;base64,` prefixed string fails base64 decoding and
  //      the reference is SILENTLY dropped (no client-side error).
  // Verified end-to-end against LocalAI v4.9.0 with flux.1-kontext-dev
  // (stablediffusion-ggml backend): the backend log shows `ref_images_count: 1`
  // and the returned image is an edit of the reference, not a fresh generation.
  async editImage({ prompt, images, size, signal }) {
    const imageSize =
      size || process.env.IMAGE_GEN_SIZE_PREF || "1024x1024";
    this.log(
      `Editing image with ${this.model} (${images.length} reference(s)) via ref_images.`
    );

    const baseURL = this.client.baseURL.replace(/\/+$/, "");
    const headers = { "Content-Type": "application/json" };
    if (this.client.apiKey)
      headers.Authorization = `Bearer ${this.client.apiKey}`;

    const res = await fetch(`${baseURL}/images/generations`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.model,
        prompt,
        size: imageSize,
        n: 1,
        ref_images: images.map((buffer) => buffer.toString("base64")),
      }),
      signal: signal ?? null,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Image edit failed (${res.status}): ${body || res.statusText}`
      );
    }

    const payload = await res.json();
    const image = payload?.data?.[0];
    let result;
    if (image?.b64_json) {
      result = { buffer: Buffer.from(image.b64_json, "base64") };
    } else if (image?.url) {
      const imgRes = await fetch(image.url, { signal: signal ?? null });
      if (!imgRes.ok)
        throw new Error(`Failed to fetch edited image: ${imgRes.status}`);
      result = { buffer: Buffer.from(await imgRes.arrayBuffer()) };
    } else {
      throw new Error("Image edit returned no image data.");
    }
    this._sendImageTelemetry("image_generated", {
      withReferences: images.length > 0,
    });
    return result;
  }
}

module.exports = { LocalAiImageGenerator };

/* eslint-env jest */

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
  process.env.IMAGE_GEN_GEMINI_API_KEY = "test-gemini-key";
  process.env.IMAGE_GEN_MODEL_PREF = "gemini-3.1-flash-image";
  delete process.env.IMAGE_GEN_SIZE_PREF;
  global.fetch = jest.fn();
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  jest.restoreAllMocks();
});

function loadGenerator() {
  const {
    GeminiImageGenerator,
  } = require("../../../utils/ImageGenerators/gemini");
  return new GeminiImageGenerator();
}

describe("GeminiImageGenerator", () => {
  test("throws when IMAGE_GEN_GEMINI_API_KEY is missing", () => {
    delete process.env.IMAGE_GEN_GEMINI_API_KEY;
    expect(() => loadGenerator()).toThrow(
      "No Gemini image generation API key was set."
    );
  });

  test("defaults model to gemini-3.1-flash-image", () => {
    delete process.env.IMAGE_GEN_MODEL_PREF;
    const generator = loadGenerator();
    expect(generator.model).toBe("gemini-3.1-flash-image");
  });

  describe("_resolveAspectRatio", () => {
    test("passes through aspect ratio strings", () => {
      const generator = loadGenerator();
      expect(generator._resolveAspectRatio("16:9")).toBe("16:9");
      expect(generator._resolveAspectRatio("1:1")).toBe("1:1");
    });

    test("maps WxH sizes to the nearest aspect ratio", () => {
      const generator = loadGenerator();
      expect(generator._resolveAspectRatio("1024x1024")).toBe("1:1");
      expect(generator._resolveAspectRatio("1024x1536")).toBe("2:3");
      expect(generator._resolveAspectRatio("1536x1024")).toBe("3:2");
    });

    test("falls back to IMAGE_GEN_SIZE_PREF then 1:1", () => {
      process.env.IMAGE_GEN_SIZE_PREF = "9:16";
      const generator = loadGenerator();
      expect(generator._resolveAspectRatio()).toBe("9:16");

      delete process.env.IMAGE_GEN_SIZE_PREF;
      expect(generator._resolveAspectRatio("not-a-size")).toBe("1:1");
    });
  });

  describe("_extractImageBuffer", () => {
    test("reads camelCase inlineData", () => {
      const generator = loadGenerator();
      const buffer = generator._extractImageBuffer({
        candidates: [
          {
            content: {
              parts: [{ inlineData: { data: Buffer.from("png").toString("base64") } }],
            },
          },
        ],
      });
      expect(buffer.equals(Buffer.from("png"))).toBe(true);
    });

    test("reads snake_case inline_data", () => {
      const generator = loadGenerator();
      const buffer = generator._extractImageBuffer({
        candidates: [
          {
            content: {
              parts: [
                { text: "here you go" },
                { inline_data: { data: Buffer.from("img").toString("base64") } },
              ],
            },
          },
        ],
      });
      expect(buffer.equals(Buffer.from("img"))).toBe(true);
    });

    test("surfaces block reasons with a clear error", () => {
      const generator = loadGenerator();
      expect(() =>
        generator._extractImageBuffer({
          promptFeedback: { blockReason: "SAFETY" },
          candidates: [],
        })
      ).toThrow(/blocked \(SAFETY\)/);
    });

    test("throws when no image data is present", () => {
      const generator = loadGenerator();
      expect(() =>
        generator._extractImageBuffer({
          candidates: [{ content: { parts: [{ text: "nope" }] }, finishReason: "STOP" }],
        })
      ).toThrow("Gemini returned no image data.");
    });
  });

  describe("generateImage", () => {
    test("rejects empty prompts", async () => {
      const generator = loadGenerator();
      await expect(generator.generateImage({ prompt: "   " })).rejects.toThrow(
        "A non-empty prompt is required"
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test("posts generateContent with aspect ratio and returns image bytes", async () => {
      const imageBytes = Buffer.from("generated-image");
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      inlineData: {
                        data: imageBytes.toString("base64"),
                      },
                    },
                  ],
                },
              },
            ],
          }),
      });

      const generator = loadGenerator();
      generator._sendImageTelemetry = jest.fn();
      const result = await generator.generateImage({
        prompt: "a red fox",
        size: "16:9",
      });

      expect(result.buffer.equals(imageBytes)).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = global.fetch.mock.calls[0];
      expect(url).toContain(
        "/v1/models/gemini-3.1-flash-image:generateContent"
      );
      expect(options.headers["x-goog-api-key"]).toBe("test-gemini-key");
      const body = JSON.parse(options.body);
      expect(body.contents[0].parts).toEqual([{ text: "a red fox" }]);
      expect(body.generationConfig).toEqual({
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: "16:9" },
      });
      expect(generator._sendImageTelemetry).toHaveBeenCalledWith(
        "image_generated"
      );
    });

    test("surfaces API error messages", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () =>
          JSON.stringify({ error: { message: "invalid model" } }),
      });

      const generator = loadGenerator();
      await expect(
        generator.generateImage({ prompt: "a red fox" })
      ).rejects.toThrow("Gemini image request failed (400): invalid model");
    });
  });

  describe("editImage", () => {
    test("requires at least one reference image", async () => {
      const generator = loadGenerator();
      await expect(
        generator.editImage({ prompt: "make it blue", images: [] })
      ).rejects.toThrow("requires at least one reference image");
    });

    test("includes reference images in the request parts", async () => {
      const imageBytes = Buffer.from("edited-image");
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      inline_data: {
                        data: imageBytes.toString("base64"),
                      },
                    },
                  ],
                },
              },
            ],
          }),
      });

      const generator = loadGenerator();
      generator._sendImageTelemetry = jest.fn();
      const ref = Buffer.from("reference-png");
      const result = await generator.editImage({
        prompt: "make it blue",
        images: [ref],
        size: "1:1",
      });

      expect(result.buffer.equals(imageBytes)).toBe(true);
      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.contents[0].parts).toEqual([
        {
          inline_data: {
            mime_type: "image/png",
            data: ref.toString("base64"),
          },
        },
        { text: "make it blue" },
      ]);
      expect(generator._sendImageTelemetry).toHaveBeenCalledWith(
        "image_generated",
        { withReferences: true }
      );
    });
  });
});

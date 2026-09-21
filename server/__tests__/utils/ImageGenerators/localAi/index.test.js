/* eslint-env jest */
jest.mock("../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn().mockResolvedValue(undefined) },
}));

const { LocalAiImageGenerator } = require("../../../../utils/ImageGenerators/localAi");

describe("LocalAiImageGenerator", () => {
  const originalFetch = global.fetch;
  const originalEnv = {
    basePath: process.env.IMAGE_GEN_LOCALAI_BASE_PATH,
    model: process.env.IMAGE_GEN_MODEL_PREF,
    apiKey: process.env.IMAGE_GEN_LOCALAI_API_KEY,
  };

  beforeEach(() => {
    process.env.IMAGE_GEN_LOCALAI_BASE_PATH = "http://localai.test/v1/";
    process.env.IMAGE_GEN_MODEL_PREF = "flux.1-kontext-dev";
    process.env.IMAGE_GEN_LOCALAI_API_KEY = "localai-secret";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.IMAGE_GEN_LOCALAI_BASE_PATH = originalEnv.basePath;
    process.env.IMAGE_GEN_MODEL_PREF = originalEnv.model;
    process.env.IMAGE_GEN_LOCALAI_API_KEY = originalEnv.apiKey;
    jest.clearAllMocks();
  });

  test("passes Authorization when fetching a generated image URL", async () => {
    const imageUrl = "http://localai.test/generated.png";
    const imageBytes = Buffer.from("png-bytes");

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [{ url: imageUrl }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        arrayBuffer: async () => imageBytes,
      });

    const generator = new LocalAiImageGenerator();
    const result = await generator.generateImage({ prompt: "a red fox" });

    expect(result.buffer).toEqual(imageBytes);
    expect(global.fetch).toHaveBeenCalledTimes(2);

    const generationCall = global.fetch.mock.calls[0];
    expect(generationCall[0]).toBe(
      "http://localai.test/v1/images/generations"
    );
    expect(generationCall[1].headers.Authorization).toBe(
      "Bearer localai-secret"
    );

    const imageFetchCall = global.fetch.mock.calls[1];
    expect(imageFetchCall[0]).toBe(imageUrl);
    expect(imageFetchCall[1].headers.Authorization).toBe(
      "Bearer localai-secret"
    );
  });
});

/* eslint-env jest, node */
const fs = require("fs");
const os = require("os");
const path = require("path");

const mockCreate = jest.fn();
jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation((config) => ({
    config,
    chat: { completions: { create: mockCreate } },
  })),
}));

const { OpenAI } = require("openai");
const { OpenAiVision } = require("../../../utils/VisionProviders/OpenAiVision");
const {
  GenericOpenAiVision,
} = require("../../../utils/VisionProviders/GenericOpenAiVision");
const {
  DESCRIPTION_PROMPT,
} = require("../../../utils/VisionProviders/utils");

const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function completion(content) {
  return { choices: [{ message: { content } }] };
}

describe("Vision providers", () => {
  let tmpDir;
  let imagePath;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vision-provider-"));
    imagePath = path.join(tmpDir, "chart.png");
    fs.writeFileSync(imagePath, PNG_BYTES);
  });

  afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

  beforeEach(() => jest.clearAllMocks());

  describe("OpenAiVision", () => {
    it("requires an API key", () => {
      expect(() => new OpenAiVision({ options: {} })).toThrow(
        "No OpenAI API key was set."
      );
    });

    it("sends the image as a base64 data URL and returns the description", async () => {
      mockCreate.mockResolvedValue(
        completion("  A bar chart of quarterly revenue.  ")
      );
      const provider = new OpenAiVision({ options: { openAiKey: "sk-test" } });
      const result = await provider.describeImage(imagePath);

      expect(result).toEqual({
        content: "A bar chart of quarterly revenue.",
        error: null,
      });

      const [payload] = mockCreate.mock.calls[0];
      expect(payload.model).toBe("gpt-4o-mini");
      expect(payload.messages[0].content[0]).toEqual({
        type: "text",
        text: DESCRIPTION_PROMPT,
      });
      expect(payload.messages[0].content[1].image_url.url).toBe(
        `data:image/png;base64,${PNG_BYTES.toString("base64")}`
      );
    });

    it("returns an error instead of throwing when the request fails", async () => {
      mockCreate.mockRejectedValue(new Error("429 rate limited"));
      const provider = new OpenAiVision({ options: { openAiKey: "sk-test" } });

      expect(await provider.describeImage(imagePath)).toEqual({
        content: "",
        error: "429 rate limited",
      });
    });

    it("returns an error when the response has no content", async () => {
      mockCreate.mockResolvedValue(completion(""));
      const provider = new OpenAiVision({ options: { openAiKey: "sk-test" } });

      expect(await provider.describeImage(imagePath)).toEqual({
        content: "",
        error: "No description was returned.",
      });
    });

    it("returns an error and makes no request when the file is missing", async () => {
      const provider = new OpenAiVision({ options: { openAiKey: "sk-test" } });

      expect(
        await provider.describeImage(path.join(tmpDir, "missing.png"))
      ).toEqual({
        content: "",
        error: "Image could not be read from disk.",
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("GenericOpenAiVision", () => {
    it("requires a base URL", () => {
      expect(() => new GenericOpenAiVision({ options: {} })).toThrow(
        "No base URL was set."
      );
    });

    it("uses the configured base URL, key and model", async () => {
      mockCreate.mockResolvedValue(completion("A screenshot of a terminal."));
      const provider = new GenericOpenAiVision({
        options: {
          VisionGenericOpenAiBaseUrl: "http://localhost:11434/v1",
          VisionGenericOpenAiApiKey: "sk-local",
          VisionGenericOpenAiModel: "qwen2.5vl",
        },
      });
      const result = await provider.describeImage(imagePath);

      expect(OpenAI).toHaveBeenCalledWith({
        baseURL: "http://localhost:11434/v1",
        apiKey: "sk-local",
      });
      expect(mockCreate.mock.calls[0][0].model).toBe("qwen2.5vl");
      expect(result.content).toBe("A screenshot of a terminal.");
    });

    it("defaults the model when none is configured", async () => {
      mockCreate.mockResolvedValue(completion("A diagram."));
      const provider = new GenericOpenAiVision({
        options: { VisionGenericOpenAiBaseUrl: "http://localhost:11434/v1" },
      });
      await provider.describeImage(imagePath);

      expect(OpenAI).toHaveBeenCalledWith({
        baseURL: "http://localhost:11434/v1",
        apiKey: null,
      });
      expect(mockCreate.mock.calls[0][0].model).toBe("llava");
    });

    it("derives the data URL mime from the file extension", async () => {
      const jpegPath = path.join(tmpDir, "photo.jpg");
      fs.writeFileSync(jpegPath, PNG_BYTES);
      mockCreate.mockResolvedValue(completion("A photo."));
      const provider = new GenericOpenAiVision({
        options: { VisionGenericOpenAiBaseUrl: "http://localhost:11434/v1" },
      });
      await provider.describeImage(jpegPath);

      expect(mockCreate.mock.calls[0][0].messages[0].content[1].image_url.url)
        .toBe(`data:image/jpeg;base64,${PNG_BYTES.toString("base64")}`);
    });
  });
});

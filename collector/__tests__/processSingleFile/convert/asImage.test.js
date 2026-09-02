/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

const mockOcrImage = jest.fn();
const mockOpenAiDescribe = jest.fn();
const mockGenericDescribe = jest.fn();

jest.mock("../../../utils/OCRLoader", () =>
  jest.fn().mockImplementation(() => ({ ocrImage: mockOcrImage }))
);
jest.mock("../../../utils/VisionProviders/OpenAiVision", () => ({
  OpenAiVision: jest
    .fn()
    .mockImplementation(() => ({ describeImage: mockOpenAiDescribe })),
}));
jest.mock("../../../utils/VisionProviders/GenericOpenAiVision", () => ({
  GenericOpenAiVision: jest
    .fn()
    .mockImplementation(() => ({ describeImage: mockGenericDescribe })),
}));
jest.mock("../../../utils/files", () => ({
  createdDate: jest.fn(() => "1/1/2026"),
  trashFile: jest.fn(),
  writeToServerDocuments: jest.fn(({ data }) => data),
}));

const OCRLoader = require("../../../utils/OCRLoader");
const {
  OpenAiVision,
} = require("../../../utils/VisionProviders/OpenAiVision");
const {
  GenericOpenAiVision,
} = require("../../../utils/VisionProviders/GenericOpenAiVision");
const { trashFile } = require("../../../utils/files");
const asImage = require("../../../processSingleFile/convert/asImage");

const FULL_FILE_PATH = "/hotdir/diagram.png";
const FILENAME = "diagram.png";
const MARKER = "[Machine-generated image description]";

function convert(options = {}, metadata = {}) {
  return asImage({
    fullFilePath: FULL_FILE_PATH,
    filename: FILENAME,
    options,
    metadata,
  });
}

describe("asImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOcrImage.mockResolvedValue("");
    mockOpenAiDescribe.mockResolvedValue({ content: "", error: null });
    mockGenericDescribe.mockResolvedValue({ content: "", error: null });
  });

  describe("with no vision provider configured", () => {
    it("embeds only the OCR text and never builds a vision provider", async () => {
      mockOcrImage.mockResolvedValue("Total due: $40");
      const { success, documents } = await convert();

      expect(success).toBe(true);
      expect(OpenAiVision).not.toHaveBeenCalled();
      expect(GenericOpenAiVision).not.toHaveBeenCalled();
      expect(documents[0].pageContent).toBe("Total due: $40");
      expect(documents[0].description).toBe("Unknown");
      expect(documents[0].docSource).toBe("image file uploaded by the user.");
    });

    it("rejects an image with no text using the original failure response", async () => {
      const result = await convert();

      expect(result).toEqual({
        success: false,
        reason: "No text content found in diagram.png.",
        documents: [],
      });
      expect(trashFile).toHaveBeenCalledWith(FULL_FILE_PATH);
    });

    it("keeps the file on disk when parsing an absolute path", async () => {
      await convert({ absolutePath: "/some/where/diagram.png" });
      expect(trashFile).not.toHaveBeenCalled();
    });

    it("ignores an unknown provider name", async () => {
      const result = await convert({ visionProvider: "not-a-provider" });

      expect(OpenAiVision).not.toHaveBeenCalled();
      expect(result.reason).toBe("No text content found in diagram.png.");
    });

    it("ignores object prototype keys used as a provider name", async () => {
      const result = await convert({ visionProvider: "constructor" });

      expect(result.reason).toBe("No text content found in diagram.png.");
    });
  });

  describe("with a vision provider configured", () => {
    it("appends the description to the OCR text behind a provenance marker", async () => {
      mockOcrImage.mockResolvedValue("Q3 REVENUE");
      mockOpenAiDescribe.mockResolvedValue({
        content: "A bar chart of quarterly revenue.",
        error: null,
      });

      const { success, documents } = await convert({
        visionProvider: "openai",
        openAiKey: "sk-test",
      });

      expect(success).toBe(true);
      expect(OpenAiVision).toHaveBeenCalledWith({
        options: { visionProvider: "openai", openAiKey: "sk-test" },
      });
      expect(mockOpenAiDescribe).toHaveBeenCalledWith(FULL_FILE_PATH);
      expect(documents[0].pageContent).toBe(
        `Q3 REVENUE\n\n${MARKER}\nA bar chart of quarterly revenue.`
      );
      expect(documents[0].docSource).toBe(
        "image file uploaded by the user, described by a vision model."
      );
      expect(documents[0].description).toBe(
        "Machine-generated description of an image."
      );
      expect(documents[0].wordCount).toBe(
        documents[0].pageContent.split(" ").length
      );
    });

    it("selects the generic provider for generic-openai", async () => {
      mockGenericDescribe.mockResolvedValue({
        content: "A screenshot of a terminal.",
        error: null,
      });

      const { documents } = await convert({
        visionProvider: "generic-openai",
        VisionGenericOpenAiBaseUrl: "http://localhost:11434/v1",
      });

      expect(GenericOpenAiVision).toHaveBeenCalledTimes(1);
      expect(OpenAiVision).not.toHaveBeenCalled();
      expect(documents[0].pageContent).toBe(
        `${MARKER}\nA screenshot of a terminal.`
      );
    });

    it("succeeds on an image with no OCR text once it has a description", async () => {
      mockOpenAiDescribe.mockResolvedValue({
        content: "A photo of a dog on a beach.",
        error: null,
      });

      const { success, reason, documents } = await convert({
        visionProvider: "openai",
      });

      expect(success).toBe(true);
      expect(reason).toBeNull();
      expect(documents[0].pageContent).toBe(
        `${MARKER}\nA photo of a dog on a beach.`
      );
    });

    it("still fails when OCR and the description are both empty", async () => {
      const result = await convert({ visionProvider: "openai" });

      expect(result).toEqual({
        success: false,
        reason: "No text content found in diagram.png.",
        documents: [],
      });
      expect(trashFile).toHaveBeenCalledWith(FULL_FILE_PATH);
    });

    it("falls back to OCR-only when the provider returns an error", async () => {
      mockOcrImage.mockResolvedValue("Total due: $40");
      mockOpenAiDescribe.mockResolvedValue({
        content: "",
        error: "429 rate limited",
      });

      const { success, documents } = await convert({
        visionProvider: "openai",
      });

      expect(success).toBe(true);
      expect(documents[0].pageContent).toBe("Total due: $40");
      expect(documents[0].docSource).toBe("image file uploaded by the user.");
    });

    it("falls back to OCR-only when the provider throws", async () => {
      mockOcrImage.mockResolvedValue("Total due: $40");
      mockOpenAiDescribe.mockRejectedValue(new Error("socket hang up"));

      const { success, documents } = await convert({
        visionProvider: "openai",
      });

      expect(success).toBe(true);
      expect(documents[0].pageContent).toBe("Total due: $40");
    });

    it("falls back to OCR-only when the provider cannot be constructed", async () => {
      mockOcrImage.mockResolvedValue("Total due: $40");
      OpenAiVision.mockImplementationOnce(() => {
        throw new Error("No OpenAI API key was set.");
      });

      const { success, documents } = await convert({
        visionProvider: "openai",
      });

      expect(success).toBe(true);
      expect(documents[0].pageContent).toBe("Total due: $40");
    });

    it("passes the OCR language list through untouched", async () => {
      await convert({ visionProvider: "openai", ocr: { langList: "deu" } });
      expect(OCRLoader).toHaveBeenCalledWith({ targetLanguages: "deu" });
    });
  });
});

/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
jest.mock("express", () => {
  const handlers = {};
  const app = {
    use() {},
    get() {},
    all() {},
    post(route, ...callbacks) {
      handlers[route] = callbacks.at(-1);
    },
    listen() {
      return { on() {} };
    },
  };
  return Object.assign(() => app, { handlers });
});
jest.mock("../../utils/logger", () => () => {});
jest.mock("../../extensions", () => () => {});
jest.mock("../../convertAudioToWav", () => ({}));
jest.mock("../../processRawText", () => ({}));
jest.mock("../../processSingleFile", () => ({ processSingleFile: jest.fn() }));
jest.mock("../../utils/downloadURIToFile", () => ({
  downloadURIToFile: jest.fn(async () => ({
    success: true,
    fileLocation: "/tmp/talk.mp3",
  })),
}));
jest.mock("../../utils/extensions/YoutubeTranscript", () => ({}));
jest.mock("langchain/document_loaders/web/puppeteer", () => ({}));

const { handlers } = require("express");
const { processSingleFile } = require("../../processSingleFile");
require("../../index");

afterEach(() => {
  jest.restoreAllMocks();
  processSingleFile.mockReset();
});

it.each([
  ["/process-link", false],
  ["/util/get-link", true],
])(
  "%s preserves file conversion settings and its storage mode",
  async (route, parseOnly) => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      headers: { get: () => "audio/mpeg" },
    });
    const options = {
      whisperProvider: "generic-openai",
      WhisperModelPref: "fixture-model",
      WhisperGenericOpenAiApiKey: "dummy-key",
      ocr: { langList: "deu" },
      parseOnly: !parseOnly,
    };
    processSingleFile.mockResolvedValue({
      success: true,
      documents: [{ pageContent: "fixture transcript" }],
    });
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await handlers[route](
      {
        body: JSON.stringify({ link: "https://example.com/talk.mp3", options }),
      },
      response
    );
    expect(processSingleFile).toHaveBeenCalledWith(
      "talk.mp3",
      { ...options, parseOnly },
      {}
    );
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  }
);

/* eslint-env jest */
jest.mock(
  "openai",
  () => ({
    OpenAI: jest.fn().mockImplementation(() => ({})),
  }),
  { virtual: true }
);

const {
  OpenAiImageGenerator,
} = require("../../../utils/ImageGenerators/openAi/index.js");

describe("OpenAiImageGenerator default model", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      IMAGE_GEN_OPENAI_KEY: "test-key",
    };
    delete process.env.IMAGE_GEN_MODEL_PREF;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("defaults to gpt-image-2.5-flare now that gpt-image-1 is shut down", () => {
    const generator = new OpenAiImageGenerator();
    expect(generator.model).toBe("gpt-image-2.5-flare");
  });

  test("never falls back to the deprecated gpt-image-1", () => {
    const generator = new OpenAiImageGenerator();
    expect(generator.model).not.toBe("gpt-image-1");
  });

  test("IMAGE_GEN_MODEL_PREF still overrides the default", () => {
    process.env.IMAGE_GEN_MODEL_PREF = "gpt-image-2.5-sunburst";
    const generator = new OpenAiImageGenerator();
    expect(generator.model).toBe("gpt-image-2.5-sunburst");
  });

  test("throws when no API key is set", () => {
    delete process.env.IMAGE_GEN_OPENAI_KEY;
    expect(() => new OpenAiImageGenerator()).toThrow(
      "No OpenAI image generation API key was set."
    );
  });
});

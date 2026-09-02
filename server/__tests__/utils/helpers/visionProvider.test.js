/* eslint-env jest */
const { updateENV } = require("../../../utils/helpers/updateENV.js");

describe("VisionProvider ENV validation", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it.each(["none", "openai", "generic-openai"])(
    "accepts %s as a provider",
    async (provider) => {
      const { newValues, error } = await updateENV({
        VisionProvider: provider,
      });

      expect(error).toBe(false);
      expect(newValues.VisionProvider).toBe(provider);
      expect(process.env.VISION_PROVIDER).toBe(provider);
    }
  );

  it("rejects an unsupported provider and leaves the ENV untouched", async () => {
    process.env.VISION_PROVIDER = "none";
    const { newValues, error } = await updateENV({ VisionProvider: "local" });

    expect(error).toBe("local is not a valid vision model provider.");
    expect(newValues).toEqual({});
    expect(process.env.VISION_PROVIDER).toBe("none");
  });

  it("rejects an empty provider", async () => {
    const { error } = await updateENV({ VisionProvider: "" });
    expect(error).toBeTruthy();
    expect(process.env.VISION_PROVIDER).toBeUndefined();
  });

  it("rejects a base URL that is not a URL", async () => {
    const { error } = await updateENV({
      VisionGenericOpenAiBaseUrl: "not a url",
    });

    expect(error).toBeTruthy();
    expect(process.env.VISION_GENERIC_OPEN_AI_BASE_URL).toBeUndefined();
  });

  it("stores the generic provider configuration", async () => {
    const { error } = await updateENV({
      VisionGenericOpenAiBaseUrl: "http://localhost:11434/v1",
      VisionGenericOpenAiApiKey: "sk-local",
      VisionGenericOpenAiModel: "llava",
    });

    expect(error).toBe(false);
    expect(process.env.VISION_GENERIC_OPEN_AI_BASE_URL).toBe(
      "http://localhost:11434/v1"
    );
    expect(process.env.VISION_GENERIC_OPEN_AI_API_KEY).toBe("sk-local");
    expect(process.env.VISION_GENERIC_OPEN_AI_MODEL).toBe("llava");
  });
});

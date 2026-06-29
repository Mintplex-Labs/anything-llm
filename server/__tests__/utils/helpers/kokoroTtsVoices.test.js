/* eslint-env jest */

/**
 * Tests that the kokoro-tts custom model fetcher normalizes both response
 * shapes of kokoro-fastapi's /v1/audio/voices endpoint:
 *   - kokoro-fastapi <  0.3.x returns plain id strings  -> ["af_bella", ...]
 *   - kokoro-fastapi >= 0.3.x returns objects           -> [{ id, name }, ...]
 * Previously only the object shape was handled, so users on the (still common)
 * string shape saw an empty/unselectable voice list.
 *
 * Related issue: https://github.com/Mintplex-Labs/anything-llm/issues/5926
 */

describe("kokoroTtsVoices custom model fetching", () => {
  const ORIGINAL_ENV = process.env;
  const ORIGINAL_FETCH = global.fetch;
  const ENDPOINT = "http://localhost:8880/v1";

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function mockVoicesResponse(payload) {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: "OK",
      json: async () => payload,
    });
  }

  test("normalizes the legacy plain-string voice list (kokoro-fastapi < 0.3.x)", async () => {
    mockVoicesResponse({ voices: ["af_bella", "af_sarah", "am_adam"] });
    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const { models, error } = await getCustomModels(
      "kokoro-tts",
      null,
      ENDPOINT
    );

    expect(error).toBeNull();
    expect(models).toEqual([
      { id: "af_bella", name: "af_bella", organization: "Kokoro" },
      { id: "af_sarah", name: "af_sarah", organization: "Kokoro" },
      { id: "am_adam", name: "am_adam", organization: "Kokoro" },
    ]);
  });

  test("normalizes the object voice list (kokoro-fastapi >= 0.3.x)", async () => {
    mockVoicesResponse({
      voices: [
        { id: "af_bella", name: "Bella" },
        { id: "am_adam", name: "Adam" },
      ],
    });
    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const { models, error } = await getCustomModels(
      "kokoro-tts",
      null,
      ENDPOINT
    );

    expect(error).toBeNull();
    expect(models).toEqual([
      { id: "af_bella", name: "Bella", organization: "Kokoro" },
      { id: "am_adam", name: "Adam", organization: "Kokoro" },
    ]);
  });

  test("falls back to the voice id when an object omits its name", async () => {
    mockVoicesResponse({ voices: [{ id: "af_bella" }] });
    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const { models } = await getCustomModels("kokoro-tts", null, ENDPOINT);

    expect(models).toEqual([
      { id: "af_bella", name: "af_bella", organization: "Kokoro" },
    ]);
  });

  test("queries the /v1/audio/voices endpoint of the provided base URL", async () => {
    mockVoicesResponse({ voices: ["af_bella"] });
    const { getCustomModels } = require("../../../utils/helpers/customModels");
    await getCustomModels("kokoro-tts", null, ENDPOINT);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8880/v1/audio/voices",
      expect.objectContaining({ method: "GET" })
    );
  });

  test("returns an error when no endpoint is configured", async () => {
    delete process.env.TTS_KOKORO_ENDPOINT;
    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const { models, error } = await getCustomModels("kokoro-tts", null, null);

    expect(models).toEqual([]);
    expect(error).toEqual(expect.any(String));
  });
});

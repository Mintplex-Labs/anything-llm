/* eslint-env jest */
jest.mock("../../../utils/TextToSpeech/audioCache", () => ({
  TTSAudioCache: { clear: jest.fn(async () => {}) },
}));
jest.mock("../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));

const { TTSAudioCache } = require("../../../utils/TextToSpeech/audioCache");
const { updateENV } = require("../../../utils/helpers/updateENV");

describe("updateENV cached TTS audio reset", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  test.each([
    ["TextToSpeechProvider", "TTS_PROVIDER", "openai", "elevenlabs"],
    ["TTSOpenAIVoiceModel", "TTS_OPEN_AI_VOICE_MODEL", "alloy", "nova"],
    ["TTSElevenLabsVoiceModel", "TTS_ELEVEN_LABS_VOICE_MODEL", "a", "b"],
    ["TTSOpenAICompatibleModel", "TTS_OPEN_AI_COMPATIBLE_MODEL", "a", "b"],
    [
      "TTSOpenAICompatibleVoiceModel",
      "TTS_OPEN_AI_COMPATIBLE_VOICE_MODEL",
      "a",
      "b",
    ],
    [
      "TTSOpenAICompatibleEndpoint",
      "TTS_OPEN_AI_COMPATIBLE_ENDPOINT",
      "http://localhost:1/v1",
      "http://localhost:2/v1",
    ],
    [
      "TTSKokoroEndpoint",
      "TTS_KOKORO_ENDPOINT",
      "http://localhost:1/v1",
      "http://localhost:2/v1",
    ],
    ["TTSKokoroVoiceModel", "TTS_KOKORO_VOICE_MODEL", "af_bella", "af_sky"],
  ])("clears the cache when %s changes", async (key, envKey, prev, next) => {
    process.env[envKey] = prev;
    const { error } = await updateENV({ [key]: next });
    expect(error).toBe(false);
    expect(TTSAudioCache.clear).toHaveBeenCalledTimes(1);
  });

  test("keeps the cache when a setting is saved with the same value", async () => {
    process.env.TTS_OPEN_AI_VOICE_MODEL = "alloy";
    await updateENV({ TTSOpenAIVoiceModel: "alloy" });
    expect(TTSAudioCache.clear).not.toHaveBeenCalled();
  });

  test("keeps the cache when only an API key changes", async () => {
    process.env.TTS_ELEVEN_LABS_KEY = "old-key";
    await updateENV({ TTSElevenLabsKey: "new-key" });
    expect(TTSAudioCache.clear).not.toHaveBeenCalled();
  });

  test("keeps the cache when an unrelated setting changes", async () => {
    await updateENV({ TTSPiperTTSVoiceModel: "en_US-hfc_female-medium" });
    expect(TTSAudioCache.clear).not.toHaveBeenCalled();
  });
});

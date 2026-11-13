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

  test("clears the cache when the voice changes", async () => {
    process.env.TTS_OPEN_AI_VOICE_MODEL = "alloy";
    await updateENV({ TTSOpenAIVoiceModel: "nova" });
    expect(TTSAudioCache.clear).toHaveBeenCalledTimes(1);
  });

  test("keeps the cache when the voice is saved unchanged", async () => {
    process.env.TTS_OPEN_AI_VOICE_MODEL = "alloy";
    await updateENV({ TTSOpenAIVoiceModel: "alloy" });
    expect(TTSAudioCache.clear).not.toHaveBeenCalled();
  });

  test("keeps the cache when only an API key changes", async () => {
    process.env.TTS_ELEVEN_LABS_KEY = "old-key";
    await updateENV({ TTSElevenLabsKey: "new-key" });
    expect(TTSAudioCache.clear).not.toHaveBeenCalled();
  });
});

/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "tts-cache-test-"));
process.env.STORAGE_DIR = storageDir;
const {
  TTSAudioCache,
  TTS_AUDIO_FILENAME_PATTERN,
} = require("../../../utils/TextToSpeech/audioCache");

const cachePath = path.join(storageDir, "tts-cache");
const mp3 = Buffer.from("ID3 mp3 audio");
const wav = Buffer.concat([
  Buffer.from("RIFF"),
  Buffer.alloc(4),
  Buffer.from("WAVEfmt "),
]);

describe("TTSAudioCache", () => {
  afterEach(() => {
    fs.rmSync(cachePath, { recursive: true, force: true });
  });

  afterAll(() => {
    fs.rmSync(storageDir, { recursive: true, force: true });
  });

  describe("key", () => {
    const provider = { cacheKey: "openai:tts-1:alloy" };

    test("changes when the text changes", () => {
      expect(TTSAudioCache.key(provider, "hello")).not.toBe(
        TTSAudioCache.key(provider, "hello edited")
      );
    });

    test("changes when the provider settings change", () => {
      expect(TTSAudioCache.key(provider, "hello")).not.toBe(
        TTSAudioCache.key({ cacheKey: "openai:tts-1:nova" }, "hello")
      );
    });
  });

  describe("set", () => {
    test("writes a flat file named by the strict pattern", async () => {
      const ttsAudio = await TTSAudioCache.set("key", wav);
      expect(ttsAudio.key).toBe("key");
      expect(ttsAudio.filename).toMatch(TTS_AUDIO_FILENAME_PATTERN);
      expect(ttsAudio.filename.endsWith(".wav")).toBe(true);
      expect(fs.readdirSync(cachePath)).toEqual([ttsAudio.filename]);
    });
  });

  describe("get", () => {
    test("misses when the chat has no audio reference", () => {
      expect(TTSAudioCache.get(undefined, "key")).toBeNull();
    });

    test("hits with the stored audio and its mime type", async () => {
      const ttsAudio = await TTSAudioCache.set("key", wav);
      const audio = TTSAudioCache.get(ttsAudio, "key");
      expect(audio.mime).toBe("audio/wav");
      expect(fs.readFileSync(audio.filepath)).toEqual(wav);
    });

    test("misses when the audio was generated under another key", async () => {
      const ttsAudio = await TTSAudioCache.set("old-key", mp3);
      expect(TTSAudioCache.get(ttsAudio, "new-key")).toBeNull();
    });

    test("misses when the file is gone", async () => {
      const ttsAudio = await TTSAudioCache.set("key", mp3);
      fs.rmSync(path.join(cachePath, ttsAudio.filename));
      expect(TTSAudioCache.get(ttsAudio, "key")).toBeNull();
    });

    test("rejects filenames outside the strict pattern", () => {
      fs.mkdirSync(cachePath, { recursive: true });
      fs.writeFileSync(path.join(storageDir, "secret.mp3"), mp3);
      expect(
        TTSAudioCache.get({ key: "key", filename: "../secret.mp3" }, "key")
      ).toBeNull();
    });
  });
});

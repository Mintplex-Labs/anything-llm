/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "tts-cache-test-"));
process.env.STORAGE_DIR = storageDir;
const { TTSAudioCache } = require("../../../utils/TextToSpeech/audioCache");

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

  describe("get", () => {
    test("misses when nothing is cached for the chat", async () => {
      expect(await TTSAudioCache.get(1, "key")).toBeNull();
    });

    test("hits with the stored audio and its mime type", async () => {
      await TTSAudioCache.set(1, "key", wav);
      const audio = await TTSAudioCache.get(1, "key");
      expect(audio.mime).toBe("audio/wav");
      expect(fs.readFileSync(audio.filepath)).toEqual(wav);
    });

    test("misses when the chat has audio under another key", async () => {
      await TTSAudioCache.set(1, "old-key", mp3);
      expect(await TTSAudioCache.get(1, "new-key")).toBeNull();
    });

    test("misses for a file left partially written by a crash", async () => {
      const folder = path.join(cachePath, "1");
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(path.join(folder, "key.mp3.1234.tmp"), "partial");
      expect(await TTSAudioCache.get(1, "key")).toBeNull();
    });
  });

  describe("set", () => {
    test("replaces audio the chat had under another key", async () => {
      await TTSAudioCache.set(1, "old-key", mp3);
      await TTSAudioCache.set(1, "new-key", wav);
      expect(fs.readdirSync(path.join(cachePath, "1"))).toEqual([
        "new-key.wav",
      ]);
    });

    test("keeps chat ids from escaping the cache folder", async () => {
      const audio = await TTSAudioCache.set("../../escape", "key", mp3);
      expect(audio.filepath).toBe(path.join(cachePath, "NaN", "key.mp3"));
    });
  });

  describe("purge", () => {
    test("removes audio of the given chats only", async () => {
      await TTSAudioCache.set(1, "key", mp3);
      await TTSAudioCache.set(2, "key", mp3);
      await TTSAudioCache.set(3, "key", mp3);
      await TTSAudioCache.purge([1, "3"]);
      expect(fs.readdirSync(cachePath)).toEqual(["2"]);
    });

    test("does not fail before any audio has been cached", async () => {
      await expect(TTSAudioCache.purge([1])).resolves.toBeUndefined();
    });
  });

  describe("clear", () => {
    test("removes audio of every chat", async () => {
      await TTSAudioCache.set(1, "key", mp3);
      await TTSAudioCache.set(2, "key", wav);
      await TTSAudioCache.clear();
      expect(fs.existsSync(cachePath)).toBe(false);
    });

    test("does not fail before any audio has been cached", async () => {
      await expect(TTSAudioCache.clear()).resolves.toBeUndefined();
    });
  });
});

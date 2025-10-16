process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const { YoutubeTranscript } = require("../../../../../utils/extensions/YoutubeTranscript/YoutubeLoader/youtube-transcript.js");

describe("YoutubeTranscript", () => {
  if (process.env.GITHUB_ACTIONS) {
    console.log("Skipping YoutubeTranscript test in GitHub Actions as the URLs will not resolve.");
    it('is stubbed in GitHub Actions', () => expect(true).toBe(true));
  } else {
    it("should fetch transcript from YouTube video", async () => {
      const videoId = "BJjsfNO5JTo";
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "en",
      });

      expect(transcript).toBeDefined();
      expect(typeof transcript).toBe("string");
      expect(transcript.length).toBeGreaterThan(0);
      console.log("First 200 characters:", transcript.substring(0, 200) + "...");
    }, 30000);

    it("should fetch non asr transcript from YouTube video", async () => {
      const videoId = "D111ao6wWH0";
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "zh-HK",
      });

      expect(transcript).toBeDefined();
      expect(typeof transcript).toBe("string");
      expect(transcript.length).toBeGreaterThan(0);
      console.log("First 200 characters:", transcript.substring(0, 200) + "...");
    }, 30000);
  }
});

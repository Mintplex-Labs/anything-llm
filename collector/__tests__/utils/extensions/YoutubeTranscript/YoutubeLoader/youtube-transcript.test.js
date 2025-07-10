const { YoutubeTranscript } = require("../../../../../utils/extensions/YoutubeTranscript/YoutubeLoader/youtube-transcript.js");

describe("YoutubeTranscript", () => {
  it("should fetch transcript from YouTube video", async () => {
    const videoId = "BJjsfNO5JTo";
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });

    expect(transcript).toBeDefined();
    expect(typeof transcript).toBe("string");
    expect(transcript.length).toBeGreaterThan(0);
    // console.log("Success! Transcript length:", transcript.length);
    // console.log("First 200 characters:", transcript.substring(0, 200) + "...");
  }, 30000);
});

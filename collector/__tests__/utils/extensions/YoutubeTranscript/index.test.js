process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const { validYoutubeVideoUrl } = require("../../../../utils/extensions/YoutubeTranscript/index.js");

describe("validYoutubeVideoUrl", () => {
  const ID = "dQw4w9WgXcQ"; // 11-char valid video id

  it("returns true for youtube watch URLs with v param", () => {
    expect(validYoutubeVideoUrl(`https://www.youtube.com/watch?v=${ID}`)).toBe(
      true
    );
    expect(validYoutubeVideoUrl(`https://youtube.com/watch?v=${ID}&t=10s`)).toBe(
      true
    );
    expect(validYoutubeVideoUrl(`https://m.youtube.com/watch?v=${ID}`)).toBe(true);
    expect(validYoutubeVideoUrl(`youtube.com/watch?v=${ID}`)).toBe(true);
  });

  it("returns true for youtu.be short URLs", () => {
    expect(validYoutubeVideoUrl(`https://youtu.be/${ID}`)).toBe(true);
    expect(validYoutubeVideoUrl(`https://youtu.be/${ID}?si=abc`)).toBe(true);
    // extra path segments after id should still validate the id component
    expect(validYoutubeVideoUrl(`https://youtu.be/${ID}/extra`)).toBe(true);
  });

  it("returns true for embed and v path formats", () => {
    expect(validYoutubeVideoUrl(`https://www.youtube.com/embed/${ID}`)).toBe(true);
    expect(validYoutubeVideoUrl(`https://youtube.com/v/${ID}`)).toBe(true);
  });

  it("returns false for non-YouTube hosts", () => {
    expect(validYoutubeVideoUrl("https://example.com/watch?v=dQw4w9WgXcQ")).toBe(
      false
    );
    expect(validYoutubeVideoUrl("https://vimeo.com/123456")).toBe(false);
  });

  it("returns false for unrelated YouTube paths without a video id", () => {
    expect(validYoutubeVideoUrl("https://www.youtube.com/user/somechannel")).toBe(
      false
    );
    expect(validYoutubeVideoUrl("https://www.youtube.com/")).toBe(false);
  });

  it("returns false for empty or bad inputs", () => {
    expect(validYoutubeVideoUrl("")).toBe(false);
    expect(validYoutubeVideoUrl(null)).toBe(false);
    expect(validYoutubeVideoUrl(undefined)).toBe(false);
  });

  it("returns the video ID for valid YouTube video URLs", () => {
    expect(validYoutubeVideoUrl(`https://www.youtube.com/watch?v=${ID}`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`https://youtube.com/watch?v=${ID}&t=10s`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`https://m.youtube.com/watch?v=${ID}`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`youtube.com/watch?v=${ID}`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`https://youtu.be/${ID}`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`https://youtu.be/${ID}?si=abc`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`https://youtu.be/${ID}/extra`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`https://www.youtube.com/embed/${ID}`, true)).toBe(ID);
    expect(validYoutubeVideoUrl(`https://youtube.com/v/${ID}`, true)).toBe(ID);
    // invalid video IDs
    expect(validYoutubeVideoUrl(`https://www.youtube.com/watch?v=invalid`, true)).toBe(null);
    expect(validYoutubeVideoUrl(`https://youtube.com/watch?v=invalid`, true)).toBe(null);
    expect(validYoutubeVideoUrl(`https://m.youtube.com/watch?v=invalid`, true)).toBe(null);
    expect(validYoutubeVideoUrl(`youtube.com/watch`, true)).toBe(null);
    expect(validYoutubeVideoUrl(`https://youtu.be/invalid`, true)).toBe(null);
    expect(validYoutubeVideoUrl(`https://youtu.be/invalid?si=abc`, true)).toBe(null);
  });
});
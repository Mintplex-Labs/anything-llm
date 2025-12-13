process.env.STORAGE_DIR = "test-storage";
const fs = require("fs");
const path = require("path");
const { FFMPEGWrapper } = require("../../../../utils/WhisperProviders/ffmpeg");

describe("FFMPEGWrapper", () => {
  let ffmpeg;

  beforeEach(() => {
    ffmpeg = new FFMPEGWrapper();
  });

  it("should find ffmpeg executable", async () => {
    const ffmpegPath = await ffmpeg.getFFMPEGPath();
    expect(ffmpegPath).toBeDefined();
    expect(typeof ffmpegPath).toBe("string");
    expect(ffmpegPath.length).toBeGreaterThan(0);
  });

  it("should validate ffmpeg executable", async () => {
    const ffmpegPath = await ffmpeg.getFFMPEGPath();
    expect(ffmpeg.isValidFFMPEG(ffmpegPath)).toBe(true);
  });

  it("should return false for invalid ffmpeg path", () => {
    expect(ffmpeg.isValidFFMPEG("/invalid/path/to/ffmpeg")).toBe(false);
  });

  if (process.env.GITHUB_ACTIONS) {
    console.log(
      "Skipping FFMPEG conversion test in GitHub Actions as it requires ffmpeg binary."
    );
    it("is stubbed in GitHub Actions", () => expect(true).toBe(true));
  } else {
    it("should convert audio file to wav format", async () => {
      const testDir = path.resolve(__dirname, "../../../../storage/tmp");
      if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

      const sampleUrl =
        "https://github.com/ringcentral/ringcentral-api-docs/blob/main/resources/sample1.wav?raw=true";
      const inputPath = path.resolve(testDir, "test-input.wav");
      const outputPath = path.resolve(testDir, "test-output.wav");

      const response = await fetch(sampleUrl);
      if (!response.ok)
        throw new Error(
          `Failed to download sample file: ${response.statusText}`
        );

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(inputPath, Buffer.from(buffer));

      const result = await ffmpeg.convertAudioToWav(inputPath, outputPath);

      expect(result).toBe(true);
      expect(fs.existsSync(outputPath)).toBe(true);

      const stats = fs.statSync(outputPath);
      expect(stats.size).toBeGreaterThan(0);

      fs.rmSync(inputPath);
      fs.rmSync(outputPath);
    }, 30000);
  }
});

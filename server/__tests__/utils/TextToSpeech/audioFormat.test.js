/* eslint-env jest */
const { getAudioFileInfo } = require("../../../utils/TextToSpeech/audioFormat");

describe("getAudioFileInfo", () => {
  test.each([
    [
      "WAV",
      Buffer.concat([
        Buffer.from("RIFF"),
        Buffer.alloc(4),
        Buffer.from("WAVEfmt "),
      ]),
      { mime: "audio/wav", extension: ".wav" },
    ],
    ["Ogg", Buffer.from("OggS"), { mime: "audio/ogg", extension: ".ogg" }],
    ["FLAC", Buffer.from("fLaC"), { mime: "audio/flac", extension: ".flac" }],
    [
      "M4A",
      Buffer.concat([Buffer.alloc(4), Buffer.from("ftyp")]),
      { mime: "audio/mp4", extension: ".m4a" },
    ],
    [
      "WebM",
      Buffer.from([0x1a, 0x45, 0xdf, 0xa3]),
      { mime: "audio/webm", extension: ".webm" },
    ],
    ["ID3 MP3", Buffer.from("ID3"), { mime: "audio/mpeg", extension: ".mp3" }],
    [
      "frame-synced MP3",
      Buffer.from([0xff, 0xfb]),
      { mime: "audio/mpeg", extension: ".mp3" },
    ],
  ])("detects %s audio", (_name, buffer, expected) => {
    expect(getAudioFileInfo(buffer)).toEqual(expected);
  });

  test.each([Buffer.from("unknown"), Buffer.alloc(0), null])(
    "defaults unknown data to MP3",
    (buffer) => {
      expect(getAudioFileInfo(buffer)).toEqual({
        mime: "audio/mpeg",
        extension: ".mp3",
      });
    }
  );
});

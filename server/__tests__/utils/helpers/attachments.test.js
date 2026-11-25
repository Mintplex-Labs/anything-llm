const {
  attachmentToContentBlock,
} = require("../../../utils/helpers/attachments.js");

describe("attachmentToContentBlock - audio", () => {
  it("strips the data URI prefix and attaches the derived format", () => {
    expect(
      attachmentToContentBlock({
        name: "clip.mp3",
        mime: "audio/mpeg",
        contentString: "data:audio/mpeg;base64,BBBB",
      })
    ).toEqual({
      type: "input_audio",
      input_audio: { data: "BBBB", format: "mp3" },
    });
  });

  it("detects audio from the data URI when mime is absent", () => {
    expect(
      attachmentToContentBlock({ contentString: "data:audio/wav;base64,DDDD" })
    ).toEqual({
      type: "input_audio",
      input_audio: { data: "DDDD", format: "wav" },
    });
  });

  it("prefers the explicit mime over the data URI mime", () => {
    expect(
      attachmentToContentBlock({
        mime: "audio/mpeg",
        contentString: "data:audio/wav;base64,AAAA",
      }).input_audio.format
    ).toBe("mp3");
  });

  it("passes through base64 that has no data URI prefix", () => {
    expect(
      attachmentToContentBlock({ mime: "audio/wav", contentString: "CCCC" })
    ).toEqual({
      type: "input_audio",
      input_audio: { data: "CCCC", format: "wav" },
    });
  });

  it("ignores imageDetail for audio attachments", () => {
    expect(
      attachmentToContentBlock(
        { mime: "audio/wav", contentString: "data:audio/wav;base64,AAAA" },
        { imageDetail: "high" }
      )
    ).not.toHaveProperty("input_audio.detail");
  });

  it.each([
    ["audio/mpeg", "mp3"],
    ["audio/mp3", "mp3"],
    ["audio/wav", "wav"],
    ["audio/wave", "wav"],
    ["audio/x-wav", "wav"],
    ["audio/x-m4a", "m4a"],
    ["audio/mp4", "mp4"],
    ["audio/ogg", "ogg"],
    ["audio/flac", "flac"],
    ["audio/webm;codecs=opus", "webm"],
  ])("maps mime %s to input_audio format %s", (mime, format) => {
    expect(
      attachmentToContentBlock({
        mime,
        contentString: `data:${mime};base64,EEEE`,
      }).input_audio
    ).toEqual({ data: "EEEE", format });
  });
});

describe("attachmentToContentBlock - images and other attachments", () => {
  it("returns an image_url block with no detail by default", () => {
    expect(
      attachmentToContentBlock({
        name: "image.png",
        mime: "image/png",
        contentString: "data:image/png;base64,AAAA",
      })
    ).toEqual({
      type: "image_url",
      image_url: { url: "data:image/png;base64,AAAA" },
    });
  });

  it("adds image_url.detail only when imageDetail is provided", () => {
    expect(
      attachmentToContentBlock(
        { mime: "image/png", contentString: "data:image/png;base64,AAAA" },
        { imageDetail: "high" }
      )
    ).toEqual({
      type: "image_url",
      image_url: { url: "data:image/png;base64,AAAA", detail: "high" },
    });
  });

  it("treats non-audio, non-image attachments as image_url (existing behavior)", () => {
    expect(
      attachmentToContentBlock({
        mime: "application/pdf",
        contentString: "data:application/pdf;base64,FFFF",
      }).type
    ).toBe("image_url");
  });
});

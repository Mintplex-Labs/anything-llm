const {
  formatMessagesForTools,
} = require("../../../../../../utils/agents/aibitat/providers/helpers/tooled.js");

describe("formatMessagesForTools attachment content (native tool path)", () => {
  it("sends audio attachments as input_audio and keeps images as image_url", () => {
    const [formatted] = formatMessagesForTools([
      {
        role: "user",
        content: "transcribe this",
        attachments: [
          {
            name: "clip.mp3",
            mime: "audio/mpeg",
            contentString: "data:audio/mpeg;base64,BBBB",
          },
          {
            name: "image.png",
            mime: "image/png",
            contentString: "data:image/png;base64,AAAA",
          },
        ],
      },
    ]);

    expect(formatted.content[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "BBBB", format: "mp3" },
    });
    expect(formatted.content[2]).toEqual({
      type: "image_url",
      image_url: { url: "data:image/png;base64,AAAA" },
    });
  });

  it("detects audio from the data URI when mime is absent", () => {
    const [formatted] = formatMessagesForTools([
      {
        role: "user",
        content: "hi",
        attachments: [{ contentString: "data:audio/wav;base64,DDDD" }],
      },
    ]);

    expect(formatted.content[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "DDDD", format: "wav" },
    });
  });
});

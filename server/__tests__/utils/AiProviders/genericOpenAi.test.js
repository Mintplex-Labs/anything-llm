/* eslint-env jest, node */

describe("GenericOpenAiLLM attachment content generation", () => {
  let GenericOpenAiLLM;

  beforeAll(() => {
    process.env.GENERIC_OPEN_AI_BASE_PATH = "http://127.0.0.1:1234/v1";
    process.env.GENERIC_OPEN_AI_MODEL_PREF = "test-model";
    ({
      GenericOpenAiLLM,
    } = require("../../../utils/AiProviders/genericOpenAi"));
  });

  const lastMessage = (messages) => messages[messages.length - 1];
  const newLLM = () => new GenericOpenAiLLM({}, "test-model");

  it("returns the plain prompt string when there are no attachments", () => {
    const messages = newLLM().constructPrompt({ userPrompt: "hello" });
    expect(lastMessage(messages).content).toBe("hello");
  });

  it("sends image attachments as image_url content", () => {
    const messages = newLLM().constructPrompt({
      userPrompt: "describe this",
      attachments: [
        {
          name: "photo.png",
          mime: "image/png",
          contentString: "data:image/png;base64,aW1hZ2U=",
        },
      ],
    });
    expect(lastMessage(messages).content).toEqual([
      { type: "text", text: "describe this" },
      {
        type: "image_url",
        image_url: { url: "data:image/png;base64,aW1hZ2U=", detail: "high" },
      },
    ]);
  });

  it("sends audio attachments as input_audio without the data uri prefix", () => {
    const messages = newLLM().constructPrompt({
      userPrompt: "transcribe this",
      attachments: [
        {
          name: "clip.mp3",
          mime: "audio/mpeg",
          contentString: "data:audio/mpeg;base64,QUJDRA==",
        },
      ],
    });
    expect(lastMessage(messages).content).toEqual([
      { type: "text", text: "transcribe this" },
      { type: "input_audio", input_audio: { data: "QUJDRA==", format: "mp3" } },
    ]);
  });

  it("maps wav mime variants to the wav format", () => {
    for (const mime of ["audio/wav", "audio/x-wav", "audio/wave"]) {
      const messages = newLLM().constructPrompt({
        userPrompt: "listen",
        attachments: [
          { name: "clip.wav", mime, contentString: "data:" + mime + ";base64,UklGRg==" },
        ],
      });
      expect(lastMessage(messages).content[1]).toEqual({
        type: "input_audio",
        input_audio: { data: "UklGRg==", format: "wav" },
      });
    }
  });

  it("passes through other audio subtypes as the format", () => {
    const messages = newLLM().constructPrompt({
      userPrompt: "listen",
      attachments: [
        {
          name: "clip.ogg",
          mime: "audio/ogg",
          contentString: "data:audio/ogg;base64,T2dnUw==",
        },
      ],
    });
    expect(lastMessage(messages).content[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "T2dnUw==", format: "ogg" },
    });
  });

  it("keeps mixed image and audio attachments in order", () => {
    const messages = newLLM().constructPrompt({
      userPrompt: "both",
      attachments: [
        {
          name: "photo.jpg",
          mime: "image/jpeg",
          contentString: "data:image/jpeg;base64,aW1n",
        },
        {
          name: "clip.mp3",
          mime: "audio/mp3",
          contentString: "data:audio/mp3;base64,c25k",
        },
      ],
    });
    expect(lastMessage(messages).content).toEqual([
      { type: "text", text: "both" },
      {
        type: "image_url",
        image_url: { url: "data:image/jpeg;base64,aW1n", detail: "high" },
      },
      { type: "input_audio", input_audio: { data: "c25k", format: "mp3" } },
    ]);
  });

  it("uses the raw content string when no data uri prefix is present", () => {
    const messages = newLLM().constructPrompt({
      userPrompt: "raw",
      attachments: [
        { name: "clip.mp3", mime: "audio/mpeg", contentString: "QUJDRA==" },
      ],
    });
    expect(lastMessage(messages).content[1].input_audio.data).toBe("QUJDRA==");
  });
});

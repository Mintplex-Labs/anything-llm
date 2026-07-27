const {
  GenericOpenAiLLM,
} = require("../../../../utils/AiProviders/genericOpenAi");

function newProvider() {
  process.env.GENERIC_OPEN_AI_BASE_PATH = "http://localhost:8080/v1";
  process.env.GENERIC_OPEN_AI_MODEL_PREF = "test-model";
  return new GenericOpenAiLLM();
}

function userContent(messages) {
  return messages.find((m) => m.role === "user").content;
}

describe("GenericOpenAiLLM attachment content", () => {
  it("keeps image attachments as image_url (backward compatible)", () => {
    const provider = newProvider();
    const messages = provider.constructPrompt({
      userPrompt: "describe this",
      attachments: [
        {
          name: "image.png",
          mime: "image/png",
          contentString: "data:image/png;base64,AAAA",
        },
      ],
    });
    const content = userContent(messages);
    expect(content[1]).toEqual({
      type: "image_url",
      image_url: { url: "data:image/png;base64,AAAA", detail: "high" },
    });
  });

  it("formats audio attachments as input_audio with raw base64 + format", () => {
    const provider = newProvider();
    const messages = provider.constructPrompt({
      userPrompt: "transcribe this",
      attachments: [
        {
          name: "clip.mp3",
          mime: "audio/mpeg",
          contentString: "data:audio/mpeg;base64,BBBB",
        },
        {
          name: "clip.wav",
          mime: "audio/wav",
          contentString: "data:audio/wav;base64,CCCC",
        },
      ],
    });
    const content = userContent(messages);
    expect(content[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "BBBB", format: "mp3" },
    });
    expect(content[2]).toEqual({
      type: "input_audio",
      input_audio: { data: "CCCC", format: "wav" },
    });
  });

  it("detects audio from data URI when mime is absent", () => {
    const provider = newProvider();
    const messages = provider.constructPrompt({
      userPrompt: "hi",
      attachments: [{ contentString: "data:audio/wav;base64,DDDD" }],
    });
    expect(userContent(messages)[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "DDDD", format: "wav" },
    });
  });

  it("returns plain string when no attachments", () => {
    const provider = newProvider();
    const messages = provider.constructPrompt({ userPrompt: "hello" });
    expect(userContent(messages)).toBe("hello");
  });
});

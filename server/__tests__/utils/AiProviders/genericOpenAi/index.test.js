const {
  GenericOpenAiLLM,
} = require("../../../../utils/AiProviders/genericOpenAi");
const GenericOpenAiProvider = require("../../../../utils/agents/aibitat/providers/genericOpenAi.js");

const ORIGINAL_ENV = process.env;

function userContent(messages) {
  return messages.find((m) => m.role === "user").content;
}

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    GENERIC_OPEN_AI_BASE_PATH: "http://localhost:8080/v1",
    GENERIC_OPEN_AI_MODEL_PREF: "test-model",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("GenericOpenAiLLM attachment content", () => {
  /** @type {GenericOpenAiLLM} */
  let provider;
  beforeEach(() => (provider = new GenericOpenAiLLM()));

  it("returns plain string when no attachments", () => {
    const messages = provider.constructPrompt({ userPrompt: "hello" });
    expect(userContent(messages)).toBe("hello");
  });

  it("keeps image attachments as image_url (backward compatible)", () => {
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
    expect(userContent(messages)).toEqual([
      { type: "text", text: "describe this" },
      {
        type: "image_url",
        image_url: { url: "data:image/png;base64,AAAA", detail: "high" },
      },
    ]);
  });

  it("formats audio attachments as input_audio with raw base64 + format", () => {
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
    expect(userContent(messages)).toEqual([
      { type: "text", text: "transcribe this" },
      { type: "input_audio", input_audio: { data: "BBBB", format: "mp3" } },
      { type: "input_audio", input_audio: { data: "CCCC", format: "wav" } },
    ]);
  });

  it("preserves attachment order when mixing audio and images", () => {
    const messages = provider.constructPrompt({
      userPrompt: "what is in these",
      attachments: [
        { mime: "audio/mpeg", contentString: "data:audio/mpeg;base64,BBBB" },
        { mime: "image/png", contentString: "data:image/png;base64,AAAA" },
        { mime: "audio/wav", contentString: "data:audio/wav;base64,CCCC" },
      ],
    });
    expect(userContent(messages).map((c) => c.type)).toEqual([
      "text",
      "input_audio",
      "image_url",
      "input_audio",
    ]);
  });

  it("detects audio from data URI when mime is absent", () => {
    const messages = provider.constructPrompt({
      userPrompt: "hi",
      attachments: [{ contentString: "data:audio/wav;base64,DDDD" }],
    });
    expect(userContent(messages)[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "DDDD", format: "wav" },
    });
  });

  it("treats non-audio, non-image attachments as image_url (existing behavior)", () => {
    const messages = provider.constructPrompt({
      userPrompt: "hi",
      attachments: [
        {
          mime: "application/pdf",
          contentString: "data:application/pdf;base64,FFFF",
        },
      ],
    });
    expect(userContent(messages)[1].type).toBe("image_url");
  });
});

describe("GenericOpenAiProvider (agent) attachment content", () => {
  /** @type {GenericOpenAiProvider} */
  let provider;
  beforeEach(
    () => (provider = new GenericOpenAiProvider({ model: "test-model" }))
  );

  it("returns the message untouched when there are no attachments", () => {
    const message = { role: "user", content: "hello" };
    expect(provider.formatMessageWithAttachments(message)).toEqual(message);
    expect(
      provider.formatMessageWithAttachments({ ...message, attachments: [] })
    ).toEqual({ ...message, attachments: [] });
  });

  it("sends audio attachments as input_audio on the agent path", () => {
    const formatted = provider.formatMessageWithAttachments({
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
    });
    expect(formatted).toEqual({
      role: "user",
      content: [
        { type: "text", text: "transcribe this" },
        { type: "input_audio", input_audio: { data: "BBBB", format: "mp3" } },
        {
          type: "image_url",
          image_url: { url: "data:image/png;base64,AAAA" },
        },
      ],
    });
    expect(formatted).not.toHaveProperty("attachments");
  });

  it("detects audio from data URI when mime is absent", () => {
    const formatted = provider.formatMessageWithAttachments({
      role: "user",
      content: "hi",
      attachments: [{ contentString: "data:audio/wav;base64,DDDD" }],
    });
    expect(formatted.content[1]).toEqual({
      type: "input_audio",
      input_audio: { data: "DDDD", format: "wav" },
    });
  });
});

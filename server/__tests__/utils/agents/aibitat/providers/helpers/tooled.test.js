const {
  formatMessagesForTools,
  tooledStream,
  tooledComplete,
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

function fakeStream(chunks = []) {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        next: async () =>
          i < chunks.length
            ? { value: chunks[i++], done: false }
            : { value: undefined, done: true },
      };
    },
  };
}

describe("tooledStream/tooledComplete forward provider.temperature", () => {
  it("tooledStream includes temperature when provider.temperature is a number", async () => {
    const create = jest.fn().mockResolvedValue(fakeStream([]));
    const client = { chat: { completions: { create } } };

    await tooledStream(client, "test-model", [], [], null, {
      provider: { temperature: 0.3 },
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ temperature: 0.3 })
    );
  });

  it("tooledStream omits temperature when provider.temperature is not a number", async () => {
    const create = jest.fn().mockResolvedValue(fakeStream([]));
    const client = { chat: { completions: { create } } };

    await tooledStream(client, "test-model", [], [], null, {});

    expect(create).toHaveBeenCalled();
    expect(create.mock.calls[0][0]).not.toHaveProperty("temperature");
  });

  it("tooledComplete includes temperature when provider.temperature is a number", async () => {
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: "hello", tool_calls: [] } }],
      usage: {},
    });
    const client = { chat: { completions: { create } } };

    await tooledComplete(client, "test-model", [], [], () => 0, {
      provider: { temperature: 0.1 },
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ temperature: 0.1 })
    );
  });

  it("tooledComplete omits temperature when provider.temperature is not a number", async () => {
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: "hello", tool_calls: [] } }],
      usage: {},
    });
    const client = { chat: { completions: { create } } };

    await tooledComplete(client, "test-model", [], [], () => 0, {});

    expect(create).toHaveBeenCalled();
    expect(create.mock.calls[0][0]).not.toHaveProperty("temperature");
  });
});

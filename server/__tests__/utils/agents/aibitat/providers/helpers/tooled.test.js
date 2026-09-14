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

describe("max_tokens forwarding from the tooled maxTokens option", () => {
  const messages = [{ role: "user", content: "hi" }];

  function fakeClient({ stream = false } = {}) {
    const create = jest.fn(async () => {
      if (!stream) {
        return {
          choices: [{ message: { role: "assistant", content: "ok" } }],
          usage: null,
        };
      }
      return (async function* () {
        yield { choices: [{ delta: { content: "ok" } }] };
      })();
    });
    return { client: { chat: { completions: { create } } }, create };
  }

  it.each([
    ["a positive integer", 1024, 1024],
    ["a small budget", 7, 7],
  ])("tooledComplete forwards %s", async (_label, maxTokens, expected) => {
    const { client, create } = fakeClient();
    await tooledComplete(client, "m", messages, [], () => 0, {
      provider: {},
      maxTokens,
    });
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0].max_tokens).toBe(expected);
  });

  it.each([
    ["a positive integer", 1024, 1024],
    ["a small budget", 7, 7],
  ])("tooledStream forwards %s", async (_label, maxTokens, expected) => {
    const { client, create } = fakeClient({ stream: true });
    await tooledStream(client, "m", messages, [], null, {
      provider: {},
      maxTokens,
    });
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0].max_tokens).toBe(expected);
    expect(create.mock.calls[0][0].stream).toBe(true);
  });

  it.each([
    ["no option", undefined],
    ["null", null],
    ["a numeric string", "1024"],
    ["zero", 0],
    ["a negative number", -5],
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["a boolean", true],
  ])("omits max_tokens entirely for %s", async (_label, maxTokens) => {
    const complete = fakeClient();
    await tooledComplete(complete.client, "m", messages, [], () => 0, {
      provider: {},
      maxTokens,
    });
    expect(complete.create.mock.calls[0][0]).not.toHaveProperty("max_tokens");

    const streamed = fakeClient({ stream: true });
    await tooledStream(streamed.client, "m", messages, [], null, {
      provider: {},
      maxTokens,
    });
    expect(streamed.create.mock.calls[0][0]).not.toHaveProperty("max_tokens");
  });

  it("ignores provider.maxTokens when the option is not passed", async () => {
    const complete = fakeClient();
    await tooledComplete(complete.client, "m", messages, [], () => 0, {
      provider: { maxTokens: 1024 },
    });
    expect(complete.create.mock.calls[0][0]).not.toHaveProperty("max_tokens");

    const streamed = fakeClient({ stream: true });
    await tooledStream(streamed.client, "m", messages, [], null, {
      provider: { maxTokens: 1024 },
    });
    expect(streamed.create.mock.calls[0][0]).not.toHaveProperty("max_tokens");
  });

  it("keeps tools in the request alongside max_tokens", async () => {
    const { client, create } = fakeClient();
    const functions = [
      {
        name: "lookup",
        description: "Look something up",
        parameters: { type: "object", properties: {} },
      },
    ];
    await tooledComplete(client, "m", messages, functions, () => 0, {
      provider: {},
      maxTokens: 512,
    });
    const body = create.mock.calls[0][0];
    expect(body.max_tokens).toBe(512);
    expect(body.tools).toHaveLength(1);
    expect(body.tools[0].function.name).toBe("lookup");
  });
});

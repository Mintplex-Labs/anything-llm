const {
  createLarkTransport,
  splitLarkMarkdown,
  LARK_MESSAGE_LIMIT,
} = require("../../../utils/larkChannel/transport");
const {
  assertChannelTransport,
} = require("../../../utils/externalChannels/chat/transport");
const { createLarkChannel } = require("@larksuiteoapi/node-sdk");

const quietLogger = {
  error() {},
  warn() {},
  info() {},
  debug() {},
  trace() {},
};

function actualSdkStreamChannel({ failUpdate } = {}) {
  const snapshots = [];
  const channel = createLarkChannel({
    appId: "cli_test",
    appSecret: "test-secret",
    logger: quietLogger,
    outbound: {
      streamThrottleMs: 0,
      streamThrottleChars: 1,
      streamInitialText: "",
    },
  });
  Object.assign(channel.sender, {
    createCardInstance: jest.fn(async () => "card_1"),
    sendCardByReference: jest.fn(async () => "om_stream"),
    updateCardElementContent: jest.fn(async (_cardId, _elementId, content) => {
      if (failUpdate) throw failUpdate;
      snapshots.push(content);
    }),
    finishStreamingCard: jest.fn(async () => {}),
    sendOneWithFallback: jest.fn(async () => "om_stream"),
    patchCard: jest.fn(async (_messageId, card) => {
      if (failUpdate) throw failUpdate;
      snapshots.push(card.body.elements[0].content);
    }),
  });
  channel.send = jest.fn().mockResolvedValue({ messageId: "om_fallback" });
  return { channel, snapshots };
}

function fakeStreamingChannel() {
  const snapshots = [];
  const controller = {
    update: jest.fn(async (card) =>
      snapshots.push(card.body.elements[0].content)
    ),
  };
  const channel = {
    send: jest.fn().mockResolvedValue({ messageId: "om_send" }),
    stream: jest.fn(async (_chatId, input) => input.card.producer(controller)),
  };
  return { channel, snapshots, controller };
}

test("streams ordered chunks and completes one reply to the source group message", async () => {
  const { channel, snapshots, controller } = fakeStreamingChannel();
  const transport = createLarkTransport({
    channel,
    message: {
      chatId: "oc_1",
      messageId: "om_1",
      chatType: "group",
    },
  });

  await transport.start();
  await transport.append("hello ");
  await transport.append("world");
  await transport.complete({ text: "hello world", sources: [] });

  expect(channel.stream).toHaveBeenCalledTimes(1);
  expect(channel.stream).toHaveBeenCalledWith(
    "oc_1",
    {
      card: {
        initial: expect.any(Object),
        producer: expect.any(Function),
      },
    },
    { replyTo: "om_1" }
  );
  expect(
    controller.update.mock.calls.map(([card]) => card.body.elements[0].content)
  ).toEqual(["hello ", "hello world"]);
  expect(snapshots.at(-1)).toBe("hello world");
});

test("preserves repeated and overlapping deltas through the actual SDK stream", async () => {
  const { channel, snapshots } = actualSdkStreamChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.append("ha");
  await transport.append("ha");
  await transport.append("ab");
  await transport.append("bc");
  await transport.complete({ text: "hahaabbc" });

  expect(snapshots.at(-1)).toBe("hahaabbc");
});

test("falls back after an actual SDK card update failure following card creation", async () => {
  const failure = {
    code: "permission_denied",
    message: "secret update response",
    response: { data: "raw card body" },
  };
  const { channel } = actualSdkStreamChannel({ failUpdate: failure });
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.append("complete answer");
  await transport.complete({ text: "complete answer" });

  expect(channel.sender.sendOneWithFallback).toHaveBeenCalledTimes(1);
  expect(channel.send).toHaveBeenCalledWith(
    "oc_1",
    { markdown: "complete answer" },
    { replyTo: "om_1" }
  );
  expect(JSON.stringify(channel.send.mock.calls)).not.toMatch(
    /secret update response|raw card body/
  );
});

test("cancel closes an active SDK stream and suppresses later transport effects", async () => {
  const { channel, snapshots } = actualSdkStreamChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.append("partial answer");
  await transport.cancel();
  expect(snapshots.at(-1)).toBe("partial answer");

  const updateCount = channel.sender.patchCard.mock.calls.length;
  const sendCount = channel.send.mock.calls.length;
  await transport.append("late chunk");
  await transport.status("late status");
  await transport.artifact({ filename: "late.txt" });
  await transport.complete({ text: "late completion" });

  expect(channel.sender.patchCard).toHaveBeenCalledTimes(updateCount);
  expect(channel.send).toHaveBeenCalledTimes(sendCount);
});

test("implements the complete shared channel transport contract", () => {
  const { channel } = fakeStreamingChannel();

  expect(() =>
    assertChannelTransport(
      createLarkTransport({
        channel,
        message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
      })
    )
  ).not.toThrow();
});

test("delivers status and safe artifact labels as readable fallback messages", async () => {
  const channel = {
    send: jest.fn().mockResolvedValue({ messageId: "om_send" }),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  await transport.status("Checking sources");
  await transport.artifact({
    kind: "file",
    filename: "/private/internal/report.txt",
    content: "sensitive file contents",
  });

  expect(channel.send.mock.calls).toEqual([
    ["ou_1", { markdown: "Checking sources" }, {}],
    ["ou_1", { markdown: "Generated artifact: report.txt" }, {}],
  ]);
  expect(JSON.stringify(channel.send.mock.calls)).not.toMatch(
    /private\/internal|sensitive file contents/
  );
});

test("finalizes an active stream with the public failure message", async () => {
  const { channel, snapshots } = fakeStreamingChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.fail("Sorry, something went wrong.");

  expect(snapshots).toEqual(["Sorry, something went wrong."]);
});

test("does not turn a direct-message response into a reply thread", async () => {
  const { channel } = fakeStreamingChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  await transport.start();
  await transport.complete({ text: "hello" });

  expect(channel.stream).toHaveBeenCalledWith("ou_1", expect.any(Object), {});
});

test("replaces streamed draft text with a differing final agent response", async () => {
  const { channel, snapshots, controller } = fakeStreamingChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.append("draft");
  await transport.complete({ text: "final answer", agent: true });

  expect(controller.update.mock.calls.at(-1)[0].body.elements[0].content).toBe(
    "final answer"
  );
  expect(snapshots.at(-1)).toBe("final answer");
});

test("splits fallback Markdown on readable boundaries without losing content", () => {
  const text = `${"a".repeat(1900)}\n\n${"b".repeat(1900)}\n${"c".repeat(
    1900
  )}`;

  const chunks = splitLarkMarkdown(text);

  expect(chunks.length).toBeGreaterThan(1);
  expect(chunks.every((chunk) => chunk.length <= LARK_MESSAGE_LIMIT)).toBe(
    true
  );
  expect(chunks.join("")).toBe(text);
  expect(chunks[0].endsWith("\n\n")).toBe(true);
});

test("never lets a selected newline separator exceed the fallback limit", () => {
  const text = `${"a".repeat(LARK_MESSAGE_LIMIT - 1)}\n\nb`;

  const chunks = splitLarkMarkdown(text);

  expect(chunks.every((chunk) => chunk.length <= LARK_MESSAGE_LIMIT)).toBe(
    true
  );
  expect(chunks.join("")).toBe(text);
});

test("sends bounded Markdown sequentially when streaming is unavailable", async () => {
  const sent = [];
  const channel = {
    send: jest.fn(async (_to, input) => {
      sent.push(input.markdown ?? input.text);
      return { messageId: `om_${sent.length}` };
    }),
  };
  const text = `${"first ".repeat(600)}\n\n${"second ".repeat(600)}`;
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.append(text);
  await transport.complete({ text });

  expect(sent.join("")).toBe(text);
  expect(sent.every((chunk) => chunk.length <= LARK_MESSAGE_LIMIT)).toBe(true);
  expect(
    channel.send.mock.calls.every(([, , options]) => options.replyTo === "om_1")
  ).toBe(true);
  expect(channel.send.mock.invocationCallOrder).toEqual(
    [...channel.send.mock.invocationCallOrder].sort((a, b) => a - b)
  );
});

test.each(["permission_denied", "format_error"])(
  "falls back to bounded sends when streaming fails with %s",
  async (code) => {
    const channel = {
      stream: jest.fn().mockRejectedValue({
        code,
        message: "sensitive SDK response",
        response: { data: "raw body" },
      }),
      send: jest.fn().mockResolvedValue({ messageId: "om_fallback" }),
    };
    const transport = createLarkTransport({
      channel,
      message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    });

    await transport.start();
    await transport.append("fallback answer");
    await transport.complete({ text: "fallback answer" });

    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { markdown: "fallback answer" },
      { replyTo: "om_1" }
    );
  }
);

test("degrades a rejected Markdown chunk to readable plain text", async () => {
  const channel = {
    send: jest
      .fn()
      .mockRejectedValueOnce({ code: "format_error", message: "raw response" })
      .mockResolvedValueOnce({ messageId: "om_text" }),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  await transport.complete({ text: "**readable**" });

  expect(channel.send.mock.calls).toEqual([
    ["ou_1", { markdown: "**readable**" }, {}],
    ["ou_1", { text: "**readable**" }, {}],
  ]);
});

test("sanitizes non-fallback SDK errors", async () => {
  const channel = {
    stream: jest.fn().mockRejectedValue({
      code: "not_connected",
      message: "secret response detail",
      response: { data: "raw body" },
    }),
    send: jest.fn(),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  await transport.start();
  await expect(transport.complete({ text: "answer" })).rejects.toMatchObject({
    message: "not_connected",
    code: "not_connected",
  });
  await expect(transport.complete({ text: "answer" })).rejects.not.toThrow(
    /secret response detail|raw body/
  );
});

test("denies approval safely and directs the user to the web UI without a callback", async () => {
  const channel = {
    send: jest.fn().mockResolvedValue({ messageId: "om_notice" }),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  await expect(
    transport.requestToolApproval({
      requestId: "req_1",
      skillName: "write",
      payload: { token: "sensitive-tool-payload" },
    })
  ).resolves.toEqual({
    approved: false,
    message: "Tool approval is unavailable in Lark. Retry in the web UI.",
  });
  expect(channel.send).toHaveBeenCalledWith(
    "ou_1",
    { markdown: "Tool approval is unavailable in Lark. Retry in the web UI." },
    {}
  );
  expect(JSON.stringify(channel.send.mock.calls)).not.toContain(
    "sensitive-tool-payload"
  );
});

test("shows a minimal approval card before invoking the approval callback", async () => {
  const onToolApproval = jest.fn().mockResolvedValue({ approved: true });
  const channel = {
    send: jest.fn().mockResolvedValue({ messageId: "om_card" }),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    onToolApproval,
  });
  const request = {
    requestId: "req_1",
    skillName: "write",
    description: "Create a file",
    payload: { content: "sensitive file contents" },
  };

  await expect(transport.requestToolApproval(request)).resolves.toEqual({
    approved: true,
  });

  expect(channel.send).toHaveBeenCalledWith(
    "oc_1",
    { card: expect.any(Object) },
    { replyTo: "om_1" }
  );
  expect(onToolApproval).toHaveBeenCalledWith(request);
  expect(JSON.stringify(channel.send.mock.calls)).not.toContain(
    "sensitive file contents"
  );
});

test.each(["format_error", "permission_denied"])(
  "denies safely with text fallback when an approval card fails with %s",
  async (code) => {
    const onToolApproval = jest.fn();
    const channel = {
      send: jest
        .fn()
        .mockRejectedValueOnce({ code, message: "raw card response" })
        .mockResolvedValueOnce({ messageId: "om_text" }),
    };
    const transport = createLarkTransport({
      channel,
      message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
      onToolApproval,
    });

    await expect(
      transport.requestToolApproval({ requestId: "req_1", skillName: "write" })
    ).resolves.toMatchObject({ approved: false });

    expect(channel.send).toHaveBeenLastCalledWith(
      "ou_1",
      {
        markdown: "Tool approval is unavailable in Lark. Retry in the web UI.",
      },
      {}
    );
    expect(onToolApproval).not.toHaveBeenCalled();
  }
);

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

function highLevelSdkChannel({ send, updateCard, recallMessage } = {}) {
  const snapshots = [];
  const channel = createLarkChannel({
    appId: "cli_test",
    appSecret: "test-secret",
    logger: quietLogger,
  });
  channel.send = jest.fn(
    send ||
      (async (_to, input) => ({
        messageId: input.card ? "om_card" : "om_fallback",
      }))
  );
  channel.updateCard = jest.fn(async (messageId, card) => {
    if (updateCard) await updateCard(messageId, card);
    snapshots.push(card.body.elements[0].content);
  });
  channel.recallMessage = jest.fn(async (messageId) => {
    if (recallMessage) await recallMessage(messageId);
  });
  channel.stream = jest.fn(() => {
    throw new Error("SDK-owned streaming must not be used");
  });
  return { channel, snapshots };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

test("shows progressive cumulative output before completion and replies in the group", async () => {
  jest.useFakeTimers();
  try {
    const { channel, snapshots } = highLevelSdkChannel();
    const transport = createLarkTransport({
      channel,
      message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    });

    await transport.start();
    await transport.append("hello");
    await jest.advanceTimersByTimeAsync(100);

    expect(snapshots).toEqual(["hello"]);
    expect(channel.send).toHaveBeenNthCalledWith(
      1,
      "oc_1",
      { card: expect.any(Object) },
      { replyTo: "om_1" }
    );

    await transport.append(" world");
    await transport.complete({ text: "hello world", sources: [] });

    expect(snapshots).toEqual(["hello", "hello world"]);
    expect(channel.stream).not.toHaveBeenCalled();
  } finally {
    jest.useRealTimers();
  }
});

test("complete awaits the final cumulative card update", async () => {
  const updateStarted = deferred();
  const finalUpdate = deferred();
  const { channel } = highLevelSdkChannel({
    updateCard: async () => {
      updateStarted.resolve();
      await finalUpdate.promise;
    },
  });
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  await transport.start();
  await transport.append("answer");
  let completed = false;
  const completion = transport.complete({ text: "answer" }).then(() => {
    completed = true;
  });
  await updateStarted.promise;
  await new Promise((resolve) => setImmediate(resolve));
  expect(completed).toBe(false);

  finalUpdate.resolve();
  await completion;
  expect(completed).toBe(true);
  expect(channel.updateCard).toHaveBeenCalledWith(
    "om_card",
    expect.objectContaining({ schema: "2.0" })
  );
});

test("throttles token deltas into one cumulative card update", async () => {
  jest.useFakeTimers();
  try {
    const { channel, snapshots } = highLevelSdkChannel();
    const transport = createLarkTransport({
      channel,
      message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
    });

    await transport.start();
    await transport.append("a");
    await transport.append("b");
    await transport.append("c");
    await jest.advanceTimersByTimeAsync(99);
    expect(snapshots).toEqual([]);

    await jest.advanceTimersByTimeAsync(1);
    expect(snapshots).toEqual(["abc"]);
    await transport.complete({ text: "abc" });
    expect(channel.updateCard).toHaveBeenCalledTimes(1);
  } finally {
    jest.useRealTimers();
  }
});

test("preserves repeated and overlapping deltas in cumulative updates", async () => {
  jest.useFakeTimers();
  try {
    const { channel, snapshots } = highLevelSdkChannel();
    const transport = createLarkTransport({
      channel,
      message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    });

    await transport.start();
    await transport.append("ha");
    await transport.append("ha");
    await transport.append("ab");
    await transport.append("bc");
    await jest.advanceTimersByTimeAsync(100);
    await transport.complete({ text: "hahaabbc" });

    expect(snapshots.at(-1)).toBe("hahaabbc");
  } finally {
    jest.useRealTimers();
  }
});

test("handles an intermediate update failure and sends one complete fallback", async () => {
  jest.useFakeTimers();
  const unhandledRejections = [];
  const observeUnhandled = (error) => unhandledRejections.push(error);
  process.on("unhandledRejection", observeUnhandled);
  try {
    const failure = {
      code: "permission_denied",
      message: "secret update response",
      response: { data: "raw card body" },
    };
    const { channel } = highLevelSdkChannel({
      updateCard: async () => {
        throw failure;
      },
      recallMessage: async () => {
        throw new Error("secret cleanup response");
      },
    });
    const transport = createLarkTransport({
      channel,
      message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    });

    await transport.start();
    await transport.append("partial");
    await jest.advanceTimersByTimeAsync(100);
    await transport.append(" complete answer");
    await transport.complete({ text: "partial complete answer" });
    await Promise.resolve();

    expect(unhandledRejections).toEqual([]);
    expect(channel.updateCard).toHaveBeenCalledTimes(1);
    expect(channel.recallMessage).toHaveBeenCalledWith("om_card");
    expect(channel.send.mock.calls).toEqual([
      ["oc_1", { card: expect.any(Object) }, { replyTo: "om_1" }],
      ["oc_1", { markdown: "partial complete answer" }, { replyTo: "om_1" }],
    ]);
    expect(JSON.stringify(channel.send.mock.calls)).not.toMatch(
      /secret update response|raw card body|secret cleanup response/
    );
  } finally {
    process.removeListener("unhandledRejection", observeUnhandled);
    jest.useRealTimers();
  }
});

test("cancel waits for an in-flight update, clears queued work, and finalizes the card", async () => {
  jest.useFakeTimers();
  try {
    const firstUpdate = deferred();
    let updateCount = 0;
    const { channel, snapshots } = highLevelSdkChannel({
      updateCard: async () => {
        updateCount += 1;
        if (updateCount === 1) await firstUpdate.promise;
      },
    });
    const transport = createLarkTransport({
      channel,
      message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    });

    await transport.start();
    await transport.append("partial");
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    await transport.append(" queued");
    let cancelled = false;
    const cancellation = transport.cancel().then(() => {
      cancelled = true;
    });
    await Promise.resolve();
    expect(cancelled).toBe(false);

    firstUpdate.resolve();
    await cancellation;
    expect(snapshots).toEqual(["partial", "Generation cancelled."]);
    const callsAfterCancellation = channel.updateCard.mock.calls.length;
    await jest.advanceTimersByTimeAsync(100);
    expect(channel.updateCard).toHaveBeenCalledTimes(callsAfterCancellation);

    const sendCount = channel.send.mock.calls.length;
    const updateCalls = channel.updateCard.mock.calls.length;
    await transport.append("late chunk");
    await transport.status("late status");
    await transport.artifact({ filename: "late.txt" });
    await transport.complete({ text: "late completion" });
    expect(channel.send).toHaveBeenCalledTimes(sendCount);
    expect(channel.updateCard).toHaveBeenCalledTimes(updateCalls);
  } finally {
    jest.useRealTimers();
  }
});

test("cancel during a bounded send suppresses every later chunk", async () => {
  const firstSend = deferred();
  const channel = {
    send: jest
      .fn()
      .mockImplementationOnce(() => firstSend.promise)
      .mockResolvedValue({ messageId: "om_late" }),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });
  const text = "a".repeat(LARK_MESSAGE_LIMIT + 1);

  const completion = transport.complete({ text });
  await new Promise((resolve) => setImmediate(resolve));
  expect(channel.send).toHaveBeenCalledTimes(1);
  await transport.cancel();
  firstSend.resolve({ messageId: "om_first" });
  await completion;

  expect(channel.send).toHaveBeenCalledTimes(1);
});

test("cancel during a rejected Markdown send suppresses the plain-text retry", async () => {
  const markdownSend = deferred();
  const channel = {
    send: jest
      .fn()
      .mockImplementationOnce(() => markdownSend.promise)
      .mockResolvedValue({ messageId: "om_late" }),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  const completion = transport.complete({ text: "**answer**" });
  await new Promise((resolve) => setImmediate(resolve));
  expect(channel.send).toHaveBeenCalledTimes(1);
  await transport.cancel();
  markdownSend.reject({ code: "format_error", message: "private failure" });
  await completion;

  expect(channel.send).toHaveBeenCalledTimes(1);
});

test("implements the complete shared channel transport contract", () => {
  const { channel } = highLevelSdkChannel();

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
  const { channel, snapshots } = highLevelSdkChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.fail("Sorry, something went wrong.");

  expect(snapshots).toEqual(["Sorry, something went wrong."]);
});

test("does not turn a direct-message response into a reply thread", async () => {
  const { channel } = highLevelSdkChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "ou_1", messageId: "om_1", chatType: "p2p" },
  });

  await transport.start();
  await transport.complete({ text: "hello" });

  expect(channel.send).toHaveBeenCalledWith(
    "ou_1",
    { card: expect.any(Object) },
    {}
  );
});

test("replaces streamed draft text with a differing final agent response", async () => {
  const { channel, snapshots } = highLevelSdkChannel();
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
  });

  await transport.start();
  await transport.append("draft");
  await transport.complete({ text: "final answer", agent: true });

  expect(channel.updateCard.mock.calls.at(-1)[1].body.elements[0].content).toBe(
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
      updateCard: jest.fn(),
      send: jest
        .fn()
        .mockRejectedValueOnce({
          code,
          message: "sensitive SDK response",
          response: { data: "raw body" },
        })
        .mockResolvedValueOnce({ messageId: "om_fallback" }),
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
    updateCard: jest.fn(),
    send: jest.fn().mockRejectedValue({
      code: "not_connected",
      message: "secret response detail",
      response: { data: "raw body" },
    }),
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

test("cancel during a successful approval-card send suppresses the callback", async () => {
  const cardSend = deferred();
  const onToolApproval = jest.fn().mockResolvedValue({ approved: true });
  const channel = { send: jest.fn(() => cardSend.promise) };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    onToolApproval,
  });

  const approval = transport.requestToolApproval({
    requestId: "req_1",
    skillName: "write",
  });
  await new Promise((resolve) => setImmediate(resolve));
  expect(channel.send).toHaveBeenCalledTimes(1);
  await transport.cancel();
  cardSend.resolve({ messageId: "om_card" });

  await expect(approval).resolves.toMatchObject({ approved: false });
  expect(onToolApproval).not.toHaveBeenCalled();
  expect(channel.send).toHaveBeenCalledTimes(1);
});

test("cancel during a rejected approval-card send suppresses its fallback", async () => {
  const cardSend = deferred();
  const onToolApproval = jest.fn().mockResolvedValue({ approved: true });
  const channel = {
    send: jest
      .fn()
      .mockImplementationOnce(() => cardSend.promise)
      .mockResolvedValue({ messageId: "om_late" }),
  };
  const transport = createLarkTransport({
    channel,
    message: { chatId: "oc_1", messageId: "om_1", chatType: "group" },
    onToolApproval,
  });

  const approval = transport.requestToolApproval({
    requestId: "req_1",
    skillName: "write",
  });
  await new Promise((resolve) => setImmediate(resolve));
  expect(channel.send).toHaveBeenCalledTimes(1);
  await transport.cancel();
  cardSend.reject({ code: "format_error", message: "private failure" });

  await expect(approval).resolves.toMatchObject({ approved: false });
  expect(onToolApproval).not.toHaveBeenCalled();
  expect(channel.send).toHaveBeenCalledTimes(1);
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

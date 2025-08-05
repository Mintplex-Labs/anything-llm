/* eslint-env jest */
const moment = require("moment");
const {
  convertToChatHistory,
  convertToPromptHistory,
} = require("../../../utils/helpers/chat/responses");

describe("convertToChatHistory", () => {
  test("processes valid history records", () => {
    const createdAt = Date.now();
    const history = [
      {
        id: 1,
        prompt: "Hello",
        response: JSON.stringify({ text: "Hi", sources: [], attachments: [], metrics: {} }),
        createdAt,
        feedbackScore: 2,
      },
    ];

    const result = convertToChatHistory(history);
    expect(result).toEqual([
      {
        role: "user",
        content: "Hello",
        sentAt: moment(createdAt).unix(),
        attachments: [],
        chatId: 1,
      },
      {
        type: "chart",
        role: "assistant",
        content: "Hi",
        sources: [],
        chatId: 1,
        sentAt: moment(createdAt).unix(),
        feedbackScore: 2,
        metrics: {},
      },
    ]);
  });

  test("skips records with malformed response JSON", () => {
    const history = [
      { id: 2, prompt: "Hello", response: "malformed", createdAt: Date.now() },
    ];
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const result = convertToChatHistory(history);
    expect(result).toEqual([]);
    expect(logSpy).toHaveBeenCalledWith(
      "[convertToChatHistory] ChatHistory #2 response is not valid JSON - skipping record."
    );
    logSpy.mockRestore();
  });
});

describe("convertToPromptHistory", () => {
  test("processes valid history records", () => {
    const history = [
      {
        id: 1,
        prompt: "Hello",
        response: JSON.stringify({ text: "Hi" }),
      },
    ];
    const result = convertToPromptHistory(history);
    expect(result).toEqual([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi" },
    ]);
  });

  test("skips records with malformed response JSON", () => {
    const history = [{ id: 3, prompt: "Hello", response: "malformed" }];
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const result = convertToPromptHistory(history);
    expect(result).toEqual([]);
    expect(logSpy).toHaveBeenCalledWith(
      "[convertToPromptHistory] ChatHistory #3 response is not valid JSON - skipping record."
    );
    logSpy.mockRestore();
  });
});

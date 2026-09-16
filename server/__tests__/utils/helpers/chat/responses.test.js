const {
  formatChatHistory,
} = require("../../../../utils/helpers/chat/responses");

const WITH_ATTACHMENT = {
  role: "user",
  content: "what is in this image?",
  attachments: [
    {
      name: "cat.png",
      mime: "image/png",
      contentString: "data:image/png;base64,SGVsbG8gV29ybGQ=",
    },
  ],
};

describe("formatChatHistory", () => {
  it("drops the internal attachments property when no formatter is given", () => {
    expect(formatChatHistory([WITH_ATTACHMENT])).toEqual([
      { role: "user", content: "what is in this image?" },
    ]);
  });

  it("returns messages without attachments untouched", () => {
    const history = [
      { role: "user", content: "hello" },
      { role: "assistant", content: "hi" },
      { role: "user", content: "still nothing", attachments: [] },
    ];

    expect(formatChatHistory(history)).toEqual(history);
  });

  it("passes an assistant turn through untouched", () => {
    // Only user turns ever carry attachments, so the assistant side is never
    // rewritten and an assistant message is returned as the same object.
    const assistant = { ...WITH_ATTACHMENT, role: "assistant" };

    expect(formatChatHistory([assistant])[0]).toBe(assistant);
  });

  it("still prefers the provider's own content formatter", () => {
    const formatter = ({ userPrompt, attachments }) => [
      { type: "text", text: userPrompt },
      ...attachments.map((a) => ({
        type: "image_url",
        image_url: a.contentString,
      })),
    ];

    expect(formatChatHistory([WITH_ATTACHMENT], formatter)).toEqual([
      {
        role: "user",
        content: [
          { type: "text", text: "what is in this image?" },
          {
            type: "image_url",
            image_url: "data:image/png;base64,SGVsbG8gV29ybGQ=",
          },
        ],
      },
    ]);
  });
});

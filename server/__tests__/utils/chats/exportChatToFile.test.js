/* eslint-env jest, node */
const {
  sendChatHistoryFile,
} = require("../../../utils/chats/exportChatToFile");

// Exports a one-message chat as plain text and returns the assistant's reply.
async function exportedReply(text) {
  const response = { setHeader: jest.fn(), send: jest.fn() };
  const chats = [
    {
      id: 1,
      prompt: "Which types should I use?",
      response: JSON.stringify({ text, sources: [], attachments: [] }),
      createdAt: new Date(),
    },
  ];
  await sendChatHistoryFile(
    response,
    chats,
    { workspaceName: "W" },
    "plaintext"
  );
  const file = response.send.mock.calls[0][0].toString("utf-8");
  return file.split("[Assistant]")[1].trim();
}

describe("sendChatHistoryFile", () => {
  test("keeps generic types whose names start with a wrapper tag name", async () => {
    const reply = [
      "`fetch()` returns `Promise<Response>`.",
      "A Spring controller returns `ResponseEntity<AnswerDto>`.",
      "A Rust handler returns `Result<Response, Error>`.",
      "Notes are kept in a `List<Thought>`.",
      'Render it with `<Thought text="x">body</Thought>`.',
    ].join("\n");
    expect(await exportedReply(reply)).toBe(reply);
  });

  test("removes thought blocks and wrapper tags", async () => {
    expect(await exportedReply("<answer>42</answer>")).toBe("42");
    expect(await exportedReply('<answer id="a">42</answer >')).toBe("42");
    expect(await exportedReply("<response>Hi</response>")).toBe("Hi");
    expect(
      await exportedReply(
        "<thinking>\nplan\n</thinking>\n\n<answer>Done</answer>"
      )
    ).toBe("Done");
    expect(await exportedReply('<think mode="x">a</think>B')).toBe("B");
  });
});

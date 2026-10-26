/* eslint-env jest */
const {
  messageToSpeech,
} = require("../../../utils/TextToSpeech/messageToSpeech");

describe("messageToSpeech", () => {
  test.each([
    ["<think>plan the reply</think>Final answer.", "Final answer."],
    ["<thinking>plan</thinking>Final answer.", "Final answer."],
    ["Answer.<think>cut off mid thought", "Answer."],
    ["<think>only thoughts</think>", ""],
    ["**Bold** and _italic_ and `code`", "Bold and italic and code"],
    ["Before\n```js\nconst x = 1;\n```\nAfter", "Before After"],
    ["# Title\n- one\n- two", "Title one two"],
    ["See [the docs](https://example.com) 🎉", "See the docs"],
    [undefined, ""],
  ])("%j", (input, expected) => {
    expect(messageToSpeech(input)).toBe(expected);
  });
});

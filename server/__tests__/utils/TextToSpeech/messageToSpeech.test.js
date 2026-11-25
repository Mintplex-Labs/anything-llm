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
    ["***Both*** and ___both___ and __bold__", "Both and both and bold"],
    [
      "Set `config_file_name` in my_app_settings",
      "Set config_file_name in my_app_settings",
    ],
    [
      "MAX_TOKENS_LIMIT and snake_case_name",
      "MAX_TOKENS_LIMIT and snake_case_name",
    ],
    ["(_italic_) and __init__", "(italic) and init"],
    [
      "**max_tokens** and *my_var* and ***_both_***",
      "max_tokens and my_var and both",
    ],
    ["Before\n```js\nconst x = 1;\n```\nAfter", "Before After"],
    ["# Title\n- one\n- two", "Title one two"],
    ["See [the docs](https://example.com) 🎉", "See the docs"],
    [undefined, ""],
  ])("%j", (input, expected) => {
    expect(messageToSpeech(input)).toBe(expected);
  });
});

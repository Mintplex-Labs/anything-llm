/* eslint-env jest */
const {
  BOT_COMMANDS,
  commandPattern,
} = require("../../../utils/telegramBot/utils/commands");

/**
 * Return the names of every registered command whose pattern matches the text,
 * the same way the bot decides which command handlers to run for a message.
 */
function matchedCommands(text) {
  return BOT_COMMANDS.map((c) => c.command).filter((command) =>
    commandPattern(command).test(text)
  );
}

describe("commandPattern", () => {
  describe("runs each command in its documented forms", () => {
    test.each(BOT_COMMANDS.map((c) => c.command))("/%s", (command) => {
      expect(matchedCommands(`/${command}`)).toEqual([command]);
      expect(matchedCommands(`/${command}@MyBot`)).toEqual([command]);
      expect(matchedCommands(`/${command} some args`)).toEqual([command]);
      expect(matchedCommands(`/${command}@My_Bot2 some args`)).toEqual([
        command,
      ]);
      expect(matchedCommands(`/${command}\nnext line`)).toEqual([command]);
      expect(matchedCommands(`/${command}\ttab`)).toEqual([command]);
    });

    test("passes /history arguments through with the command", () => {
      expect(matchedCommands("/history 25")).toEqual(["history"]);
    });
  });

  describe("ignores slashes that are not a leading command", () => {
    test.each([
      "summarize https://www.bbc.com/news/articles/c123",
      "see https://example.com/account/reset-password",
      "https://example.com/models",
      "https://example.com/help/start",
      "check /status on the server",
      "hello /abort",
      " /new",
      "\n/new",
    ])("%j", (text) => {
      expect(matchedCommands(text)).toEqual([]);
    });
  });

  describe("does not run a command for a longer word that starts with it", () => {
    test.each([
      "/news",
      "/newthread",
      "/models",
      "/resetall",
      "/helpme",
      "/history25",
      "/start-over",
      "/proof.",
    ])("%j", (text) => {
      expect(matchedCommands(text)).toEqual([]);
    });
  });

  describe("rejects malformed or unrelated input", () => {
    test.each(["", "/", "//new", "new", "\\new", "/@MyBot", "/unknown"])(
      "%j",
      (text) => {
        expect(matchedCommands(text)).toEqual([]);
      }
    );

    test("is case-sensitive", () => {
      expect(matchedCommands("/NEW")).toEqual([]);
      expect(matchedCommands("/Help")).toEqual([]);
    });
  });

  test("returns a fresh non-global pattern so repeated tests do not drift", () => {
    const pattern = commandPattern("new");
    expect(pattern.global).toBe(false);
    expect(pattern.test("/new")).toBe(true);
    expect(pattern.test("/new")).toBe(true);
    expect(commandPattern("new")).not.toBe(pattern);
  });
});

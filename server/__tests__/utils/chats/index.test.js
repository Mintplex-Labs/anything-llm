/* eslint-env jest, node */
const { grepCommand, grepAllSlashCommands } = require("../../../utils/chats");
const { SlashCommandPresets } = require("../../../models/slashCommandsPresets");

jest.mock("../../../models/slashCommandsPresets");

// Helper to shape preset rows the way the model returns them.
const preset = (command, prompt) => ({ command, prompt });

describe("grepCommand", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns the built-in command when the message starts with it", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([]);
    expect(await grepCommand("/reset")).toBe("/reset");
    expect(await grepCommand("/RESET now")).toBe("/reset"); // case-insensitive
  });

  it("returns the message unchanged when no command matches", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([]);
    expect(await grepCommand("hello there")).toBe("hello there");
  });

  describe("preset expansion", () => {
    beforeEach(() => {
      SlashCommandPresets.getUserPresets.mockResolvedValue([
        preset("/weather", "what is the weather?"),
      ]);
    });

    it("expands a command at the start of the message", async () => {
      expect(await grepCommand("/weather")).toBe("what is the weather?");
    });

    it("expands a command that follows other text and a space", async () => {
      expect(await grepCommand("ok, /weather")).toBe("ok, what is the weather?");
    });

    it("expands a command with trailing punctuation", async () => {
      expect(await grepCommand("/weather?")).toBe("what is the weather??");
    });

    it("does not expand a command that is part of a longer word", async () => {
      expect(await grepCommand("/weatherman")).toBe("/weatherman");
    });

    it("does not expand a command glued to the end of a word", async () => {
      expect(await grepCommand("foo/weather")).toBe("foo/weather");
    });
  });

  it("expands multiple presets in a single message", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([
      preset("/weather", "the weather"),
      preset("/time", "the time"),
    ]);
    expect(await grepCommand("/weather and /time")).toBe(
      "the weather and the time"
    );
  });

  it("scopes preset lookup to the passed user", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([]);
    await grepCommand("hi", { id: 42 });
    expect(SlashCommandPresets.getUserPresets).toHaveBeenCalledWith(42);
  });
});

describe("grepAllSlashCommands", () => {
  beforeEach(() => jest.clearAllMocks());

  it("expands presets regardless of user (not scoped)", async () => {
    SlashCommandPresets.where.mockResolvedValue([
      preset("/weather", "what is the weather?"),
    ]);
    expect(await grepAllSlashCommands("ok, /weather?")).toBe(
      "ok, what is the weather??"
    );
    expect(SlashCommandPresets.where).toHaveBeenCalledWith({});
  });

  it("does not expand a command that is part of a longer word", async () => {
    SlashCommandPresets.where.mockResolvedValue([
      preset("/weather", "what is the weather?"),
    ]);
    expect(await grepAllSlashCommands("/weatherman")).toBe("/weatherman");
  });

  it("expands multiple presets in a single message", async () => {
    SlashCommandPresets.where.mockResolvedValue([
      preset("/weather", "the weather"),
      preset("/time", "the time"),
    ]);
    expect(await grepAllSlashCommands("/weather and /time")).toBe(
      "the weather and the time"
    );
  });
});

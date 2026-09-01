/* eslint-env jest, node */
const {
  grepCommand,
  grepAllSlashCommands,
  isReservedCommand,
} = require("../../../utils/chats");
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
    expect(await grepCommand("/reset?")).toBe("/reset"); // punctuation still dispatches
  });

  it("returns the built-in command when followed by more text", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([]);
    expect(await grepCommand("/img a cat")).toBe("/img");
  });

  it("returns the message unchanged when no command matches", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([]);
    expect(await grepCommand("hello there")).toBe("hello there");
  });

  it("does not match a built-in command that is part of a longer command", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([]);
    expect(await grepCommand("/resetall")).toBe("/resetall");
    expect(await grepCommand("/reset-all")).toBe("/reset-all");
    expect(await grepCommand("/resetting my password, how?")).toBe(
      "/resetting my password, how?"
    );
    expect(await grepCommand("/imgs hello")).toBe("/imgs hello");
  });

  it("expands a preset whose command extends a built-in command name", async () => {
    SlashCommandPresets.getUserPresets.mockResolvedValue([
      preset("/reset-all", "clear every workspace"),
    ]);
    expect(await grepCommand("/reset-all")).toBe("clear every workspace");
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

describe("isReservedCommand", () => {
  it("reserves exact matches of the built-in commands", () => {
    expect(isReservedCommand("/reset")).toBe(true);
    expect(isReservedCommand("/img")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isReservedCommand("/RESET")).toBe(true);
    expect(isReservedCommand("/Img")).toBe(true);
  });

  it("allows commands that extend a built-in command name", () => {
    expect(isReservedCommand("/reset-all")).toBe(false);
    expect(isReservedCommand("/resetall")).toBe(false);
    expect(isReservedCommand("/img-gen")).toBe(false);
    expect(isReservedCommand("/imgs")).toBe(false);
  });

  it("allows unrelated commands", () => {
    expect(isReservedCommand("/weather")).toBe(false);
    expect(isReservedCommand("")).toBe(false);
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

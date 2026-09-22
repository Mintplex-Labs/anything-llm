const mockPrisma = {
  embed_configs: {
    create: jest.fn(),
    update: jest.fn(),
  },
};
jest.mock("../../utils/prisma", () => mockPrisma);

const { EmbedConfig } = require("../../models/embedConfig");

const stored = (call) => call.mock.calls[0][0].data;

describe("EmbedConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockPrisma.embed_configs.create.mockImplementation(async ({ data }) => ({
      id: 1,
      uuid: "test-uuid",
      ...data,
    }));
    mockPrisma.embed_configs.update.mockImplementation(async ({ data }) => ({
      id: 1,
      ...data,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("allowlist_domains validation", () => {
    const create = async (allowlist_domains) => {
      await EmbedConfig.new({ workspace_id: 1, allowlist_domains });
      return stored(mockPrisma.embed_configs.create).allowlist_domains;
    };

    it("accepts a comma-separated string from the settings form", async () => {
      expect(await create("example.com,other.com")).toBe(
        JSON.stringify(["https://example.com", "https://other.com"])
      );
    });

    it("accepts the documented array shape from the API", async () => {
      expect(await create(["example.com"])).toBe(
        JSON.stringify(["https://example.com"])
      );
    });

    it("preserves an explicit protocol on array entries", async () => {
      expect(await create(["http://a.com", "https://b.com/path"])).toBe(
        JSON.stringify(["http://a.com", "https://b.com/path"])
      );
    });

    it("drops non-string entries without discarding the rest of the list", async () => {
      expect(await create(["example.com", 5, null, {}, ["nested"]])).toBe(
        JSON.stringify(["https://example.com"])
      );
    });

    it("drops entries that are not valid URLs but keeps the valid ones", async () => {
      expect(await create(["example.com", "not a url", ""])).toBe(
        JSON.stringify(["https://example.com"])
      );
    });

    it("stores null for an empty array", async () => {
      expect(await create([])).toBeNull();
    });

    it.each([
      ["null", null],
      ["undefined", undefined],
      ["empty string", ""],
      ["number", 5],
      ["boolean", true],
      ["plain object", {}],
      ["array-like object", { 0: "example.com", length: 1 }],
    ])("stores null for %s", async (_label, input) => {
      expect(await create(input)).toBeNull();
    });

    it("stores an empty list (deny-all) when every entry is invalid", async () => {
      expect(await create("not a url")).toBe(JSON.stringify([]));
    });

    it("applies the same validation on update", async () => {
      const result = await EmbedConfig.update(1, {
        allowlist_domains: ["example.com"],
      });
      expect(result).toEqual({ success: true, error: null });
      expect(stored(mockPrisma.embed_configs.update).allowlist_domains).toBe(
        JSON.stringify(["https://example.com"])
      );
    });
  });

  describe("chat_mode validation", () => {
    it.each(["chat", "query"])("accepts %s", async (mode) => {
      await EmbedConfig.new({ workspace_id: 1, chat_mode: mode });
      expect(stored(mockPrisma.embed_configs.create).chat_mode).toBe(mode);
    });

    it.each([
      ["automatic", "automatic"],
      ["undefined", undefined],
      ["number", 1],
    ])("falls back to query for %s", async (_label, mode) => {
      await EmbedConfig.new({ workspace_id: 1, chat_mode: mode });
      expect(stored(mockPrisma.embed_configs.create).chat_mode).toBe("query");
    });
  });

  describe("boolean and number validation", () => {
    it("only accepts real booleans for override flags", async () => {
      await EmbedConfig.new({
        workspace_id: 1,
        allow_model_override: true,
        allow_temperature_override: "true",
        allow_prompt_override: 1,
      });
      const data = stored(mockPrisma.embed_configs.create);
      expect(data.allow_model_override).toBe(true);
      expect(data.allow_temperature_override).toBe(false);
      expect(data.allow_prompt_override).toBe(false);
    });

    it.each([
      ["positive integer", 100, 100],
      ["numeric string", "5", 5],
      ["zero", 0, null],
      ["negative", -1, null],
      ["NaN", NaN, null],
      ["non-numeric string", "abc", null],
    ])("normalizes %s for max_chats_per_day", async (_label, input, expected) => {
      await EmbedConfig.new({ workspace_id: 1, max_chats_per_day: input });
      expect(stored(mockPrisma.embed_configs.create).max_chats_per_day).toBe(
        expected
      );
    });
  });

  describe("update", () => {
    it("throws when no embed id is given", async () => {
      await expect(EmbedConfig.update(null, { enabled: false })).rejects.toThrow(
        "No embed id provided for update"
      );
    });

    it("ignores keys that are not writable", async () => {
      await EmbedConfig.update(1, { enabled: false, uuid: "hijack", id: 99 });
      expect(stored(mockPrisma.embed_configs.update)).toEqual({
        enabled: false,
      });
    });

    it("returns a message and skips prisma when no writable keys are present", async () => {
      const result = await EmbedConfig.update(1, { uuid: "hijack" });
      expect(result).toEqual({
        embed: { id: 1 },
        message: "No valid fields to update!",
      });
      expect(mockPrisma.embed_configs.update).not.toHaveBeenCalled();
    });

    it("surfaces prisma errors instead of throwing", async () => {
      mockPrisma.embed_configs.update.mockRejectedValueOnce(
        new Error("db down")
      );
      const result = await EmbedConfig.update(1, { enabled: false });
      expect(result).toEqual({ success: false, error: "db down" });
    });
  });

  describe("parseAllowedHosts", () => {
    it("returns null when no allowlist is set", () => {
      expect(EmbedConfig.parseAllowedHosts({ allowlist_domains: null })).toBeNull();
    });

    it("parses a stored JSON list", () => {
      expect(
        EmbedConfig.parseAllowedHosts({
          allowlist_domains: JSON.stringify(["https://example.com"]),
        })
      ).toEqual(["https://example.com"]);
    });

    it("returns an empty (deny-all) list for corrupt JSON", () => {
      expect(
        EmbedConfig.parseAllowedHosts({ id: 1, allowlist_domains: "{not json" })
      ).toEqual([]);
    });
  });
});

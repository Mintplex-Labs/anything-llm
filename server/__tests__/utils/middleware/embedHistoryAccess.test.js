const { v4: uuidv4 } = require("uuid");

jest.mock("../../../utils/chats/stream", () => ({
  VALID_CHAT_MODE: ["chat", "query"],
}));
jest.mock("../../../models/embedChats", () => ({ EmbedChats: {} }));
jest.mock("../../../models/embedConfig", () => ({
  EmbedConfig: {
    parseAllowedHosts: (embed) =>
      embed.allowlist_domains
        ? embed.allowlist_domains.split(",").map((h) => h.trim())
        : null,
  },
}));

const {
  canAccessHistory,
} = require("../../../utils/middleware/embedMiddleware");

function run({ embed, origin, sessionId = uuidv4() }) {
  const next = jest.fn();
  const response = {
    locals: { embedConfig: embed },
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    end: jest.fn(),
  };
  const request = { headers: { origin }, params: { sessionId } };
  canAccessHistory(request, response, next);
  return { next, response };
}

describe("canAccessHistory middleware", () => {
  afterEach(() => delete process.env.EMBED_REQUIRE_ALLOWLIST);

  it("allows an enabled embed with no allowlist", () => {
    const { next } = run({ embed: { enabled: true } });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("allows a request from an allowlisted origin", () => {
    const { next } = run({
      embed: { enabled: true, allowlist_domains: "https://a.com" },
      origin: "https://a.com",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 503 when the embed is disabled", () => {
    const { next, response } = run({ embed: { enabled: false } });
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(503);
  });

  it("returns 401 when the origin is not allowlisted", () => {
    const { next, response } = run({
      embed: { enabled: true, allowlist_domains: "https://a.com" },
      origin: "https://evil.com",
    });
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 with no allowlist when EMBED_REQUIRE_ALLOWLIST is set", () => {
    process.env.EMBED_REQUIRE_ALLOWLIST = "1";
    const { next, response } = run({ embed: { enabled: true } });
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns 404 for a malformed sessionId", () => {
    const { next, response } = run({
      embed: { enabled: true },
      sessionId: "not-a-uuid",
    });
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
  });
});

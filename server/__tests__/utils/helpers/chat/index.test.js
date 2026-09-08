// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));
// `convertToPromptHistory` lazy-requires `utils/files`, which needs STORAGE_DIR and
// the prisma client at require time. The compressors only touch generated-image
// attachment lookups through it, which none of these fixtures use.
jest.mock("../../../../utils/files", () => ({
  generatedImageAttachments: () => [],
}));

const {
  fillSourceWindow,
  messageArrayCompressor,
  messageStringCompressor,
} = require("../../../../utils/helpers/chat");
const { TokenManager } = require("../../../../utils/helpers/tiktoken");

const CANNONBALL_MARKER = "--prompt truncated for brevity--";
const tm = new TokenManager("gpt-4o");

// Build a string of roughly `n` tokens with a distinctive label baked in.
function tokensOfText(label, n) {
  return `${label} ${"alpha bravo charlie delta ".repeat(Math.ceil(n / 4))}`;
}

// history records exactly as `recentChatHistory` produces them: oldest first.
function makeHistoryRecord(n, { size = 40, sources = [] } = {}) {
  return {
    id: n,
    prompt: tokensOfText(`USER TURN ${n}:`, size),
    response: JSON.stringify({
      text: tokensOfText(`ASSISTANT TURN ${n}:`, size),
      sources,
      attachments: [],
    }),
  };
}

function makeSource(id, extra = {}) {
  return { id, score: 0.5, text: `text-${id}`, ...extra };
}

function chatWithSources(sources) {
  return { response: JSON.stringify({ sources }) };
}

const turnsIn = (messages) =>
  messages
    .filter((m) => m.role !== "system")
    .map((m) => `${m.role}:${(m.content.match(/TURN (\d+)/) || [])[1]}`);

beforeAll(() => jest.spyOn(console, "log").mockImplementation(() => {}));
afterAll(() => console.log.mockRestore());

describe("fillSourceWindow", () => {
  describe("input safety", () => {
    it("leaves the caller's history array in its original order", () => {
      const history = [
        chatWithSources([makeSource("oldest")]),
        chatWithSources([makeSource("middle")]),
        chatWithSources([makeSource("newest")]),
      ];
      const before = history.map((chat) => chat.response);

      fillSourceWindow({ nDocs: 4, searchResults: [], history });

      expect(history.map((chat) => chat.response)).toEqual(before);
    });

    it("returns a new sources array instead of the caller's searchResults", () => {
      const searchResults = [makeSource("a")];
      const full = fillSourceWindow({ nDocs: 1, searchResults, history: [] });
      const backfilled = fillSourceWindow({
        nDocs: 2,
        searchResults,
        history: [chatWithSources([makeSource("b")])],
      });

      expect(full.sources).not.toBe(searchResults);
      expect(backfilled.sources).not.toBe(searchResults);
      expect(searchResults).toEqual([makeSource("a")]);
    });
  });

  describe("window filling", () => {
    it("backfills from the most recent chat first", () => {
      const { sources } = fillSourceWindow({
        nDocs: 2,
        searchResults: [],
        history: [
          chatWithSources([makeSource("oldest")]),
          chatWithSources([makeSource("middle")]),
          chatWithSources([makeSource("newest")]),
        ],
      });

      expect(sources.map((s) => s.id)).toEqual(["newest", "middle"]);
    });

    it("does not backfill when searchResults already fill the window", () => {
      const searchResults = [makeSource("a"), makeSource("b")];
      const { sources, contextTexts } = fillSourceWindow({
        nDocs: 2,
        searchResults,
        history: [chatWithSources([makeSource("history-source")])],
      });

      expect(sources).toEqual(searchResults);
      expect(contextTexts).toEqual(["text-a", "text-b"]);
    });

    it("returns only searchResults when history is empty", () => {
      const { sources } = fillSourceWindow({
        nDocs: 4,
        searchResults: [makeSource("only")],
        history: [],
      });
      expect(sources.map((s) => s.id)).toEqual(["only"]);
    });

    it("defaults to a window of 4 documents", () => {
      const { sources } = fillSourceWindow({
        searchResults: [],
        history: [chatWithSources(["a", "b", "c", "d", "e"].map(makeSource))],
      });
      expect(sources).toHaveLength(4);
    });

    it("stops mid-chat once the window is full and keeps contextTexts 1:1", () => {
      const { sources, contextTexts } = fillSourceWindow({
        nDocs: 3,
        searchResults: [makeSource("hit")],
        history: [
          chatWithSources([makeSource("old-a")]),
          chatWithSources([
            makeSource("new-a"),
            makeSource("new-b"),
            makeSource("new-c"),
          ]),
        ],
      });

      expect(sources.map((s) => s.id)).toEqual(["hit", "new-a", "new-b"]);
      expect(contextTexts).toEqual(["text-hit", "text-new-a", "text-new-b"]);
    });

    it("returns a partial window when history cannot fill it", () => {
      const { sources } = fillSourceWindow({
        nDocs: 4,
        searchResults: [],
        history: [chatWithSources([makeSource("only")])],
      });
      expect(sources.map((s) => s.id)).toEqual(["only"]);
    });
  });

  describe("dedupe and filtering", () => {
    it("skips chunks already present in searchResults", () => {
      const { sources } = fillSourceWindow({
        nDocs: 2,
        searchResults: [makeSource("dupe")],
        history: [chatWithSources([makeSource("dupe"), makeSource("fresh")])],
      });
      expect(sources.map((s) => s.id)).toEqual(["dupe", "fresh"]);
    });

    it("adds a chunk cited in multiple chats only once, then keeps digging", () => {
      const { sources } = fillSourceWindow({
        nDocs: 3,
        searchResults: [],
        history: [
          chatWithSources([makeSource("repeat"), makeSource("deep")]),
          chatWithSources([makeSource("repeat"), makeSource("recent")]),
        ],
      });
      expect(sources.map((s) => s.id)).toEqual(["repeat", "recent", "deep"]);
    });

    it("excludes sources from currently pinned documents (filterIdentifiers)", () => {
      const pinned = makeSource("pinned", {
        title: "pinned.txt",
        published: "2024-01-01",
      });
      const { sources } = fillSourceWindow({
        nDocs: 2,
        searchResults: [],
        history: [chatWithSources([pinned, makeSource("free")])],
        filterIdentifiers: ["title:pinned.txt-timestamp:2024-01-01"],
      });
      expect(sources.map((s) => s.id)).toEqual(["free"]);
    });

    it("excludes sources missing a score (previously pinned) or text property", () => {
      const noScore = { id: "no-score", text: "text-no-score" };
      const noText = { id: "no-text", score: 0.9 };
      const { sources } = fillSourceWindow({
        nDocs: 3,
        searchResults: [],
        history: [chatWithSources([noScore, noText, makeSource("valid")])],
      });
      expect(sources.map((s) => s.id)).toEqual(["valid"]);
    });

    it("keeps a source whose score is 0 — presence, not truthiness", () => {
      const { sources } = fillSourceWindow({
        nDocs: 1,
        searchResults: [],
        history: [chatWithSources([makeSource("zero", { score: 0 })])],
      });
      expect(sources.map((s) => s.id)).toEqual(["zero"]);
    });
  });

  describe("hostile history records", () => {
    it("skips malformed records without throwing and still fills from valid ones", () => {
      const { sources } = fillSourceWindow({
        nDocs: 2,
        searchResults: [],
        history: [
          chatWithSources([makeSource("valid")]),
          { response: "not json at all {{" },
          { response: null },
          {}, // no response key at all
          { response: JSON.stringify({ text: "no sources key" }) },
          { response: JSON.stringify({ sources: "not-an-array" }) },
          { response: JSON.stringify({ sources: [] }) },
        ],
      });
      expect(sources.map((s) => s.id)).toEqual(["valid"]);
    });
  });
});

describe("messageArrayCompressor", () => {
  const systemMsg = () => ({ role: "system", content: "You are helpful." });
  const userMsg = (content) => ({ role: "user", content });

  // The exact shape stream.js sends: [system, ...convertToPromptHistory(raw), user]
  function buildMessages(rawHistory, user) {
    const {
      convertToPromptHistory,
    } = require("../../../../utils/helpers/chat/responses");
    return [systemMsg(), ...convertToPromptHistory(rawHistory), userMsg(user)];
  }

  it("passes messages through untouched when the prompt fits the window", async () => {
    const rawHistory = [makeHistoryRecord(1), makeHistoryRecord(2)];
    const messages = buildMessages(rawHistory, "USER TURN 3: short question");
    const snapshot = JSON.parse(JSON.stringify(messages));
    const llm = {
      model: "gpt-4o",
      promptWindowLimit: () => tm.statsFrom(messages) + 601,
      limits: { history: 10_000, system: 10_000, user: 10_000 },
    };

    const result = await messageArrayCompressor(llm, messages, rawHistory);

    expect(result).toBe(messages);
    expect(result).toEqual(snapshot);
    expect(rawHistory.map((r) => r.id)).toEqual([1, 2]);
  });

  it("lets an oversized user prompt hijack the thread: single cannonballed message", async () => {
    const head = "HEAD_SENTINEL";
    const tail = "TAIL_SENTINEL";
    const prompt = `${head} ${tokensOfText("", 2000)} MIDDLE_SENTINEL ${tokensOfText("", 2000)} ${tail}`;
    const messages = [systemMsg(), userMsg(prompt)];
    const llm = {
      model: "gpt-4o",
      promptWindowLimit: () => 3000,
      limits: { history: 450, system: 450, user: 2100 },
    };

    const result = await messageArrayCompressor(llm, messages, []);

    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("user");
    expect(result[0].content).toContain(CANNONBALL_MARKER);
    // middle-out truncation: both ends survive, the middle does not
    expect(result[0].content).toContain(head);
    expect(result[0].content).toContain(tail);
    expect(result[0].content).not.toContain("MIDDLE_SENTINEL");
    // must actually fit: 80% of window plus room for the marker
    expect(tm.countFromString(result[0].content)).toBeLessThan(3000);
  });

  it("keeps the most recent history pairs, in chronological order, when over the window", async () => {
    const rawHistory = [1, 2, 3, 4, 5, 6].map((n) =>
      makeHistoryRecord(n, { size: 100 })
    );
    const pairTokens =
      tm.countFromString(rawHistory[0].prompt) +
      tm.countFromString(JSON.parse(rawHistory[0].response).text);
    const user = "USER TURN 7: what did I just say?";
    const messages = buildMessages(rawHistory, user);
    const llm = {
      model: "gpt-4o",
      promptWindowLimit: () => tm.statsFrom(messages), // force compression
      limits: {
        history: Math.ceil(pairTokens * 2.5), // budget fits exactly 2 pairs
        system: 10_000,
        user: 100_000,
      },
    };

    const result = await messageArrayCompressor(llm, messages, rawHistory);

    // system and user prompt pass through verbatim, history is trimmed to the
    // NEWEST pairs and stays oldest-to-newest. This is the user-facing contract
    // issue #6228 showed being violated.
    expect(result[0]).toEqual(systemMsg());
    expect(result[result.length - 1].content).toBe(user);
    expect(turnsIn(result)).toEqual([
      "user:5",
      "assistant:5",
      "user:6",
      "assistant:6",
      "user:7",
    ]);
  });

  it("regression #6228: fillSourceWindow backfill must not change what the compressor keeps", async () => {
    const build = () =>
      [1, 2, 3, 4, 5, 6].map((n) => makeHistoryRecord(n, { size: 100 }));
    const pairTokens =
      tm.countFromString(build()[0].prompt) +
      tm.countFromString(JSON.parse(build()[0].response).text);
    const user = "USER TURN 7: what did I just say?";
    const llmFor = (messages) => ({
      model: "gpt-4o",
      promptWindowLimit: () => tm.statsFrom(messages),
      limits: {
        history: Math.ceil(pairTokens * 2.5),
        system: 10_000,
        user: 100_000,
      },
    });

    // Control: compressor with no backfill having run.
    const controlHistory = build();
    const controlMessages = buildMessages(controlHistory, user);
    const control = await messageArrayCompressor(
      llmFor(controlMessages),
      controlMessages,
      controlHistory
    );

    // The stream.js sequence: backfill reads rawHistory, the SAME array then
    // feeds the compressor. Before the fix this kept the oldest turns, reversed.
    const rawHistory = build();
    fillSourceWindow({ nDocs: 4, searchResults: [], history: rawHistory });
    const messages = buildMessages(rawHistory, user);
    const result = await messageArrayCompressor(
      llmFor(messages),
      messages,
      rawHistory
    );

    expect(turnsIn(result)).toEqual(turnsIn(control));
  });

  it("cannonballs only the oversized side of a recent pair instead of dropping it", async () => {
    const assistantText = "ASSISTANT TURN 1: brief answer";
    const rawHistory = [
      {
        id: 1,
        prompt: tokensOfText("USER TURN 1:", 400),
        response: JSON.stringify({
          text: assistantText,
          sources: [],
          attachments: [],
        }),
      },
    ];
    const messages = buildMessages(rawHistory, "USER TURN 2: short");
    const llm = {
      model: "gpt-4o",
      promptWindowLimit: () => tm.statsFrom(messages),
      limits: { history: 300, system: 10_000, user: 100_000 },
    };

    const result = await messageArrayCompressor(llm, messages, rawHistory);
    const historyMsgs = result.slice(1, -1);

    expect(turnsIn(historyMsgs)).toEqual(["user:1", "assistant:1"]);
    expect(historyMsgs[0].content).toContain(CANNONBALL_MARKER);
    expect(historyMsgs[1].content).toBe(assistantText);
    expect(tm.statsFrom(historyMsgs)).toBeLessThanOrEqual(300);
  });

  it("drops oversized pairs beyond the 3 most recent instead of cannonballing them", async () => {
    // The 3 most recent pairs are small and leave plenty of history budget.
    // The 4th-from-newest pair is oversized but WOULD fit if cannonballed —
    // only the "most recent 3 pairs" cutoff keeps it out.
    const rawHistory = [
      {
        id: 1,
        prompt: tokensOfText("USER TURN 1:", 500),
        response: JSON.stringify({
          text: "ASSISTANT TURN 1: brief",
          sources: [],
          attachments: [],
        }),
      },
      makeHistoryRecord(2, { size: 30 }),
      makeHistoryRecord(3, { size: 30 }),
      makeHistoryRecord(4, { size: 30 }),
    ];
    const smallPair =
      tm.countFromString(rawHistory[1].prompt) +
      tm.countFromString(JSON.parse(rawHistory[1].response).text);
    const messages = buildMessages(rawHistory, "USER TURN 5: short");
    const llm = {
      model: "gpt-4o",
      promptWindowLimit: () => tm.statsFrom(messages),
      // 400 tokens of slack beyond the recent pairs: enough for a cannonballed
      // turn 1, so only the recency cutoff can exclude it.
      limits: { history: smallPair * 3 + 400, system: 10_000, user: 100_000 },
    };

    const result = await messageArrayCompressor(llm, messages, rawHistory);

    expect(turnsIn(result)).toEqual([
      "user:2",
      "assistant:2",
      "user:3",
      "assistant:3",
      "user:4",
      "assistant:4",
      "user:5",
    ]);
  });

  it("cannonballs a system prompt over its limit but keeps its Context section", async () => {
    const rawHistory = [];
    const context = tokensOfText("CONTEXT_SENTINEL", 600);
    const messages = [
      {
        role: "system",
        content: `INSTRUCTION_SENTINEL be helpful\nContext:${context}`,
      },
      userMsg("USER TURN 1: short"),
    ];
    const llm = {
      model: "gpt-4o",
      promptWindowLimit: () => tm.statsFrom(messages),
      limits: { history: 450, system: 300, user: 100_000 },
    };

    const result = await messageArrayCompressor(llm, messages, rawHistory);
    const system = result[0];

    expect(system.role).toBe("system");
    // instruction is under 25% of the system limit so it survives intact,
    // context is over 75% so it gets cannonballed but is still present.
    expect(system.content).toContain("INSTRUCTION_SENTINEL");
    expect(system.content).toContain("Context:");
    expect(system.content).toContain(CANNONBALL_MARKER);
    expect(tm.countFromString(system.content)).toBeLessThan(
      tm.countFromString(messages[0]?.content || context)
    );
  });
});

describe("messageStringCompressor", () => {
  // Minimal string-completion LLM: prompt construction mirrors the providers'
  // template approach (system + context + history + user in one string).
  function makeLLM({ window, limits }) {
    return {
      model: "gpt-4o",
      promptWindowLimit: () => window,
      limits,
      constructPrompt: ({
        systemPrompt = "",
        contextTexts = [],
        chatHistory = [],
        userPrompt = "",
      }) =>
        [
          systemPrompt,
          ...contextTexts,
          ...chatHistory.map((m) => `${m.role}: ${m.content}`),
          `user: ${userPrompt}`,
        ].join("\n"),
    };
  }

  it("returns the constructed prompt untouched when it fits the window", async () => {
    const promptArgs = {
      systemPrompt: "You are helpful.",
      userPrompt: "USER TURN 1: short",
      contextTexts: ["some context"],
      chatHistory: [],
    };
    const llm = makeLLM({
      window: 10_000,
      limits: { history: 450, system: 450, user: 7_000 },
    });

    const result = await messageStringCompressor(llm, promptArgs, []);
    expect(result).toBe(llm.constructPrompt(promptArgs));
  });

  it("lets an oversized user prompt hijack the whole prompt", async () => {
    const promptArgs = {
      systemPrompt: "SYSTEM_SENTINEL you are helpful",
      userPrompt: tokensOfText("HUGE", 4000),
      contextTexts: [],
      chatHistory: [],
    };
    const llm = makeLLM({
      window: 3000,
      limits: { history: 450, system: 450, user: 2100 },
    });

    const result = await messageStringCompressor(llm, promptArgs, []);

    expect(result).toContain(CANNONBALL_MARKER);
    expect(result).not.toContain("SYSTEM_SENTINEL");
  });

  it("keeps the newest history in chronological order when over the window", async () => {
    const rawHistory = [1, 2, 3, 4].map((n) =>
      makeHistoryRecord(n, { size: 100 })
    );
    const pairTokens =
      tm.countFromString(rawHistory[0].prompt) +
      tm.countFromString(JSON.parse(rawHistory[0].response).text);
    const promptArgs = {
      systemPrompt: "You are helpful.",
      userPrompt: "USER TURN 5: short",
      contextTexts: [],
      chatHistory: rawHistory.map((r) => ({ role: "user", content: r.prompt })),
    };
    const llm = makeLLM({
      window: 100, // guaranteed overflow
      limits: {
        history: Math.ceil(pairTokens * 2.5),
        system: 10_000,
        user: 100_000,
      },
    });

    const result = await messageStringCompressor(llm, promptArgs, rawHistory);

    const turnOrder = [
      ...result.matchAll(/(user|assistant): (?:USER|ASSISTANT) TURN (\d)/g),
    ].map((m) => `${m[1]}:${m[2]}`);
    expect(turnOrder).toEqual([
      "user:3",
      "assistant:3",
      "user:4",
      "assistant:4",
      "user:5",
    ]);
  });

  it("cannonballs a system prompt over its limit", async () => {
    const promptArgs = {
      systemPrompt: tokensOfText("SYSTEM_HEAD", 800) + " SYSTEM_TAIL",
      userPrompt: "USER TURN 1: short",
      contextTexts: [],
      chatHistory: [],
    };
    const llm = makeLLM({
      window: 100, // guaranteed overflow
      limits: { history: 450, system: 300, user: 100_000 },
    });

    const result = await messageStringCompressor(llm, promptArgs, []);

    expect(result).toContain(CANNONBALL_MARKER);
    expect(result).toContain("SYSTEM_HEAD");
    expect(result).toContain("SYSTEM_TAIL");
    expect(result).toContain("user: USER TURN 1: short");
  });
});

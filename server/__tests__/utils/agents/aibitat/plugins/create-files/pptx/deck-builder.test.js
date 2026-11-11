/* eslint-env jest */
const { getEventListeners } = require("events");

// Each section call goes to `mockModel`, which receives the tools the section
// was offered (by name) and the prompt, and returns what to submit: a
// {intro, slides} object, a slides array, null to submit nothing, or an
// Error to fail the call.
let mockModel;
const mockOfferedTools = [];
jest.mock("../../../../../../../utils/agents/aibitat/index.js", () =>
  jest.fn().mockImplementation(() => ({
    functions: new Map(),
    function(def) {
      this.functions.set(def.name, def);
    },
    abort: jest.fn(),
    getProviderForConfig: () => ({
      attachHandlerProps() {},
      supportsAgentStreaming: false,
      getCumulativeUsage: () => ({ prompt_tokens: 0, completion_tokens: 0 }),
    }),
    async handleExecution(messages, functions) {
      const tools = Object.fromEntries(functions.map((f) => [f.name, f]));
      mockOfferedTools.push(Object.keys(tools));
      const out = mockModel(tools, messages);
      if (out instanceof Error) throw out;
      if (out)
        tools["submit-section-slides"].handler(
          Array.isArray(out) ? { slides: out } : out
        );
      return "";
    },
  }))
);

const {
  buildDeck,
  decodeHtmlEntities,
  readConversation,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/deck-builder.js");

function parentAgent() {
  return {
    defaultProvider: { provider: "test", model: "test" },
    handlerProps: { log: () => {} },
    abortController: new AbortController(),
    _aborted: false,
    introspect: () => {},
    socket: { send: () => {} },
  };
}

const build = (parent, sections, history = []) =>
  buildDeck(parent, {
    say: () => {},
    title: "Deck",
    subtitle: "",
    sections,
    research: false,
    history,
  });

const ideas = (n) =>
  Array.from({ length: n }, (_, i) => ({
    title: `Idea ${i}`,
    text: "Why it matters",
  }));
const layoutsOf = (slides) => slides.map((s) => s.layout);

beforeEach(() => {
  mockOfferedTools.length = 0;
});

describe("decodeHtmlEntities", () => {
  test("decodes named entities", () => {
    expect(
      decodeHtmlEntities("&lt;a&gt; &amp; &quot;b&quot; &apos;c&apos;")
    ).toBe(`<a> & "b" 'c'`);
  });

  test("decodes decimal and hex entities", () => {
    expect(decodeHtmlEntities("it&#39;s &#34;x&#34; it&#x27;s &#X27;")).toBe(
      `it's "x" it's '`
    );
  });

  test("leaves unknown and out-of-range entities untouched", () => {
    expect(decodeHtmlEntities("&nope; &#99999999; & plain")).toBe(
      "&nope; &#99999999; & plain"
    );
  });
});

describe("readConversation", () => {
  const history = [
    {
      from: "USER",
      content: "Here are our numbers:\nRevenue Q3: $4.2M\nChurn: 3.1%",
    },
    { from: "@agent", content: "Thanks, noted.\nHeadcount is 48." },
  ];

  test("returns only the lines that mention a query term, in order", () => {
    expect(readConversation(history, "revenue, churn")).toBe(
      "USER: Revenue Q3: $4.2M\nUSER: Churn: 3.1%"
    );
  });

  test("matches regardless of case and language", () => {
    const spanish = [{ from: "USER", content: "Ingresos del año: 1,2 M€" }];
    expect(readConversation(spanish, "INGRESOS")).toBe(
      "USER: Ingresos del año: 1,2 M€"
    );
  });

  test("returns the latest lines without a query", () => {
    expect(readConversation(history).split("\n")).toHaveLength(5);
    expect(readConversation(history, "  ")).toBe(readConversation(history));
  });

  test("says so when nothing matches or there is nothing to read", () => {
    expect(readConversation(history, "ebitda")).toBe(
      'Nothing in the conversation mentions "ebitda".'
    );
    expect(readConversation([])).toBe("The conversation is empty.");
  });

  test("keeps the newest lines when the matches are too long", () => {
    const long = Array.from({ length: 200 }, (_, i) => ({
      from: "USER",
      content: `revenue line ${i} ${"x".repeat(40)}`,
    }));
    const lines = readConversation(long, "revenue").split("\n");
    expect(lines.join("\n").length).toBeLessThanOrEqual(3000);
    expect(lines.at(-1)).toContain("revenue line 199");
    expect(lines.length).toBeLessThan(200);
  });
});

describe("buildDeck", () => {
  test("adds a divider with the model's intro and keeps at most three slides a section", async () => {
    mockModel = () => ({
      intro: "Why this matters",
      slides: Array.from({ length: 5 }, (_, i) => ({
        title: `S${i}`,
        points: ["p"],
      })),
    });
    const { slides, built } = await build(parentAgent(), [{ title: "A" }]);
    expect(built).toEqual(["A"]);
    expect(slides[0]).toEqual(
      expect.objectContaining({
        layout: "section",
        title: "A",
        subtitle: "Why this matters",
      })
    );
    expect(slides.slice(1).map((s) => s.title)).toEqual(["S0", "S1", "S2"]);
  });

  test("never puts the same layout on consecutive content slides across sections", async () => {
    mockModel = () => Array(3).fill({ title: "T", items: ideas(3) });
    const { slides } = await build(parentAgent(), [
      { title: "A" },
      { title: "B" },
      { title: "C" },
    ]);
    const content = layoutsOf(slides.filter((s) => s.layout !== "section"));
    expect(content).toHaveLength(9);
    for (let i = 1; i < content.length; i++)
      expect(content[i]).not.toBe(content[i - 1]);
  });

  test("keeps figures from the key points and drops invented ones", async () => {
    mockModel = () => [
      {
        title: "Results",
        figures: [
          { value: "38%", label: "fewer tickets" },
          { value: "$180k", label: "saved" },
          { value: "99%", label: "accuracy" },
        ],
        points: ["Answers in under 100ms", "Support teams adopted it first"],
      },
    ];
    const { slides } = await build(parentAgent(), [
      { title: "A", keyPoints: ["Tickets fell 38%", "Saved $180k a year"] },
    ]);
    expect(slides[1].figures.map((f) => f.value)).toEqual(["38%", "$180k"]);
    expect(slides[1].points).toEqual(["Support teams adopted it first"]);
  });

  test("counts figures found through the conversation lookup as sourced", async () => {
    const history = [
      { from: "USER", content: "Q3 revenue was $4.2M\nChurn was 3.1%" },
    ];
    let prompt;
    mockModel = (tools, messages) => {
      prompt = messages.map((m) => m.content).join("\n");
      tools["read-conversation"].handler({ query: "revenue churn" });
      return [
        {
          title: "Q3",
          figures: [
            { value: "$4.2M", label: "revenue" },
            { value: "3.1%", label: "churn" },
            { value: "48%", label: "margin" },
          ],
        },
      ];
    };
    const { slides } = await build(
      parentAgent(),
      [{ title: "Results" }],
      history
    );
    expect(prompt).not.toContain("$4.2M");
    expect(slides[1].layout).toBe("stats");
    expect(slides[1].figures.map((f) => f.value)).toEqual(["$4.2M", "3.1%"]);
  });

  test("offers the conversation lookup only when there is a conversation", async () => {
    mockModel = () => [{ title: "T", points: ["p"] }];
    await build(parentAgent(), [{ title: "A" }]);
    await build(
      parentAgent(),
      [{ title: "A" }],
      [{ from: "USER", content: "hi" }]
    );
    expect(mockOfferedTools).toEqual([
      ["submit-section-slides"],
      ["submit-section-slides", "read-conversation"],
    ]);
  });

  test("falls back to key points, and leaves out sections that produced nothing", async () => {
    mockModel = () => new Error("model offline");
    const { slides, built } = await build(parentAgent(), [
      { title: "With points", keyPoints: ["one", "two"] },
      { title: "Without points" },
    ]);
    expect(built).toEqual(["With points"]);
    expect(layoutsOf(slides)).toEqual(["section", "bullets"]);
    expect(slides[1].points).toEqual(["one", "two"]);
  });

  test("recovers slides a model wrote as text instead of a tool call", async () => {
    mockModel = () => null;
    const AIbitat = require("../../../../../../../utils/agents/aibitat/index.js");
    AIbitat.mockImplementationOnce(() => {
      const child = AIbitat.getMockImplementation()();
      child.handleExecution = async () =>
        'Here you go: {"slides": [{"title": "T", "items": [{"title": "a", "text": "b"}, {"title": "c", "text": "d"}]}]}';
      return child;
    });
    const { built, slides } = await build(parentAgent(), [{ title: "A" }]);
    expect(built).toEqual(["A"]);
    expect(slides[1].layout).toBe("comparison");
  });

  test("detaches every sub-agent from the parent's abort signal when done", async () => {
    mockModel = () => [{ title: "T", points: ["p"] }];
    const parent = parentAgent();
    await build(parent, [{ title: "A" }, { title: "B" }]);
    expect(
      getEventListeners(parent.abortController.signal, "abort")
    ).toHaveLength(0);
  });

  test("stops building once the parent is aborted", async () => {
    const parent = parentAgent();
    mockModel = () => {
      parent._aborted = true;
      return [{ title: "T", points: ["p"] }];
    };
    const { built } = await build(parent, [{ title: "A" }, { title: "B" }]);
    expect(built).toEqual(["A"]);
  });
});

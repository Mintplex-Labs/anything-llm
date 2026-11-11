/* eslint-env jest */
const { getEventListeners } = require("events");

// Each section call goes to `mockModel`, which receives the tools the section
// was offered (by name) and the prompt, and returns the slides to submit (or
// null to submit nothing, or an Error to fail the call).
let mockModel;
const mockOfferedLayouts = [];
const mockOfferedTools = [];
jest.mock("../../../../../../../utils/agents/aibitat/index.js", () =>
  jest.fn().mockImplementation(() => {
    const child = {
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
        const submit = tools["submit-section-slides"];
        mockOfferedTools.push(Object.keys(tools));
        mockOfferedLayouts.push(
          submit.parameters.properties.slides.items.properties.layout.enum
        );
        const slides = mockModel(tools, messages);
        if (slides instanceof Error) throw slides;
        if (slides) submit.handler({ slides });
        return "";
      },
    };
    return child;
  })
);

const {
  buildDeck,
  decodeHtmlEntities,
  openLayouts,
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

/** A model that always picks the first offered content layouts it can fill. */
const favourite = (layouts) => (tools) => {
  const offered =
    tools["submit-section-slides"].parameters.properties.slides.items.properties
      .layout.enum;
  const pick = layouts.filter((l) => offered.includes(l)).slice(0, 2);
  return [
    { layout: "section", title: "S" },
    ...pick.map((layout) => ({
      layout,
      title: layout,
      bullets: ["a", "b"],
      items: [
        { title: "x", text: "y", bullets: ["z"] },
        { title: "x2", text: "y2", bullets: ["z2"] },
      ],
    })),
  ];
};

beforeEach(() => {
  mockOfferedLayouts.length = 0;
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

describe("openLayouts", () => {
  test("offers every content layout to the first section", () => {
    expect(openLayouts({}, new Set())).toEqual([
      "bullets",
      "two-column",
      "stats",
      "cards",
      "steps",
      "chart",
      "table",
      "quote",
    ]);
  });

  test("closes layouts the previous section used and any used three times", () => {
    const open = openLayouts({ cards: 3, chart: 1 }, new Set(["bullets"]));
    expect(open).not.toContain("bullets");
    expect(open).not.toContain("cards");
    expect(open).toContain("chart");
  });

  test("keeps the least used text layout open when all of them are closed", () => {
    const used = { bullets: 3, cards: 3, steps: 2, "two-column": 3 };
    const open = openLayouts(used, new Set(["steps"]));
    expect(open).toEqual(["stats", "chart", "table", "quote", "steps"]);
  });
});

describe("buildDeck", () => {
  test("never offers a section the layouts the previous section used", async () => {
    mockModel = favourite(["bullets", "cards", "steps", "two-column"]);
    const { slides } = await build(parentAgent(), [
      { title: "A" },
      { title: "B" },
      { title: "C" },
    ]);
    expect(mockOfferedLayouts[0]).toContain("bullets");
    expect(mockOfferedLayouts[1]).not.toContain("bullets");
    expect(mockOfferedLayouts[1]).not.toContain("cards");
    expect(mockOfferedLayouts[2]).toContain("bullets");
    const content = slides.filter((s) => s.layout !== "section");
    expect(content.map((s) => s.layout)).toEqual([
      "bullets",
      "cards",
      "steps",
      "two-column",
      "bullets",
      "cards",
    ]);
  });

  test("falls back to key points, and reports sections that produced nothing", async () => {
    mockModel = () => new Error("model offline");
    const { slides, built } = await build(parentAgent(), [
      { title: "With points", keyPoints: ["one", "two"] },
      { title: "Without points" },
    ]);
    expect(built).toEqual(["With points"]);
    expect(slides).toEqual([
      expect.objectContaining({ layout: "section", title: "With points" }),
      expect.objectContaining({ layout: "bullets", bullets: ["one", "two"] }),
    ]);
  });

  test("recovers slides a model wrote as text instead of a tool call", async () => {
    mockModel = () => null;
    const AIbitat = require("../../../../../../../utils/agents/aibitat/index.js");
    AIbitat.mockImplementationOnce(() => {
      const child = AIbitat.getMockImplementation()();
      child.handleExecution = async () =>
        'Here you go: {"slides": [{"layout": "cards", "title": "T", "items": [{"title": "a", "text": "b"}]}]}';
      return child;
    });
    const { built, slides } = await build(parentAgent(), [{ title: "A" }]);
    expect(built).toEqual(["A"]);
    expect(slides[0].layout).toBe("cards");
  });

  test("detaches every sub-agent from the parent's abort signal when done", async () => {
    mockModel = favourite(["bullets"]);
    const parent = parentAgent();
    await build(parent, [{ title: "A" }, { title: "B" }]);
    expect(
      getEventListeners(parent.abortController.signal, "abort")
    ).toHaveLength(0);
  });

  test("stops building once the parent is aborted", async () => {
    const parent = parentAgent();
    mockModel = (tool) => {
      parent._aborted = true;
      return favourite(["bullets"])(tool);
    };
    const { built } = await build(parent, [{ title: "A" }, { title: "B" }]);
    expect(built).toEqual(["A"]);
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

describe("buildDeck conversation lookup", () => {
  test("is offered only when there is a conversation", async () => {
    mockModel = favourite(["bullets"]);
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

  test("lets a section pull a figure the outline left out, without the chat in its prompt", async () => {
    const history = [
      { from: "USER", content: "Q3 revenue was $4.2M\nWeather was nice" },
    ];
    let prompt;
    mockModel = (tools, messages) => {
      prompt = messages.map((m) => m.content).join("\n");
      const found = tools["read-conversation"].handler({ query: "revenue" });
      return [{ layout: "bullets", title: "Results", bullets: [found] }];
    };
    const { slides } = await build(
      parentAgent(),
      [{ title: "Results" }],
      history
    );
    expect(prompt).not.toContain("$4.2M");
    expect(slides[0].bullets).toEqual(["USER: Q3 revenue was $4.2M"]);
  });
});

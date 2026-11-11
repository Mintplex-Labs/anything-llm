/* eslint-env jest */
const { getEventListeners } = require("events");

// Each section call goes to `mockModel`, which receives the submit tool the
// section was offered and returns the slides to submit (or null to submit
// nothing, or an Error to fail the call).
let mockModel;
const mockOfferedLayouts = [];
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
        const [tool] = functions;
        mockOfferedLayouts.push(
          tool.parameters.properties.slides.items.properties.layout.enum
        );
        const slides = mockModel(tool, messages);
        if (slides instanceof Error) throw slides;
        if (slides) tool.handler({ slides });
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

const build = (parent, sections) =>
  buildDeck(parent, {
    say: () => {},
    title: "Deck",
    subtitle: "",
    sections,
    research: false,
    context: "",
  });

/** A model that always picks the first offered content layouts it can fill. */
const favourite = (layouts) => (tool) => {
  const offered =
    tool.parameters.properties.slides.items.properties.layout.enum;
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

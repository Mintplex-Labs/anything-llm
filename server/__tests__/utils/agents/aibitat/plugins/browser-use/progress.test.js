/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// traces.js resolves its folder from STORAGE_DIR at require time.
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "browser-use-progress-test-")
);
const {
  BrowserAgent,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/agent.js");
const {
  BrowserBridge,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/bridge.js");
const {
  taskTerms,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/tools.js");

const URL =
  "https://books.toscrape.com/catalogue/category/books/poetry_23/index.html";
const TASK =
  "On books.toscrape.com, open the Poetry category and find the cheapest book in it. Report its title and price.";

// The Poetry page at four scroll positions - the cheapest book is only on the second one.
const STATES = [
  '[T1] A Light in the ... £51.77 In stock\n[1] a "A Light in the Attic"',
  '[T1] Poems That Make Grown ... £14.19 In stock\n[1] a "Poems That Make Grown Women Cry"',
  '[T1] Les Fleurs du Mal £29.04 In stock\n[1] a "Les Fleurs du Mal"',
  '[T1] Booked £17.49 In stock\n[1] a "Booked"',
];

const scroll = (id) => ({
  id,
  name: "scroll",
  arguments: { direction: "down" },
});

/** Tool calls in order for the action loop; text calls (final answer, checks) answer with `text`. */
function fakeProvider(calls, text) {
  const queue = [...calls];
  const provider = {
    actions: [],
    texts: [],
    complete: jest.fn(async (messages, functions) => {
      if (!functions.length) {
        provider.texts.push(messages);
        return { textResponse: text(messages) };
      }
      provider.actions.push(messages);
      const next = queue.shift();
      return next
        ? { textResponse: "", functionCall: next }
        : {
            textResponse: "",
            functionCall: { id: "x", name: "done", arguments: { result: "" } },
          };
    }),
  };
  return provider;
}

function fakeAibitat(provider) {
  return {
    defaultProvider: {},
    functions: new Map(),
    getProviderForConfig: () => provider,
    handlerProps: {},
  };
}

/** Scrolling moves through STATES; past the last one the page is at its bottom. */
function stubPage() {
  let at = 0;
  jest
    .spyOn(BrowserBridge, "request")
    .mockImplementation(async (action, params) => {
      if (action === "start")
        return {
          profile: { name: "Default", id: "default" },
          result: {
            ok: true,
            outcome: "Opened",
            state: STATES[0],
            page: { url: URL, title: "Poetry" },
          },
        };
      if (action !== "act") return true;
      const last = at === STATES.length - 1;
      at = Math.min(at + 1, STATES.length - 1);
      return {
        ok: true,
        outcome: last
          ? "Already at the bottom of the page - nothing more below."
          : "Scrolled down",
        state: STATES[at],
        page: { url: URL, title: "Poetry" },
      };
    });
}

afterEach(() => jest.restoreAllMocks());
afterAll(() =>
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
);

describe("BrowserAgent scrolling through a list", () => {
  it("does not call scrolls that show new content a loop, and says when the page ends", async () => {
    stubPage();
    const provider = fakeProvider(
      [
        scroll("1"),
        scroll("2"),
        scroll("3"),
        scroll("4"),
        { id: "5", name: "done", arguments: { result: "x" } },
      ],
      () => "COMPLETE\n\nPoems That Make Grown Women Cry - £14.19"
    );
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: TASK,
      profile: null,
      startUrl: URL,
    });
    await agent.run();

    const afterEdge = provider.actions.at(-1).at(-1).content;
    expect(afterEdge).toMatch(/Already at the bottom of the page/);
    expect(afterEdge).toMatch(/You have seen the whole page/);
    expect(afterEdge).not.toMatch(/repeating the same actions/);
    expect(agent.trace.gaveUp).toBeUndefined();
    expect(agent.trace.status).toBe("done");
    // The final answer sees what scrolled out of view on the way down.
    const final = provider.texts.at(-1)[1].content;
    expect(final).toMatch(
      /Also seen on this page earlier[\s\S]*Poems That Make Grown \.\.\. £14\.19/
    );
  });

  it("still stops an agent that keeps scrolling at the bottom", async () => {
    stubPage();
    const provider = fakeProvider(
      Array.from({ length: 12 }, (_, i) => scroll(String(i))),
      (messages) =>
        /ANSWERED if/.test(messages[1].content)
          ? "PARTIAL\n\nNot sure."
          : "CONTINUE\nkeep going"
    );
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: TASK,
      profile: null,
      startUrl: URL,
    });
    await agent.run();
    expect(agent.trace.gaveUp).toMatch(/repeating the same actions \(scroll\)/);
    expect(agent.trace.status).toBe("incomplete");
  });

  it("answers instead of giving up when what it already saw answers the task", async () => {
    stubPage();
    const provider = fakeProvider(
      Array.from({ length: 12 }, (_, i) => scroll(String(i))),
      (messages) =>
        /ANSWERED if/.test(messages[1].content)
          ? "ANSWERED\n\nThe cheapest Poetry book is Poems That Make Grown Women Cry at £14.19."
          : "CONTINUE\nkeep going"
    );
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: TASK,
      profile: null,
      startUrl: URL,
    });
    const result = await agent.run();
    expect(agent.trace.status).toBe("done");
    expect(agent.trace.gaveUp).toBeUndefined();
    expect(result).toMatch(/£14\.19/);
  });
});

describe("BrowserAgent with a new plan in every note", () => {
  const DOCS = "https://docs.python.org/3/builtins/functions.html";
  const DOCS_TASK =
    "Find the documentation for the built-in zip() function and report in which Python version its strict parameter was added.";

  /** Every action lands on one of two fixed page states - nothing new after the first two steps. */
  function stubTwoStates(url) {
    let at = 0;
    jest.spyOn(BrowserBridge, "request").mockImplementation(async (action) => {
      const state = `[T1] zip(*iterables, strict=False) view ${at++ % 2}`;
      const result = {
        ok: true,
        outcome: "Done",
        state,
        page: { url, title: "Built-in functions" },
      };
      if (action === "start")
        return { profile: { name: "Default", id: "default" }, result };
      return action === "act" ? result : true;
    });
  }

  const giveUp = (messages) =>
    /ANSWERED if/.test(messages[1].content)
      ? "PARTIAL\n\nNot found."
      : "CONTINUE\nkeep going";

  it("stops scrolling up and down even when each step carries a new note", async () => {
    stubTwoStates(DOCS);
    const provider = fakeProvider(
      Array.from({ length: 30 }, (_, i) => ({
        id: String(i),
        name: "scroll",
        arguments: {
          direction: i % 2 ? "up" : "down",
          note: `Scroll ${i % 2 ? "up" : "down"} to find the version note, attempt ${"again ".repeat(i)}`,
        },
      })),
      giveUp
    );
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: DOCS_TASK,
      profile: null,
      startUrl: DOCS,
    });
    await agent.run();
    expect(agent.trace.status).toBe("incomplete");
    expect(provider.actions.length).toBeLessThan(15);
  });

  it("warns about re-opening the same address and stops before the step limit", async () => {
    stubTwoStates("https://the-internet.herokuapp.com/");
    const provider = fakeProvider(
      Array.from({ length: 30 }, (_, i) => ({
        id: String(i),
        name: "navigate",
        arguments: {
          url: "https://the-internet.herokuapp.com",
          note: `Retrying the main page${" - maybe it was temporary".repeat(i)}`,
        },
      })),
      giveUp
    );
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: "On the-internet.herokuapp.com, open the Sortable Data Tables page.",
      profile: null,
      startUrl: "https://the-internet.herokuapp.com/",
    });
    await agent.run();
    const seen = provider.actions.map((m) => m.at(-1).content).join("\n");
    expect(seen).toMatch(/You have opened this address 3 times/);
    expect(agent.trace.status).toBe("incomplete");
    expect(provider.actions.length).toBeLessThan(15);
  });

  it("still counts a note with a new fact as progress", async () => {
    stubTwoStates(DOCS);
    const facts = ["3.10", "3.11", "3.12", "3.13", "3.14", "3.15", "3.16"];
    const provider = fakeProvider(
      [
        ...facts.map((v, i) => ({
          id: String(i),
          name: "scroll",
          arguments: { direction: "down", note: `Saw Python ${v} mentioned` },
        })),
        { id: "done", name: "done", arguments: { result: "x" } },
      ],
      () => "COMPLETE\n\nAdded in Python 3.10."
    );
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: DOCS_TASK,
      profile: null,
      startUrl: DOCS,
    });
    await agent.run();
    expect(agent.trace.gaveUp).toBeUndefined();
    expect(agent.trace.status).toBe("done");
  });
});

describe("BrowserAgent history", () => {
  it("clips runaway tool arguments when replaying past calls", async () => {
    stubPage();
    const ids = Array.from({ length: 2000 }, (_, i) => i + 1);
    const provider = fakeProvider(
      [
        {
          id: "1",
          name: "read_page",
          arguments: JSON.stringify({ text_ids: JSON.stringify(ids) }),
        },
        { id: "2", name: "read_page", arguments: { text_ids: ids } },
        scroll("3"),
        { id: "4", name: "done", arguments: { result: "x" } },
      ],
      () => "COMPLETE\n\nPoems That Make Grown Women Cry - £14.19"
    );
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: TASK,
      profile: null,
      startUrl: URL,
    });
    await agent.run();
    const replayed = provider.actions
      .at(-1)
      .filter((m) => m.originalFunctionCall)
      .map((m) => JSON.stringify(m.originalFunctionCall.arguments));
    expect(replayed.length).toBeGreaterThanOrEqual(2);
    for (const args of replayed) expect(args.length).toBeLessThan(400);
  });
});

describe("taskTerms", () => {
  it("leaves out the site's domain and instruction words", () => {
    expect(taskTerms(TASK)).toEqual([
      "poetry",
      "catego",
      "cheape",
      "book",
      "title",
    ]);
  });
});

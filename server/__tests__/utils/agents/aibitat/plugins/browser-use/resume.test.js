/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// traces.js resolves its folder from STORAGE_DIR at require time.
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "browser-use-resume-test-")
);
const {
  BrowserAgent,
  siteName,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/agent.js");
const {
  BrowserBridge,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/bridge.js");
const {
  BrowserTraces,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/traces.js");

const CART = "https://www.amazon.com/gp/cart/view.html";

function page(url, title, state = `[T1] ${title}`) {
  return {
    ok: true,
    outcome: `Opened ${url}`,
    state,
    page: { url, title, favicon: null },
  };
}

/**
 * A provider that answers with `calls` (tool calls, in order) and then the final-answer text.
 * Every request's messages are kept in `seen`.
 */
function fakeProvider(calls) {
  const queue = [...calls];
  const provider = {
    seen: [],
    complete: jest.fn(async (messages) => {
      provider.seen.push(messages);
      const next = queue.shift();
      if (next) return { textResponse: "", functionCall: next };
      return { textResponse: "COMPLETE\n\nRemoved the AirPods from the cart." };
    }),
  };
  return provider;
}

function fakeAibitat(provider) {
  return {
    defaultProvider: {},
    functions: new Map(),
    getProviderForConfig: () => provider,
    handlerProps: {
      invocation: { workspace: { slug: "ws", name: "WS" } },
    },
  };
}

/** Bridge stub: `start` opens on its startUrl, `act` runs through `onAct`. */
function stubBridge({ onAct = () => null, startError = null } = {}) {
  const requests = [];
  jest
    .spyOn(BrowserBridge, "request")
    .mockImplementation(async (action, params) => {
      requests.push({ action, ...params });
      if (action === "start") {
        if (startError && params.profile) throw new Error(startError);
        return {
          profile: {
            name: params.profile ? "Work" : "Default",
            id: params.profile || "default",
          },
          result: params.startUrl ? page(params.startUrl, "Cart") : null,
        };
      }
      if (action === "act") return onAct(params);
      return true;
    });
  return requests;
}

afterEach(() => jest.restoreAllMocks());
afterAll(() =>
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
);

describe("BrowserAgent resume points", () => {
  it("saves the last page that loaded fine, never an error page, and closes the window", async () => {
    stubBridge({
      onAct: ({ args }) => ({
        ...page(args.url, "This site can't be reached"),
        ok: false,
      }),
    });
    const provider = fakeProvider([
      {
        id: "1",
        name: "navigate",
        arguments: {
          url: "https://down.example.com/",
          note: "Cart has AirPods",
        },
      },
      { id: "2", name: "done", arguments: { result: "done" } },
    ]);
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(provider),
      task: "Add AirPods to my Amazon cart",
      profile: null,
      startUrl: CART,
      threadSlug: "t1",
    });
    const result = await agent.run();

    const trace = BrowserTraces.get(agent.id);
    expect(trace.status).toBe("done");
    expect(trace.threadSlug).toBe("t1");
    expect(trace.resume).toMatchObject({
      url: CART,
      title: "Cart",
      profile: { name: "Default", id: "default" },
      notes: ["Cart has AirPods"],
    });
    expect(trace.resume.summary).toMatch(/Removed the AirPods/);
    expect(trace.resume.endedAt).toBe(trace.endedAt);
    expect(result).toMatch(/resume: "amazon"/);
    await new Promise((resolve) => setImmediate(resolve));
    const actions = BrowserBridge.request.mock.calls.map(([action]) => action);
    expect(actions).toContain("close");
    expect(actions).not.toContain("park");
  });

  it("saves no resume point when the browser never started", async () => {
    jest
      .spyOn(BrowserBridge, "request")
      .mockRejectedValue(new Error("no browser"));
    const agent = new BrowserAgent({
      aibitat: fakeAibitat(fakeProvider([])),
      task: "Anything",
      profile: null,
      startUrl: null,
    });
    const result = await agent.run();
    expect(BrowserTraces.get(agent.id)).toMatchObject({ status: "failed" });
    expect(BrowserTraces.get(agent.id).resume).toBeUndefined();
    expect(result).not.toMatch(/resume/);
  });

  describe("a resumed run", () => {
    const earlier = {
      id: "00000000-0000-4000-8000-00000000abcd",
      task: "Add AirPods to my Amazon cart",
      summary: "Added AirPods Pro 2 to the cart.",
      startedAt: "2026-10-15T10:00:00.000Z",
      resume: {
        url: CART,
        title: "Amazon.com Shopping Cart",
        profile: { name: "Work", id: "work-id" },
        summary: "Added AirPods Pro 2 to the cart.",
        notes: ["AirPods Pro 2 - $189"],
        progress: [],
        pages: [
          {
            url: "https://www.amazon.com/dp/B0D1XD1ZV3",
            title: "AirPods Pro 2",
            lines: ["AirPods Pro 2 $189"],
          },
        ],
        endedAt: "2026-10-15T10:05:00.000Z",
      },
    };

    it("reopens the saved page on the saved profile, with the earlier context", async () => {
      const requests = stubBridge({
        onAct: ({ args }) => page(args.url, "AirPods Pro 2"),
      });
      const provider = fakeProvider([
        // Not made up - the id came from the earlier session's pages.
        {
          id: "1",
          name: "navigate",
          arguments: { url: "https://www.amazon.com/dp/B0D1XD1ZV3" },
        },
        { id: "2", name: "done", arguments: { result: "removed" } },
      ]);
      const agent = new BrowserAgent({
        aibitat: fakeAibitat(provider),
        task: "Remove the AirPods from my cart",
        profile: null,
        // Same site as the saved page - the saved page wins.
        startUrl: "https://www.amazon.com/",
        resumeFrom: earlier,
        resumeQuery: "amazon cart",
      });
      await agent.run();

      const start = requests.find((r) => r.action === "start");
      expect(start).toMatchObject({ profile: "work-id", startUrl: CART });
      expect(start.resumeFrom).toBeUndefined();
      const intro = provider.seen[0][1].content;
      expect(intro).toMatch(/Continuing from a saved browser session/);
      expect(intro).toMatch(/Earlier task: Add AirPods to my Amazon cart/);
      expect(intro).toMatch(/AirPods Pro 2 - \$189/);
      expect(intro).toMatch(/amazon\.com\/dp\/B0D1XD1ZV3/);
      // The navigate went through instead of being refused as a made-up address.
      expect(
        requests.some((r) => r.action === "act" && r.tool === "navigate")
      ).toBe(true);

      const trace = BrowserTraces.get(agent.id);
      expect(trace).toMatchObject({
        resumedFrom: earlier.id,
        resumedFromTask: earlier.task,
        profile: "Work",
      });
      expect(trace.steps[0].action).toBe("resume");
      expect(agent.snapshot.resumedFrom).toEqual({
        id: earlier.id,
        task: earlier.task,
      });
    });

    it("opens an explicit start_url on another site, and falls back to Default when the profile is gone", async () => {
      const requests = stubBridge({
        startError: 'There is no browser profile named "work-id".',
      });
      const agent = new BrowserAgent({
        aibitat: fakeAibitat(
          fakeProvider([{ id: "1", name: "done", arguments: {} }])
        ),
        task: "Look up AirPods reviews",
        profile: null,
        startUrl: "https://www.rtings.com/",
        resumeFrom: earlier,
      });
      await agent.run();
      const starts = requests.filter((r) => r.action === "start");
      expect(starts.map((s) => s.profile)).toEqual(["work-id", null]);
      expect(starts[1].startUrl).toBe("https://www.rtings.com/");
      expect(BrowserTraces.get(agent.id).profile).toBe("Default");
    });

    it("says it started fresh when nothing matched", async () => {
      stubBridge();
      const provider = fakeProvider([{ id: "1", name: "done", arguments: {} }]);
      const agent = new BrowserAgent({
        aibitat: fakeAibitat(provider),
        task: "Check my LinkedIn messages",
        profile: null,
        startUrl: null,
        resumeQuery: "linkedin",
      });
      const result = await agent.run();
      expect(provider.seen[0][1].content).toMatch(
        /No earlier browser session matched "linkedin"; starting fresh/
      );
      expect(result).toMatch(/started fresh/);
    });
  });
});

describe("siteName", () => {
  it.each([
    ["https://www.amazon.com/cart", "amazon"],
    ["https://www.amazon.co.uk/", "amazon"],
    ["https://mail.google.com/", "google"],
    ["not a url", null],
  ])("%s -> %s", (url, name) => {
    expect(siteName(url)).toBe(name);
  });
});

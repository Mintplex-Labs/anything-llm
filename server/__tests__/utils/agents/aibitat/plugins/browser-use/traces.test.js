/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// traces.js resolves its folder from STORAGE_DIR at require time.
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "browser-use-traces-test-")
);
const {
  BrowserTraces,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/traces.js");

const dir = path.join(process.env.STORAGE_DIR, "browser-use/traces");
let counter = 0;

function makeTrace(overrides = {}) {
  counter++;
  return {
    id: `00000000-0000-4000-8000-${String(counter).padStart(12, "0")}`,
    task: `task ${counter}`,
    profile: "Default",
    status: "done",
    summary: "ok",
    workspace: null,
    model: "m",
    tokens: { prompt: 1, completion: 1, total: 2 },
    startedAt: new Date(Date.UTC(2026, 0, 1, 0, 0, counter)).toISOString(),
    endedAt: null,
    steps: [
      {
        label: "Opening example.com",
        url: "https://example.com/a",
        favicon: "f",
        thumbnail: "x".repeat(1000),
      },
      { label: "Reading", url: "https://example.com/b", thumbnail: "y" },
    ],
    ...overrides,
  };
}

/** Make the meta file older than its trace, as after a crash between the two writes. */
function ageMeta(id) {
  const old = new Date(Date.now() - 60_000);
  fs.utimesSync(BrowserTraces.metaFileFor(id), old, old);
}

beforeEach(() => fs.rmSync(dir, { recursive: true, force: true }));
afterAll(() =>
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
);

describe("BrowserTraces", () => {
  it("writes the trace and a step-less summary next to it", () => {
    const trace = makeTrace();
    BrowserTraces.save(trace);
    expect(BrowserTraces.get(trace.id)).toEqual(trace);
    const meta = JSON.parse(
      fs.readFileSync(BrowserTraces.metaFileFor(trace.id), "utf8")
    );
    expect(meta.steps).toBeUndefined();
    expect(meta).toMatchObject({
      id: trace.id,
      stepCount: 2,
      sites: [{ host: "example.com", favicon: "f" }],
    });
  });

  it("lists from the meta files without reading full traces", () => {
    const older = makeTrace();
    const newer = makeTrace();
    BrowserTraces.save(older);
    BrowserTraces.save(newer);
    const readSpy = jest.spyOn(fs, "readFileSync");
    const list = BrowserTraces.list();
    const read = readSpy.mock.calls.map(([file]) => path.basename(file));
    readSpy.mockRestore();
    expect(list.map((t) => t.id)).toEqual([newer.id, older.id]);
    expect(read.every((name) => name.endsWith(".meta.json"))).toBe(true);
  });

  it("rebuilds the summary for legacy traces and stale meta files", () => {
    const legacy = makeTrace();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BrowserTraces.fileFor(legacy.id), JSON.stringify(legacy));
    const stale = makeTrace();
    BrowserTraces.save({ ...stale, status: "running", steps: [] });
    ageMeta(stale.id);
    fs.writeFileSync(BrowserTraces.fileFor(stale.id), JSON.stringify(stale));

    const list = BrowserTraces.list();
    expect(list.find((t) => t.id === legacy.id)).toMatchObject({
      stepCount: 2,
    });
    expect(list.find((t) => t.id === stale.id)).toMatchObject({
      status: "done",
      stepCount: 2,
    });
    // The legacy trace got its meta file written for next time.
    expect(fs.existsSync(BrowserTraces.metaFileFor(legacy.id))).toBe(true);
  });

  it("skips orphaned meta files and unreadable traces", () => {
    const trace = makeTrace();
    BrowserTraces.save(trace);
    fs.rmSync(BrowserTraces.fileFor(trace.id));
    const broken = makeTrace();
    fs.writeFileSync(BrowserTraces.fileFor(broken.id), "{not json");
    expect(BrowserTraces.list()).toEqual([]);
  });

  it("deletes both files", () => {
    const trace = makeTrace();
    BrowserTraces.save(trace);
    BrowserTraces.delete(trace.id);
    expect(fs.readdirSync(dir)).toEqual([]);
    expect(() => BrowserTraces.delete(trace.id)).not.toThrow();
    expect(() => BrowserTraces.delete("../../etc/passwd")).not.toThrow();
  });

  it("prunes the oldest traces past 200", () => {
    const traces = Array.from({ length: 203 }, () => makeTrace());
    traces.forEach((t) => BrowserTraces.save(t));
    BrowserTraces.prune();
    const kept = BrowserTraces.list().map((t) => t.id);
    expect(kept).toHaveLength(200);
    for (const t of traces.slice(0, 3)) {
      expect(kept).not.toContain(t.id);
      expect(fs.existsSync(BrowserTraces.fileFor(t.id))).toBe(false);
      expect(fs.existsSync(BrowserTraces.metaFileFor(t.id))).toBe(false);
    }
  });

  it("throttles saveSoon and lets save flush it", () => {
    jest.useFakeTimers();
    try {
      const trace = makeTrace({ status: "running" });
      BrowserTraces.saveSoon(trace);
      BrowserTraces.saveSoon({ ...trace, summary: "second" });
      expect(BrowserTraces.get(trace.id)).toBeNull();
      jest.advanceTimersByTime(2_000);
      expect(BrowserTraces.get(trace.id).summary).toBe("second");

      BrowserTraces.saveSoon({ ...trace, summary: "queued" });
      BrowserTraces.save({ ...trace, status: "done", summary: "final" });
      jest.advanceTimersByTime(5_000);
      // The queued save was dropped - the final one is not overwritten.
      expect(BrowserTraces.get(trace.id)).toMatchObject({
        status: "done",
        summary: "final",
      });
    } finally {
      jest.useRealTimers();
    }
  });
});

describe("BrowserTraces resume points", () => {
  const point = (overrides = {}) => ({
    url: "https://www.amazon.com/cart",
    title: "Amazon.com Shopping Cart",
    favicon: null,
    profile: { name: "Default", id: "default" },
    summary: "Added the AirPods to the cart.",
    notes: ["AirPods Pro 2 - $189"],
    progress: [],
    pages: [
      {
        url: "https://www.amazon.com/dp/B0D1XD1ZV3",
        title: "AirPods",
        lines: ["$189"],
      },
    ],
    endedAt: null,
    ...overrides,
  });

  it("keeps the new fields in the meta file but not the notes and digests", () => {
    const trace = makeTrace({
      threadSlug: "thread-1",
      workspace: { slug: "ws", name: "WS" },
      resumedFrom: "00000000-0000-4000-8000-000000000999",
      resumedFromTask: "earlier task",
      resume: point(),
    });
    BrowserTraces.save(trace);
    const [meta] = BrowserTraces.list();
    expect(meta).toMatchObject({
      threadSlug: "thread-1",
      workspace: { slug: "ws" },
      resumedFrom: trace.resumedFrom,
      sites: [{ host: "example.com" }],
      resume: {
        url: "https://www.amazon.com/cart",
        title: "Amazon.com Shopping Cart",
        profile: { name: "Default", id: "default" },
      },
    });
    expect(meta.resume.notes).toBeUndefined();
    expect(meta.resume.pages).toBeUndefined();
    // The full trace keeps everything.
    expect(BrowserTraces.get(trace.id).resume.pages).toHaveLength(1);
  });

  describe("findResumable", () => {
    let amazonOtherWs, zillowSameWs, amazonThread, zillowThread, noResume;
    beforeEach(() => {
      amazonOtherWs = makeTrace({
        task: "Add AirPods to my Amazon cart",
        workspace: { slug: "other", name: "Other" },
        resume: point(),
      });
      zillowSameWs = makeTrace({
        task: "Search Zillow for 3 bed homes in Austin",
        summary: "Found 12 homes.",
        workspace: { slug: "ws", name: "WS" },
        threadSlug: null,
        resume: point({
          url: "https://www.zillow.com/austin-tx/",
          title: "Austin TX Real Estate",
        }),
      });
      amazonThread = makeTrace({
        task: "Add a USB-C cable to my cart",
        workspace: { slug: "ws", name: "WS" },
        threadSlug: "t1",
        resume: point(),
      });
      zillowThread = makeTrace({
        task: "Search Zillow for condos",
        workspace: { slug: "ws", name: "WS" },
        threadSlug: "t1",
        resume: point({ url: "https://www.zillow.com/", title: "Zillow" }),
      });
      noResume = makeTrace({
        task: "Amazon cart check",
        workspace: { slug: "ws", name: "WS" },
        threadSlug: "t1",
      });
      for (const trace of [
        amazonOtherWs,
        zillowSameWs,
        amazonThread,
        zillowThread,
        noResume,
      ])
        BrowserTraces.save(trace);
    });

    it("takes the most recent session of the closest scope for generic queries", () => {
      const ws = { workspaceSlug: "ws" };
      expect(
        BrowserTraces.findResumable({ query: "last", ...ws, threadSlug: "t1" })
          .id
      ).toBe(zillowThread.id);
      // The workspace's default chat is its own thread.
      expect(
        BrowserTraces.findResumable({ query: "the previous session", ...ws }).id
      ).toBe(zillowSameWs.id);
      expect(
        BrowserTraces.findResumable({ query: "last", workspaceSlug: "nope" }).id
      ).toBe(zillowThread.id);
    });

    it("matches the query against task, result, sites and last page, closest scope first", () => {
      expect(
        BrowserTraces.findResumable({
          query: "amazon cart",
          workspaceSlug: "ws",
          threadSlug: "t1",
        }).id
      ).toBe(amazonThread.id);
      // Not in this thread - the workspace's Zillow session wins over the thread's Amazon one.
      expect(
        BrowserTraces.findResumable({
          query: "austin homes",
          workspaceSlug: "ws",
          threadSlug: "t1",
        }).id
      ).toBe(zillowSameWs.id);
      // Only another workspace has it.
      expect(
        BrowserTraces.findResumable({
          query: "airpods",
          workspaceSlug: "ws",
          threadSlug: "t1",
        }).id
      ).toBe(amazonOtherWs.id);
    });

    it("returns null when a specific query matches nothing, and skips running sessions", () => {
      expect(
        BrowserTraces.findResumable({
          query: "linkedin messages",
          workspaceSlug: "ws",
          threadSlug: "t1",
        })
      ).toBeNull();
      BrowserTraces.save({ ...zillowThread, status: "running" });
      expect(
        BrowserTraces.findResumable({
          query: "last",
          workspaceSlug: "ws",
          threadSlug: "t1",
        }).id
      ).toBe(amazonThread.id);
    });

    it("returns null when there is no saved session at all", () => {
      fs.rmSync(dir, { recursive: true, force: true });
      expect(BrowserTraces.findResumable({ query: "last" })).toBeNull();
    });
  });
});

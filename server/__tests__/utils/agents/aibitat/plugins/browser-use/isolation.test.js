/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// profiles.js and traces.js resolve their folders from STORAGE_DIR at require time.
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "browser-use-isolation-test-")
);
const {
  BrowserProfiles,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/driver/profiles.js");
const {
  BrowserTraces,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/traces.js");
const {
  BrowserAgent,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/agent.js");
const {
  BrowserBridge,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/bridge.js");
const {
  BrowserUseAccess,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/access.js");
const {
  allowedExtraArgs,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/driver/chromium.js");
const {
  isCloudMetadataUrl,
  isCloudMetadataIp,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/driver/cloudMetadata.js");

const CART = "https://www.amazon.com/gp/cart/view.html";

/** A finished session with a resume point, run by `userId`. */
function savedSession(id, userId) {
  const trace = {
    id,
    task: "Add AirPods to my Amazon cart",
    status: "done",
    summary: "Added AirPods to the cart.",
    userId,
    workspace: { slug: "ws", name: "WS" },
    threadSlug: null,
    tokens: { prompt: 0, completion: 0, total: 0 },
    startedAt: "2026-10-15T10:00:00.000Z",
    endedAt: "2026-10-15T10:05:00.000Z",
    steps: [],
    resume: {
      url: CART,
      title: "Cart",
      profile: { name: "Saved profile", id: `user-${userId}` },
      notes: [],
      progress: [],
      pages: [],
      endedAt: "2026-10-15T10:05:00.000Z",
    },
  };
  BrowserTraces.save(trace);
  return trace;
}

afterEach(() => jest.restoreAllMocks());
afterAll(() =>
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
);

describe("browser profiles", () => {
  it("gives single-user mode one profile and every user their own", () => {
    expect(BrowserProfiles.keyFor(null)).toBe("default");
    expect(BrowserProfiles.keyFor(7)).toBe("user-7");
    expect(BrowserProfiles.incognitoKeyFor("user-7")).toBe("incognito-user-7");
  });

  // Profile keys come from the admin's delete request - none may reach outside the profiles folder.
  it.each([["Work"], ["../user-1"], ["user-1/../../etc"], [".."], [null]])(
    "rejects %s as a profile key",
    (key) => {
      expect(BrowserProfiles.parse(key)).toBeNull();
      expect(BrowserProfiles.dirFor(key)).toBeNull();
    }
  );

  it("never gives an incognito browser a folder in storage", () => {
    expect(BrowserProfiles.dirFor("incognito-user-3")).toBeNull();
    expect(path.basename(BrowserProfiles.dirFor("user-3"))).toBe("user-3");
  });
});

describe("browser session history", () => {
  it("only lets a user resume their own sessions", () => {
    savedSession("00000000-0000-4000-8000-000000000005", 5);
    const lookup = (userId) =>
      BrowserTraces.findResumable({
        query: "last",
        workspaceSlug: "ws",
        userId,
      });
    expect(lookup(5)?.id).toBe("00000000-0000-4000-8000-000000000005");
    expect(lookup(6)).toBeNull();
    expect(lookup(null)).toBeNull();
  });

  it("deletes only the deleted user's sessions", () => {
    savedSession("00000000-0000-4000-8000-000000000010", 10);
    savedSession("00000000-0000-4000-8000-000000000011", 11);
    BrowserTraces.deleteForUser(10);
    expect(
      BrowserTraces.get("00000000-0000-4000-8000-000000000010")
    ).toBeNull();
    expect(
      BrowserTraces.get("00000000-0000-4000-8000-000000000011")
    ).not.toBeNull();
  });

  it("resumes on the profile it was given, never the one in the trace", async () => {
    const starts = [];
    jest
      .spyOn(BrowserBridge, "request")
      .mockImplementation(async (action, params) => {
        if (action === "start") {
          starts.push(params);
          return { profile: { name: "Saved profile", id: params.profile } };
        }
        return true;
      });
    const provider = {
      complete: jest.fn(async () => ({
        textResponse: "",
        functionCall: { id: "1", name: "done", arguments: { result: "ok" } },
      })),
    };
    const agent = new BrowserAgent({
      aibitat: {
        defaultProvider: {},
        functions: new Map(),
        getProviderForConfig: () => provider,
        handlerProps: { invocation: { workspace: { slug: "ws", name: "WS" } } },
      },
      task: "Remove the AirPods from my cart",
      profile: "user-3",
      startUrl: null,
      resumeFrom: savedSession("00000000-0000-4000-8000-000000000009", 9),
    });
    await agent.run();
    expect(starts.map((start) => start.profile)).toEqual(["user-3"]);
  });
});

describe("who may read a session", () => {
  const trace = { userId: 5 };
  const user = (id, role = "default") => ({ id, role });
  afterEach(() => delete process.env.DISABLE_VIEW_CHAT_HISTORY);

  it("lets the user who ran it and admins read it - not other users or managers", () => {
    expect(BrowserUseAccess.canReadTrace(trace, user(5), true)).toBe(true);
    expect(BrowserUseAccess.canReadTrace(trace, user(6), true)).toBe(false);
    expect(BrowserUseAccess.canReadTrace(trace, user(6, "manager"), true)).toBe(
      false
    );
    expect(BrowserUseAccess.canReadTrace(trace, user(1, "admin"), true)).toBe(
      true
    );
  });

  it("hides other users' sessions from admins when chat history is hidden", () => {
    process.env.DISABLE_VIEW_CHAT_HISTORY = "1";
    expect(BrowserUseAccess.canReadTrace(trace, user(1, "admin"), true)).toBe(
      false
    );
    expect(BrowserUseAccess.canReadTrace(trace, user(5), true)).toBe(true);
  });

  it("never treats a missing user as the owner of a single-user session", () => {
    expect(BrowserUseAccess.canReadTrace({ userId: null }, null, true)).toBe(
      false
    );
    expect(BrowserUseAccess.canReadTrace({ userId: null }, user(2), true)).toBe(
      false
    );
    expect(BrowserUseAccess.canReadTrace({ userId: null }, null, false)).toBe(
      true
    );
  });
});

describe("the browser's sandbox", () => {
  it("drops every ANYTHINGLLM_CHROMIUM_ARGS flag that could weaken the browser", () => {
    expect(
      allowedExtraArgs(
        [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--single-process",
          "--no-zygote",
          "--disable-gpu-sandbox",
          "--remote-debugging-port=9222",
          "--user-data-dir=/app/server/storage/browser-use/profiles/user-1",
          "--renderer-cmd-prefix=sh -c id",
          "--disable-web-security",
          "--proxy-server=http://proxy:3128",
          "--disable-gpu",
        ].join(",")
      )
    ).toEqual(["--proxy-server=http://proxy:3128", "--disable-gpu"]);
  });
});

describe("cloud metadata services", () => {
  it.each([
    "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
    "http://169.254.170.2/v2/credentials",
    "http://2852039166/",
    "http://0xa9fea9fe/",
    "http://0251.0376.0251.0376/",
    "http://[::ffff:169.254.169.254]/",
    "http://[fd00:ec2::254]/latest/meta-data/",
    "http://metadata.google.internal/computeMetadata/v1/",
    "http://METADATA.GOOGLE.INTERNAL./computeMetadata/v1/",
    "http://100.100.100.200/latest/meta-data/",
  ])("blocks %s", (url) => {
    expect(isCloudMetadataUrl(url)).toBe(true);
  });

  it.each([
    "https://www.amazon.com/",
    "http://169.254.example.com/",
    "http://10.0.0.5/",
    "http://localhost:3001/",
  ])("allows %s", (url) => {
    expect(isCloudMetadataUrl(url)).toBe(false);
  });

  it("catches a page served from a metadata address under another name", () => {
    expect(isCloudMetadataIp("169.254.169.254")).toBe(true);
    expect(isCloudMetadataIp("[fe80::1]")).toBe(true);
    expect(isCloudMetadataIp("93.184.216.34")).toBe(false);
  });
});

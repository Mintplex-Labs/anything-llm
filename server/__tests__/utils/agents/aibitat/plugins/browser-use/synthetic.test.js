/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// traces.js resolves its folder from STORAGE_DIR at require time.
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "browser-use-synthetic-test-")
);
const {
  BrowserAgent,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/agent.js");
const {
  BrowserBridge,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/bridge.js");

const URL = "https://www.microcenter.com/";
const WALL = { wall: true, kind: "captcha", score: 9 };
const blocked = {
  ok: true,
  outcome: `Opened ${URL}`,
  state: "[T1] Press and hold to confirm you are human",
  page: { url: URL, title: "Micro Center", favicon: null },
  blocker: WALL,
};

afterEach(() => jest.restoreAllMocks());
afterAll(() =>
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
);

describe("calls the model never made", () => {
  it("are sent as notes in native mode, never as tool calls (Gemini needs a thought_signature on every tool call)", async () => {
    jest
      .spyOn(BrowserBridge, "request")
      .mockImplementation(async (action, params) => {
        if (action === "start")
          return {
            profile: { name: "Saved profile", id: params.profile },
            result: blocked,
          };
        // Still blocked after the user's reply, so the pause stays in the history.
        if (action === "act") return blocked;
        return true;
      });
    const seen = [];
    const provider = {
      complete: jest.fn(async (messages) => {
        seen.push(messages);
        if (seen.length === 1)
          return {
            textResponse: "",
            functionCall: {
              id: "real-1",
              name: "done",
              arguments: { success: false, result: "Blocked by a check." },
              extra_content: { google: { thought_signature: "sig" } },
            },
          };
        return { textResponse: "COMPLETE\n\nBlocked by a human check." };
      }),
    };
    const agent = new BrowserAgent({
      aibitat: {
        defaultProvider: {},
        functions: new Map(),
        getProviderForConfig: () => provider,
        handlerProps: { invocation: { workspace: { slug: "ws", name: "WS" } } },
      },
      task: "Check RTX prices at Micro Center",
      profile: "default",
      startUrl: URL,
    });
    const running = agent.run();
    // The agent pauses on the captcha wall and waits for the user.
    while (!agent.reply("I could not get past it"))
      await new Promise((r) => setImmediate(r));
    await running;

    const first = seen[0];
    expect(first.some((m) => m.role === "function")).toBe(false);
    const note = first.find(
      (m) => m.role === "user" && String(m.content).startsWith("[ask_user")
    );
    expect(note.content).toMatch(/The user replied: I could not get past it/);
  });
});

/* eslint-env jest */
// traces.js resolves its folder from STORAGE_DIR at require time.
process.env.STORAGE_DIR ??= require("fs").mkdtempSync(
  require("path").join(require("os").tmpdir(), "browser-use-test-")
);
const {
  parseVerdict,
  parseJsonAction,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/agent.js");

describe("parseVerdict", () => {
  it.each([
    ["GIVE_UP\nThe site has no such product.", "GIVE_UP"],
    ["GIVE UP\nNothing here.", "GIVE_UP"],
    ["GIVEUP\nNothing here.", "GIVE_UP"],
    ["giveup - nothing here", "GIVE_UP"],
    ["CONTINUE\nOpen the second result.", "CONTINUE"],
    ["**Finish**: the prices are already collected.", "FINISH"],
    ["back\nReturn to the product page.", "BACK"],
    ["<think>maybe FINISH?</think>\nCONTINUE\nKeep going.", "CONTINUE"],
  ])("reads %j as %s", (text, verdict) => {
    expect(parseVerdict(text).verdict).toBe(verdict);
  });

  it("takes the reason from the same line or the next one", () => {
    expect(parseVerdict("FINISH - prices are on the page").reason).toBe(
      "prices are on the page"
    );
    expect(parseVerdict("GIVEUP\nThe site is down.").reason).toBe(
      "The site is down."
    );
  });

  it("returns null without a verdict on the first line", () => {
    expect(parseVerdict("I think it should keep going.\nCONTINUE")).toBeNull();
    expect(parseVerdict("")).toBeNull();
    expect(parseVerdict(undefined)).toBeNull();
  });
});

describe("parseJsonAction", () => {
  it("pulls a tool call out of fenced or surrounding text", () => {
    expect(
      parseJsonAction(
        'Sure:\n```json\n{"tool": "click", "args": {"id": 3}}\n```'
      )
    ).toEqual({ name: "click", args: { id: 3 } });
    expect(parseJsonAction('{"name": "go_back", "arguments": "{}"}')).toEqual({
      name: "go_back",
      args: {},
    });
    expect(parseJsonAction("no json here")).toBeNull();
  });
});

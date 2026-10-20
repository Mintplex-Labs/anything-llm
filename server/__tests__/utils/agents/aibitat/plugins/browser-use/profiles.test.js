/* eslint-env jest */
// profiles.js resolves its folder from STORAGE_DIR at require time.
process.env.STORAGE_DIR ??= require("fs").mkdtempSync(
  require("path").join(require("os").tmpdir(), "browser-use-test-")
);

const {
  BrowserProfiles,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/driver/profiles.js");

describe("BrowserProfiles", () => {
  it("gives single-user mode one profile and every user their own", () => {
    expect(BrowserProfiles.keyFor(null)).toBe("default");
    expect(BrowserProfiles.keyFor(7)).toBe("user-7");
    expect(BrowserProfiles.incognitoKeyFor("user-7")).toBe("incognito-user-7");
    expect(BrowserProfiles.userIdOf("user-7")).toBe(7);
    expect(BrowserProfiles.userIdOf("default")).toBeNull();
  });

  it.each([
    ["default", { owner: "default", incognito: false }],
    ["user-12", { owner: "user-12", incognito: false }],
    ["incognito-user-12", { owner: "user-12", incognito: true }],
    ["incognito-default", { owner: "default", incognito: true }],
    ["Work", null],
    ["../user-1", null],
    ["user-1/../../etc", null],
    [null, null],
  ])("parses %s", (key, parsed) => {
    expect(BrowserProfiles.parse(key)).toEqual(parsed);
  });

  it("only saved profiles have a folder", () => {
    const dir = BrowserProfiles.dirFor("user-3");
    expect(require("path").basename(dir)).toBe("user-3");
    expect(require("path").basename(require("path").dirname(dir))).toBe(
      "profiles"
    );
    expect(BrowserProfiles.dirFor("incognito-user-3")).toBeNull();
    expect(BrowserProfiles.dirFor("..")).toBeNull();
  });
});

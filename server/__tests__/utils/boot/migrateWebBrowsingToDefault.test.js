process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const { SystemSettings } = require("../../../models/systemSettings");
jest.mock("../../../models/systemSettings");

const migrateWebBrowsingToDefault = require("../../../utils/boot/migrateWebBrowsingToDefault");

const MIGRATION_LABEL = "__migration_web_browser_to_default";

/**
 * Build a SystemSettings mock backed by a simple label => value map so the
 * migration reads/writes behave like the real upsert semantics.
 */
function mockSettings(initial = {}) {
  const store = { ...initial };
  SystemSettings.get = jest.fn(async ({ label }) =>
    label in store ? { label, value: store[label] } : null
  );
  SystemSettings.getValueOrFallback = jest.fn(
    async ({ label }, fallback) => store[label] ?? fallback
  );
  SystemSettings.isOnboardingComplete = jest.fn(
    async () => store.onboarding_complete === "true"
  );
  SystemSettings._updateSettings = jest.fn(async (updates) => {
    for (const [key, value] of Object.entries(updates)) {
      // Mirror the real validators for skill lists: csv string -> JSON array string.
      if (["default_agent_skills", "disabled_agent_skills"].includes(key)) {
        store[key] = JSON.stringify(value.split(",").filter(Boolean));
        continue;
      }
      store[key] = String(value);
    }
    return { success: true, error: null };
  });
  return store;
}

describe("migrateWebBrowsingToDefault", () => {
  let logSpy;
  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => logSpy.mockRestore());

  it("skips entirely when the migration marker already exists", async () => {
    const store = mockSettings({
      [MIGRATION_LABEL]: "true",
      onboarding_complete: "true",
      default_agent_skills: JSON.stringify(["web-browsing"]),
    });

    const ran = await migrateWebBrowsingToDefault();

    expect(ran).toBe(false);
    expect(SystemSettings.isOnboardingComplete).not.toHaveBeenCalled();
    expect(SystemSettings._updateSettings).not.toHaveBeenCalled();
    expect(store.default_agent_skills).toBe(JSON.stringify(["web-browsing"]));
  });

  it("does not modify skills on a fresh instance but writes the marker", async () => {
    const store = mockSettings({});

    const ran = await migrateWebBrowsingToDefault();

    expect(ran).toBe(false);
    expect(SystemSettings._updateSettings).toHaveBeenCalledTimes(1);
    expect(SystemSettings._updateSettings).toHaveBeenCalledWith({
      [MIGRATION_LABEL]: "true",
    });
    expect(store.default_agent_skills).toBeUndefined();
    expect(store.disabled_agent_skills).toBeUndefined();
  });

  it("removes web-browsing from default_agent_skills when previously opted in", async () => {
    const store = mockSettings({
      onboarding_complete: "true",
      default_agent_skills: JSON.stringify([
        "create-chart",
        "web-browsing",
        "sql-agent",
      ]),
    });

    const ran = await migrateWebBrowsingToDefault();

    expect(ran).toBe(true);
    expect(JSON.parse(store.default_agent_skills)).toEqual([
      "create-chart",
      "sql-agent",
    ]);
    expect(store.disabled_agent_skills).toBeUndefined();
    expect(store[MIGRATION_LABEL]).toBe("true");
  });

  it("adds web-browsing to disabled_agent_skills when previously not enabled", async () => {
    const store = mockSettings({
      onboarding_complete: "true",
      default_agent_skills: JSON.stringify(["create-chart"]),
      disabled_agent_skills: JSON.stringify(["rag-memory"]),
    });

    const ran = await migrateWebBrowsingToDefault();

    expect(ran).toBe(true);
    expect(JSON.parse(store.default_agent_skills)).toEqual(["create-chart"]);
    expect(JSON.parse(store.disabled_agent_skills)).toEqual([
      "rag-memory",
      "web-browsing",
    ]);
    expect(store[MIGRATION_LABEL]).toBe("true");
  });

  it("disables web-browsing when no skill settings exist at all on an onboarded instance", async () => {
    const store = mockSettings({ onboarding_complete: "true" });

    const ran = await migrateWebBrowsingToDefault();

    expect(ran).toBe(true);
    expect(JSON.parse(store.disabled_agent_skills)).toEqual(["web-browsing"]);
    expect(store[MIGRATION_LABEL]).toBe("true");
  });

  it("does not duplicate web-browsing if already present in disabled_agent_skills", async () => {
    const store = mockSettings({
      onboarding_complete: "true",
      disabled_agent_skills: JSON.stringify(["web-browsing"]),
    });

    const ran = await migrateWebBrowsingToDefault();

    expect(ran).toBe(true);
    expect(JSON.parse(store.disabled_agent_skills)).toEqual(["web-browsing"]);
    expect(SystemSettings._updateSettings).toHaveBeenCalledTimes(1); // marker only
  });

  it("is idempotent across boots", async () => {
    const store = mockSettings({
      onboarding_complete: "true",
      default_agent_skills: JSON.stringify(["web-browsing"]),
    });

    expect(await migrateWebBrowsingToDefault()).toBe(true);
    expect(await migrateWebBrowsingToDefault()).toBe(false);
    expect(JSON.parse(store.default_agent_skills)).toEqual([]);
    expect(store.disabled_agent_skills).toBeUndefined();
  });

  it("returns false and does not write the marker if an error occurs", async () => {
    mockSettings({ onboarding_complete: "true" });
    SystemSettings.getValueOrFallback = jest
      .fn()
      .mockRejectedValue(new Error("db down"));
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const ran = await migrateWebBrowsingToDefault();

    expect(ran).toBe(false);
    expect(SystemSettings._updateSettings).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });
});

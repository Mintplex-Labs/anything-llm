const {
  __resetRequiredDocsStatusCacheForTests,
  buildDoctrineState,
  getNextAction,
  getSwarmsyOnboardingStatus,
  getWorkspaceState,
} = require("../../../utils/swarmsy/onboardingStatus");
const { Workspace } = require("../../../models/workspace");

jest.mock("../../../models/workspace", () => ({
  Workspace: {
    _findFirst: jest.fn(),
  },
}));

jest.mock("../../../utils/http", () => ({
  safeJsonParse: (str, fallback = null) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  },
}));

jest.mock("../../../utils/swarmsy/applyWorkspacePreset", () => ({
  PRESET_NAME: "SWARMSY HIVE",
}));

jest.mock("../../../utils/swarmsy/requiredDocs", () => ({
  getSwarmsyRequiredDocsStatus: jest.fn(),
}));

const {
  getSwarmsyRequiredDocsStatus,
} = require("../../../utils/swarmsy/requiredDocs");

describe("swarmsy onboarding status helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __resetRequiredDocsStatusCacheForTests();
  });

  const doctrineStatus = {
    success: true,
    docsRootAvailable: true,
    summary: {
      requiredMissing: 0,
      optionalMissing: 1,
    },
    groups: [
      {
        required: true,
        files: [
          {
            path: "docs/swarmsy/required-a.md",
            present: true,
            loadable: true,
          },
        ],
      },
      {
        required: false,
        files: [
          {
            path: "docs/swarmsy/optional-a.md",
            present: true,
            loadable: true,
          },
        ],
      },
    ],
  };

  it("returns setup-needed status when no HIVE workspace exists", async () => {
    Workspace._findFirst.mockResolvedValue(null);

    const status = await getSwarmsyOnboardingStatus({
      user: { id: 44 },
      doctrineStatus,
    });

    expect(Workspace._findFirst).toHaveBeenCalledWith({
      where: {
        name: "SWARMSY HIVE",
        workspace_users: { some: { user_id: 44 } },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        documents: {
          select: {
            metadata: true,
          },
        },
      },
    });
    expect(status.workspace).toEqual({
      exists: false,
      state: "setup_needed",
      ready: false,
    });
    expect(status.nextAction.type).toBe("create_hive");
  });

  it("marks an existing HIVE as underloaded when doctrine is loadable but not attached", async () => {
    Workspace._findFirst.mockResolvedValue({
      id: 7,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    });

    const status = await getSwarmsyOnboardingStatus({
      user: { id: 7 },
      doctrineStatus,
    });

    expect(status.workspace).toMatchObject({
      exists: true,
      id: 7,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      state: "underloaded",
      ready: false,
    });
    expect(status.doctrine).toMatchObject({
      statusAvailable: true,
      requiredMissing: 0,
      requiredNonLoadable: 0,
      optionalMissing: 1,
      requiredLoadable: 1,
      requiredAttached: 0,
      requiredPendingIngestion: 1,
      ingestionRequired: true,
    });
    expect(status.nextAction.type).toBe("continue_or_load_docs");
  });

  it("marks HIVE as ready only when required doctrine docs are already attached", async () => {
    Workspace._findFirst.mockResolvedValue({
      id: 9,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [
        {
          metadata: JSON.stringify({
            chunkSource: "swarmsy-required://docs/swarmsy/required-a.md",
          }),
        },
      ],
    });

    const status = await getSwarmsyOnboardingStatus({
      user: { id: 9 },
      doctrineStatus,
    });

    expect(status.workspace.state).toBe("ready");
    expect(status.workspace.ready).toBe(true);
    expect(status.doctrine.ingestionRequired).toBe(false);
    expect(status.doctrine.requiredNonLoadable).toBe(0);
    expect(status.nextAction.type).toBe("open_hive");
  });

  it("surfaces unavailable doctrine docs truthfully for an existing workspace", () => {
    const doctrine = buildDoctrineState(
      {
        success: true,
        docsRootAvailable: false,
        summary: {
          requiredMissing: 2,
          optionalMissing: 0,
        },
        groups: [],
      },
      {
        id: 1,
        documents: [],
      }
    );

    expect(doctrine).toMatchObject({
      statusAvailable: true,
      docsRootAvailable: false,
      requiredMissing: 2,
      requiredNonLoadable: 0,
      ingestionRequired: false,
    });
    expect(doctrine.note).toContain("authorized setup route");
    expect(getWorkspaceState({ id: 1 }, doctrine)).toBe("underloaded");
    expect(getNextAction({ id: 1 }, doctrine).type).toBe(
      "authorized_setup_required"
    );
  });

  it("marks HIVE as underloaded when required docs are present but not loadable", async () => {
    const nonLoadableDoctrineStatus = {
      success: true,
      docsRootAvailable: true,
      summary: {
        requiredMissing: 0,
        optionalMissing: 0,
      },
      groups: [
        {
          required: true,
          files: [
            {
              path: "docs/swarmsy/required-a.md",
              present: true,
              loadable: false,
            },
            {
              path: "docs/swarmsy/required-b.md",
              present: true,
              loadable: false,
            },
          ],
        },
      ],
    };

    Workspace._findFirst.mockResolvedValue({
      id: 5,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    });

    const status = await getSwarmsyOnboardingStatus({
      user: { id: 5 },
      doctrineStatus: nonLoadableDoctrineStatus,
    });

    expect(status.workspace.state).toBe("underloaded");
    expect(status.workspace.ready).toBe(false);
    expect(status.doctrine).toMatchObject({
      statusAvailable: true,
      requiredMissing: 0,
      requiredNonLoadable: 2,
      requiredLoadable: 0,
      ingestionRequired: false,
    });
    expect(status.doctrine.note).toContain("not loadable");
    expect(status.nextAction.type).toBe("authorized_setup_required");
    expect(status.nextAction.type).not.toBe("open_hive");
  });

  it("returns conservative doctrine status when getSwarmsyRequiredDocsStatus throws", async () => {
    Workspace._findFirst.mockResolvedValue({
      id: 3,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    });
    getSwarmsyRequiredDocsStatus.mockImplementation(() => {
      throw new Error("Manifest not found");
    });

    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const status = await getSwarmsyOnboardingStatus({ user: { id: 3 } });

    expect(status.doctrine).toMatchObject({
      statusAvailable: false,
      docsRootAvailable: false,
      requiredMissing: null,
      requiredNonLoadable: null,
      optionalMissing: null,
      requiredLoadable: null,
      requiredAttached: null,
      requiredPendingIngestion: null,
      ingestionRequired: null,
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "SWARMSY required docs status unavailable:",
      "Manifest not found"
    );
    expect(status.doctrine.note).toContain("unavailable");
    expect(status.workspace.state).toBe("underloaded");
    expect(status.workspace.ready).toBe(false);

    consoleWarnSpy.mockRestore();
  });

  it("caches required docs status within the ttl window", async () => {
    Workspace._findFirst.mockResolvedValue({
      id: 3,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    });
    getSwarmsyRequiredDocsStatus.mockReturnValue(doctrineStatus);
    const nowSpy = jest.spyOn(Date, "now");
    nowSpy.mockReturnValueOnce(1000).mockReturnValueOnce(1001);

    await getSwarmsyOnboardingStatus({ user: { id: 3 } });
    await getSwarmsyOnboardingStatus({ user: { id: 3 } });

    expect(getSwarmsyRequiredDocsStatus).toHaveBeenCalledTimes(1);
    nowSpy.mockRestore();
  });

  it("caches null required docs status within the ttl window when helper throws", async () => {
    Workspace._findFirst.mockResolvedValue({
      id: 3,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    });
    getSwarmsyRequiredDocsStatus.mockImplementation(() => {
      throw new Error("Manifest not found");
    });

    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const nowSpy = jest.spyOn(Date, "now");
    nowSpy.mockReturnValueOnce(1000).mockReturnValueOnce(1001);

    const firstStatus = await getSwarmsyOnboardingStatus({ user: { id: 3 } });
    const secondStatus = await getSwarmsyOnboardingStatus({ user: { id: 3 } });

    expect(getSwarmsyRequiredDocsStatus).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(firstStatus.doctrine.statusAvailable).toBe(false);
    expect(secondStatus.doctrine.statusAvailable).toBe(false);

    nowSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});

process.env.STORAGE_DIR = "test-storage";
jest.mock("../../../models/documents", () => ({
  Document: {
    where: jest.fn(),
  },
}));

jest.mock("../../../utils/swarmsy/sparkyWikiSeedPacks", () => ({
  discoverRelevantIdentityEmpireSections: jest.fn(
    ({ prompt = "", mode = "" }) => {
      const text = `${prompt} ${mode}`.toLowerCase();
      const files = new Set(["IDENTITY_EMPIRE_INDEX.md"]);
      if (/identity|from nothing|no idea/.test(text)) {
        files.add("01_identity_operating_system.md");
        files.add("02_no_idea_user_intake.md");
      }
      if (/face|founder|public|brand/.test(text)) {
        files.add("03_brand_foundation_builder.md");
        files.add("04_story_myth_and_manifesto.md");
      }
      if (/hidden|alias|pseudonym/.test(text)) {
        files.add("02_no_idea_user_intake.md");
        files.add("04_story_myth_and_manifesto.md");
      }
      if (/existing|audit|rebuild|relaunch|brand/.test(text)) {
        files.add("03_brand_foundation_builder.md");
        files.add("06_campaign_builder.md");
        files.add("13_30_day_identity_empire_launch.md");
      }
      if (/campaign|stickup/.test(text)) files.add("06_campaign_builder.md");
      if (/pr|press|ghost/.test(text)) files.add("07_pr_and_press_machine.md");
      if (/30[- ]?day|launch/.test(text)) {
        files.add("13_30_day_identity_empire_launch.md");
      }
      if (/measure|measurement|signal|analytics|kpi|metrics/.test(text)) {
        files.add("16_measurement_signal_and_next_moves.md");
      }
      return [...files].map((file) => ({ file, packId: "identity-empire" }));
    }
  ),
}));

const { Document } = require("../../../models/documents");
const {
  buildIdentityEmpireRetrievalPlan,
  getWorkspaceIdentityEmpireFiles,
  isIdentityEmpirePrompt,
  resolveSparkyMode,
} = require("../../../utils/swarmsy/identityEmpireRetrieval");

function identityEmpireDoc(workspaceId, file) {
  return {
    workspaceId,
    metadata: JSON.stringify({
      chunkSource: `sparky-wiki-seed-pack://identity-empire/${file}`,
      sparkyWikiSeedPack: "identity-empire",
      sparkyWikiSeedPackFile: file,
      localFirst: true,
      optionalReferenceKnowledge: true,
    }),
  };
}

describe("Identity Empire retrieval planning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("detects imported Identity Empire docs only inside the current workspace", async () => {
    Document.where.mockImplementation(async (clause) =>
      clause.workspaceId === 101
        ? [identityEmpireDoc(101, "03_brand_foundation_builder.md")]
        : []
    );

    await expect(
      getWorkspaceIdentityEmpireFiles({ id: 101, slug: "workspace-a" })
    ).resolves.toEqual(new Set(["03_brand_foundation_builder.md"]));
    await expect(
      getWorkspaceIdentityEmpireFiles({ id: 202, slug: "workspace-b" })
    ).resolves.toEqual(new Set());
    expect(Document.where).toHaveBeenCalledWith(
      { workspaceId: 101 },
      null,
      null,
      null,
      { metadata: true }
    );
    expect(Document.where).toHaveBeenCalledWith(
      { workspaceId: 202 },
      null,
      null,
      null,
      { metadata: true }
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each([
    [
      "Face Identity Mode",
      "Start my SWARMSY intake in Face Identity Mode. Build my public founder story and PR angle.",
      [
        "03_brand_foundation_builder.md",
        "04_story_myth_and_manifesto.md",
        "07_pr_and_press_machine.md",
      ],
      "public identity",
    ],
    [
      "Hidden Identity Mode",
      "Start my SWARMSY intake in Hidden Identity Mode. Build an alias/pseudonym-safe campaign.",
      [
        "02_no_idea_user_intake.md",
        "04_story_myth_and_manifesto.md",
        "06_campaign_builder.md",
      ],
      "pseudonym safety",
    ],
    [
      "Existing Project",
      "Help me import an Existing Project, audit weak positioning, rebuild my offer, and relaunch.",
      [
        "03_brand_foundation_builder.md",
        "06_campaign_builder.md",
        "13_30_day_identity_empire_launch.md",
      ],
      "existing project audit",
    ],
    [
      "Load Memory Lock",
      "Continue this SWARMSY project from the memory lock and create my 30-day launch plan.",
      ["13_30_day_identity_empire_launch.md"],
      "without overwriting existing user identity",
    ],
  ])(
    "builds a %s retrieval query with mode-aware Identity Empire sections",
    async (_mode, prompt, expectedFiles, expectedFocus) => {
      Document.where.mockResolvedValue([
        identityEmpireDoc(101, "IDENTITY_EMPIRE_INDEX.md"),
        identityEmpireDoc(101, "01_identity_operating_system.md"),
        identityEmpireDoc(101, "02_no_idea_user_intake.md"),
        identityEmpireDoc(101, "03_brand_foundation_builder.md"),
        identityEmpireDoc(101, "04_story_myth_and_manifesto.md"),
        identityEmpireDoc(101, "06_campaign_builder.md"),
        identityEmpireDoc(101, "07_pr_and_press_machine.md"),
        identityEmpireDoc(101, "13_30_day_identity_empire_launch.md"),
      ]);

      const plan = await buildIdentityEmpireRetrievalPlan({
        workspace: { id: 101, slug: "workspace-a" },
        prompt,
      });

      expect(plan.available).toBe(true);
      expect(plan.status).toBe("Using local wiki knowledge");
      expect(plan.mode).toBe(resolveSparkyMode({ prompt }));
      expect(plan.retrievalInput).toContain(
        "Use as supporting knowledge only; keep the existing Sparky intake/memory flow primary."
      );
      expect(plan.retrievalInput).toContain(expectedFocus);
      expectedFiles.forEach((file) => {
        expect(plan.sections.map((section) => section.file)).toContain(file);
        expect(plan.retrievalInput).toContain(file);
      });
      expect(global.fetch).not.toHaveBeenCalled();
    }
  );

  it.each([
    ["Build my identity empire from nothing.", true],
    ["Create my 30-day launch plan.", true],
    ["Act as SIGNAL and tell me what to measure for this campaign.", true],
    ["How do I measure voltage from this document?", false],
    ["How do I measure latency from this doc?", false],
    ["What does this signal value mean in the dataset?", false],
    ["What brand metrics should I measure?", true],
    ["What campaign signals should I track?", true],
  ])(
    "classifies Identity Empire prompt specificity for %s",
    (prompt, expected) => {
      expect(isIdentityEmpirePrompt(prompt)).toBe(expected);
    }
  );

  it.each([
    ["Build my identity empire from nothing.", "Using local wiki knowledge"],
    ["Create my 30-day launch plan.", "Using local wiki knowledge"],
    [
      "Act as SIGNAL and tell me what to measure for this campaign.",
      "Using local wiki knowledge",
    ],
    [
      "How do I measure voltage from this document?",
      "Identity Empire knowledge available",
    ],
    [
      "How do I measure latency from this doc?",
      "Identity Empire knowledge available",
    ],
    [
      "What does this signal value mean in the dataset?",
      "Identity Empire knowledge available",
    ],
    ["What brand metrics should I measure?", "Using local wiki knowledge"],
    ["What campaign signals should I track?", "Using local wiki knowledge"],
  ])(
    "only appends Identity Empire retrieval focus for specific identity prompts: %s",
    async (prompt, expectedStatus) => {
      Document.where.mockResolvedValue([
        identityEmpireDoc(101, "IDENTITY_EMPIRE_INDEX.md"),
        identityEmpireDoc(101, "01_identity_operating_system.md"),
        identityEmpireDoc(101, "06_campaign_builder.md"),
        identityEmpireDoc(101, "13_30_day_identity_empire_launch.md"),
        identityEmpireDoc(101, "16_measurement_signal_and_next_moves.md"),
      ]);

      const plan = await buildIdentityEmpireRetrievalPlan({
        workspace: { id: 101, slug: "workspace-a" },
        prompt,
      });

      expect(plan.status).toBe(expectedStatus);
      if (expectedStatus === "Using local wiki knowledge") {
        expect(plan.retrievalInput).toContain(
          "SPARKY Wiki Identity Empire local retrieval focus:"
        );
      } else {
        expect(plan.retrievalInput).toBe(prompt);
      }
    }
  );

  it("leaves Sparky on the existing intake path when no pack is imported", async () => {
    Document.where.mockResolvedValue([]);

    const prompt = "Build my identity empire from nothing.";
    const plan = await buildIdentityEmpireRetrievalPlan({
      workspace: { id: 202, slug: "workspace-b" },
      prompt,
    });

    expect(plan.available).toBe(false);
    expect(plan.status).toBe("No Identity Empire knowledge added yet");
    expect(plan.sections).toEqual([]);
    expect(plan.retrievalInput).toBe(prompt);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

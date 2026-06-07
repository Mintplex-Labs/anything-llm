process.env.STORAGE_DIR = "test-storage";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
jest.mock("../../../models/documents", () => ({
  Document: {
    where: jest.fn(),
  },
}));

jest.mock("../../../utils/swarmsy/sparkyWikiSeedPacks", () => ({
  discoverRelevantOptionalSeedPackSections: jest.fn(() => []),
  getWorkspaceSeedPackFiles: jest.fn(() => new Map()),
  optionalCampaignPackPromptMatches: jest.fn((prompt = "") =>
    /campaign|launch|brand|public signal|public relations|earned media|advertising|copy|positioning|propaganda|persuasion|media|stunt|spectacle|scarcity|drop|limited|queue|hype|meme|\barg\b|viral|culture|press|\bpr\b|case stud|nike|just do it|slogan|identity compression|banksy|street art|mystery|archive|supreme|red bull|stratos|event|world record|apple 1984|apple|1984|category|enemy|disrupt|bernays|berneys|public opinion|ogilvy/i.test(
      String(prompt || "")
    )
  ),
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
  shouldCheckOptionalCampaignPacks,
} = require("../../../utils/swarmsy/identityEmpireRetrieval");
const {
  discoverRelevantOptionalSeedPackSections,
  getWorkspaceSeedPackFiles,
} = require("../../../utils/swarmsy/sparkyWikiSeedPacks");

function loadFrontendHandoffModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../../frontend/src/components/SwarmsyFirstRunOnboarding/handoff.js"
      ),
      "utf8"
    )
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");
  const script = new vm.Script(
    `${source}
module.exports = { getIntakeStarterMessage };`
  );
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

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
    ["face", "Face Identity Mode"],
    ["hidden", "Hidden Identity Mode"],
    ["existing-project", "Existing Project"],
  ])(
    "keeps %s starter prompts in their explicit mode despite Memory Lock safety text",
    (mode, expectedMode) => {
      const { getIntakeStarterMessage } = loadFrontendHandoffModule();
      const prompt = getIntakeStarterMessage(mode, {
        identityEmpireAvailable: true,
      });

      expect(prompt).toContain("Do not overwrite Memory Lock");
      expect(resolveSparkyMode({ prompt })).toBe(expectedMode);
    }
  );

  it.each([
    "Load Memory Lock",
    "Continue this SWARMSY project from the memory lock below.",
    "Memory lock wins over fresh intake.",
    "Continue this project from memory lock before next actions.",
    "Resume this locked project and show next best action.",
  ])(
    "resolves explicit memory-lock intent as Load Memory Lock: %s",
    (prompt) => {
      expect(resolveSparkyMode({ prompt })).toBe("Load Memory Lock");
    }
  );

  it("does not treat generic Memory Lock overwrite safety text as Load Memory Lock", () => {
    expect(
      resolveSparkyMode({
        prompt:
          "Start my SWARMSY intake in Face Identity Mode. Do not overwrite Memory Lock or existing identity unless I confirm.",
      })
    ).toBe("Face Identity Mode");
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
      "audit, weak positioning",
    ],
    [
      "Load Memory Lock",
      "Continue this SWARMSY project from the memory lock and create my 30-day launch plan.",
      ["13_30_day_identity_empire_launch.md"],
      "without overwriting existing user identity unless confirmed",
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
        "Use as supporting knowledge only; keep the existing Sparky intake/memory flow primary"
      );
      expect(plan.retrievalInput).toContain(
        "Do not overwrite Memory Lock or existing identity unless the user confirms."
      );
      expect(plan.retrievalInput).toContain(
        "Do not use web/API unless Use API is explicitly enabled; use Ollama/local-first"
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
    ["advertising copy", true],
    ["public relations ethics", true],
    ["positioning strategy", true],
    ["propaganda analysis", true],
    ["build a PR angle for my campaign", true],
    ["make an ARG mystery trail campaign", true],
    ["What should Bernays teach this launch?", true],
    ["Use Ogilvy research for this offer", true],
    ["private hidden identity project", false],
    ["what is the target audience?", false],
    ["privacy boundary for hidden identity", false],
    ["How do I measure privacy risk in this project?", false],
    ["How do I measure voltage from this document?", false],
  ])(
    "checks optional campaign pack keyword gate for %s",
    (prompt, expected) => {
      expect(shouldCheckOptionalCampaignPacks(prompt)).toBe(expected);
    }
  );

  it.each([
    ["Build my identity empire from nothing.", true],
    ["Create my 30-day launch plan.", true],
    ["Act as SIGNAL and tell me what to measure for this campaign.", true],
    ["How do I measure voltage from this document?", false],
    ["How do I measure latency from this doc?", false],
    ["What does this signal value mean in the dataset?", false],
    ["How do I measure privacy risk in this project?", false],
    ["What PR metrics should I measure?", true],
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
    [
      "How do I measure privacy risk in this project?",
      "Identity Empire knowledge available",
    ],
    ["What PR metrics should I measure?", "Using local wiki knowledge"],
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

  it("does not query optional campaign packs for ordinary Identity Empire prompts", async () => {
    Document.where.mockResolvedValue([
      identityEmpireDoc(101, "IDENTITY_EMPIRE_INDEX.md"),
      identityEmpireDoc(101, "01_identity_operating_system.md"),
    ]);

    const plan = await buildIdentityEmpireRetrievalPlan({
      workspace: { id: 101, slug: "workspace-a" },
      prompt: "Build my identity empire from nothing.",
    });

    expect(plan.status).toBe("Using local wiki knowledge");
    expect(plan.retrievalInput).toContain(
      "SPARKY Wiki Identity Empire local retrieval focus:"
    );
    expect(plan.supportingSections).toEqual([]);
    expect(getWorkspaceSeedPackFiles).not.toHaveBeenCalled();
    expect(discoverRelevantOptionalSeedPackSections).not.toHaveBeenCalled();
  });

  it.each([
    "build a PR angle for my campaign",
    "make an ARG mystery trail campaign",
    "What should Bernays teach this campaign launch?",
    "Use Ogilvy research for this brand offer",
  ])(
    "queries optional campaign packs for relevant prompt: %s",
    async (prompt) => {
      const optionalPackFiles = new Map([
        [
          "cultural-protocols",
          new Set(["BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md"]),
        ],
        ["campaign-case-studies", new Set(["MASTER_MARKETERS_OVERVIEW.md"])],
      ]);
      const supportingSections = [
        {
          packId: "cultural-protocols",
          file: "BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
        },
      ];
      Document.where.mockResolvedValue([
        identityEmpireDoc(101, "IDENTITY_EMPIRE_INDEX.md"),
        identityEmpireDoc(101, "06_campaign_builder.md"),
      ]);
      getWorkspaceSeedPackFiles.mockResolvedValue(optionalPackFiles);
      discoverRelevantOptionalSeedPackSections.mockReturnValue(
        supportingSections
      );

      const plan = await buildIdentityEmpireRetrievalPlan({
        workspace: { id: 101, slug: "workspace-a" },
        prompt,
      });

      expect(getWorkspaceSeedPackFiles).toHaveBeenCalledWith(
        { id: 101, slug: "workspace-a" },
        ["cultural-protocols", "campaign-case-studies"]
      );
      expect(discoverRelevantOptionalSeedPackSections).toHaveBeenCalledWith({
        prompt,
        packFiles: optionalPackFiles,
      });
      expect(plan.supportingSections).toEqual(supportingSections);
    }
  );

  it.each([
    "private hidden identity project",
    "what is the target audience?",
    "privacy boundary for hidden identity",
    "How do I measure privacy risk in this project?",
    "How do I measure voltage from this document?",
    "Summarize public relations ethics from this textbook.",
    "Compare advertising copy examples in this document.",
    "Summarize launch notes from this technical changelog.",
  ])(
    "does not query optional campaign packs for unrelated prompt: %s",
    async (prompt) => {
      Document.where.mockResolvedValue([
        identityEmpireDoc(101, "IDENTITY_EMPIRE_INDEX.md"),
        identityEmpireDoc(101, "02_no_idea_user_intake.md"),
      ]);

      const plan = await buildIdentityEmpireRetrievalPlan({
        workspace: { id: 101, slug: "workspace-a" },
        prompt,
      });

      expect(plan.available).toBe(true);
      if (!isIdentityEmpirePrompt(prompt)) {
        expect(plan.retrievalInput).toBe(prompt);
      }
      expect(plan.supportingSections).toEqual([]);
      expect(getWorkspaceSeedPackFiles).not.toHaveBeenCalled();
      expect(discoverRelevantOptionalSeedPackSections).not.toHaveBeenCalled();
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

jest.mock("../../../models/documents", () => ({
  Document: {
    addDocuments: jest.fn(),
    forWorkspace: jest.fn(),
  },
}));

jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));

const { Document } = require("../../../models/documents");
const { CollectorApi } = require("../../../utils/collectorApi");
const {
  BANKSY_DEPTH_TREE_FILES,
  CAMPAIGN_CASE_STUDIES_FILES,
  CULTURAL_PROTOCOLS_FILES,
  IDENTITY_EMPIRE_FILES,
  SWARMSY_CORE_TRUTH_ARCHIVE_FILES,
  IDENTITY_FORGE_AND_CAMPAIGN_OS_FILES,
  COMMUNITY_AND_OPEN_BUILD_GOVERNANCE_FILES,
  SOURCE_CARD_AND_SUBJECT_GOVERNANCE_FILES,
  LOCAL_USER_SUPPORT_AND_TROUBLESHOOTING_ARCHIVE_FILES,
  PRODUCT_PLANNING_ARCHIVE_FILES,
  SWARMSY_APP_BRAIN_REFERENCE_ARCHIVE_FILES,
  OFFLINE_WIKI_LEDGER_STANDARDS_FILES,
  OPEN_CULTURAL_INTELLIGENCE_FILES,
  SWARMSY_PRODUCT_OPERATOR_DOCTRINE_FILES,
  SWARMSY_SUPPORT_AND_PROVIDER_HELP_FILES,
  WIKI_DEPTH_AND_PROVENANCE_FILES,
  discoverRelevantIdentityEmpireSections,
  discoverRelevantOptionalSeedPackSections,
  getSeedPackAbsoluteFilePath,
  getSparkyWikiSeedPack,
  importSparkyWikiSeedPack,
  isSafePackId,
  listSparkyWikiSeedPacks,
  parseSeedPackMetadata,
  validateSeedPackFiles,
  __resetSeedPackImportLocksForTests,
} = require("../../../utils/swarmsy/sparkyWikiSeedPacks");

describe("SPARKY Wiki seed pack registry", () => {
  let collector;

  beforeEach(() => {
    jest.clearAllMocks();
    __resetSeedPackImportLocksForTests();
    Document.forWorkspace.mockResolvedValue([]);
    Document.addDocuments.mockResolvedValue({
      failedToEmbed: [],
      errors: [],
      embedded: ["custom-documents/seed-pack.json"],
    });
    collector = {
      online: jest.fn().mockResolvedValue(true),
      forwardExtensionRequest: jest.fn().mockImplementation(({ body }) => ({
        success: true,
        documents: [
          {
            location: `custom-documents/${body.metadata.sparkyWikiSeedPackFile}.json`,
          },
        ],
      })),
    };
    CollectorApi.mockImplementation(() => collector);
  });

  it("lists the pre-installed SPARKY Wiki seed packs", () => {
    const packs = listSparkyWikiSeedPacks();

    expect(packs.map((pack) => pack.id)).toEqual([
      "identity-empire",
      "offline-wiki-ledger-standards",
      "cultural-protocols",
      "campaign-case-studies",
      "wiki-depth-and-provenance",
      "banksy-depth-tree",
      "open-cultural-intelligence",
      "swarmsy-product-operator-doctrine",
      "swarmsy-support-and-provider-help",
      "swarmsy-core-truth-archive",
      "identity-forge-and-campaign-os",
      "community-and-open-build-governance",
      "source-card-and-subject-governance",
      "local-user-support-and-troubleshooting-archive",
      "product-planning-archive",
      "swarmsy-app-brain-reference-archive",
    ]);
    expect(packs[0]).toMatchObject({
      id: "identity-empire",
      category: "identity empire seed pack",
      docsSpecOnly: true,
      sourcePath: "docs/swarmsy/sparky-wiki/seed-library/packs/identity-empire",
      importable: true,
    });
    expect(packs[0].includedFiles).toEqual([...IDENTITY_EMPIRE_FILES]);
    expect(packs[1]).toMatchObject({
      id: "offline-wiki-ledger-standards",
      category: "offline wiki ledger standards",
      draftImportable: true,
      importable: true,
    });
    expect(packs[2].includedFiles).toEqual([...CULTURAL_PROTOCOLS_FILES]);
    expect(packs[3].includedFiles).toEqual([...CAMPAIGN_CASE_STUDIES_FILES]);
    expect(packs[4].includedFiles).toEqual([
      ...WIKI_DEPTH_AND_PROVENANCE_FILES,
    ]);
    expect(packs[5]).toMatchObject({
      id: "banksy-depth-tree",
      category: "banksy depth tree",
      draftImportable: true,
      importable: true,
    });
    expect(packs[5].includedFiles).toEqual([...BANKSY_DEPTH_TREE_FILES]);
    expect(packs[6].includedFiles).toEqual([
      ...OPEN_CULTURAL_INTELLIGENCE_FILES,
    ]);
    expect(packs[7].includedFiles).toEqual([
      ...SWARMSY_PRODUCT_OPERATOR_DOCTRINE_FILES,
    ]);
    expect(packs[8].includedFiles).toEqual([
      ...SWARMSY_SUPPORT_AND_PROVIDER_HELP_FILES,
    ]);
    expect(packs[9]).toMatchObject({
      id: "swarmsy-core-truth-archive",
      category: "swarmsy core truth archive",
      draftImportable: true,
      importable: true,
    });
    expect(packs[9].includedFiles).toEqual([
      ...SWARMSY_CORE_TRUTH_ARCHIVE_FILES,
    ]);
    expect(packs[10].includedFiles).toEqual([
      ...IDENTITY_FORGE_AND_CAMPAIGN_OS_FILES,
    ]);
    expect(packs[11].includedFiles).toEqual([
      ...COMMUNITY_AND_OPEN_BUILD_GOVERNANCE_FILES,
    ]);
    expect(packs[12].includedFiles).toEqual([
      ...SOURCE_CARD_AND_SUBJECT_GOVERNANCE_FILES,
    ]);
    expect(packs[13].includedFiles).toEqual([
      ...LOCAL_USER_SUPPORT_AND_TROUBLESHOOTING_ARCHIVE_FILES,
    ]);
    expect(packs[14].includedFiles).toEqual([
      ...PRODUCT_PLANNING_ARCHIVE_FILES,
    ]);
    expect(packs[15].includedFiles).toEqual([
      ...SWARMSY_APP_BRAIN_REFERENCE_ARCHIVE_FILES,
    ]);
    expect(
      packs.every((pack) =>
        pack.safetyBoundaries.join(" ").includes("No autonomous")
      )
    ).toBe(true);
  });

  it.each([
    ["identity-empire", IDENTITY_EMPIRE_FILES, "identity empire seed pack"],
    [
      "offline-wiki-ledger-standards",
      OFFLINE_WIKI_LEDGER_STANDARDS_FILES,
      "offline wiki ledger standards",
    ],
    ["cultural-protocols", CULTURAL_PROTOCOLS_FILES, "cultural protocols"],
    [
      "campaign-case-studies",
      CAMPAIGN_CASE_STUDIES_FILES,
      "campaign case studies",
    ],
    [
      "wiki-depth-and-provenance",
      WIKI_DEPTH_AND_PROVENANCE_FILES,
      "wiki depth and provenance",
    ],
    ["banksy-depth-tree", BANKSY_DEPTH_TREE_FILES, "banksy depth tree"],
    [
      "open-cultural-intelligence",
      OPEN_CULTURAL_INTELLIGENCE_FILES,
      "open cultural intelligence",
    ],
    [
      "swarmsy-product-operator-doctrine",
      SWARMSY_PRODUCT_OPERATOR_DOCTRINE_FILES,
      "swarmsy product operator doctrine",
    ],
    [
      "swarmsy-support-and-provider-help",
      SWARMSY_SUPPORT_AND_PROVIDER_HELP_FILES,
      "swarmsy support and provider help",
    ],
    [
      "swarmsy-core-truth-archive",
      SWARMSY_CORE_TRUTH_ARCHIVE_FILES,
      "swarmsy core truth archive",
    ],
    [
      "identity-forge-and-campaign-os",
      IDENTITY_FORGE_AND_CAMPAIGN_OS_FILES,
      "identity forge and campaign os",
    ],
    [
      "community-and-open-build-governance",
      COMMUNITY_AND_OPEN_BUILD_GOVERNANCE_FILES,
      "community and open build governance",
    ],
    [
      "source-card-and-subject-governance",
      SOURCE_CARD_AND_SUBJECT_GOVERNANCE_FILES,
      "source card and subject governance",
    ],
    [
      "local-user-support-and-troubleshooting-archive",
      LOCAL_USER_SUPPORT_AND_TROUBLESHOOTING_ARCHIVE_FILES,
      "local user support and troubleshooting archive",
    ],
    [
      "product-planning-archive",
      PRODUCT_PLANNING_ARCHIVE_FILES,
      "product planning archive",
    ],
    [
      "swarmsy-app-brain-reference-archive",
      SWARMSY_APP_BRAIN_REFERENCE_ARCHIVE_FILES,
      "swarmsy app brain reference archive",
    ],
  ])(
    "validates every expected %s file and metadata without crawling the repo",
    (packId, expectedFiles, expectedCategory) => {
      const validation = validateSeedPackFiles(packId);

      expect(validation.valid).toBe(true);
      expect(validation.files).toHaveLength(expectedFiles.length);
      expect(validation.errors).toEqual([]);
      for (const file of validation.files) {
        expect(file.frontmatter.title).toBeTruthy();
        expect(file.frontmatter.category).toBe(expectedCategory);
        if (packId !== "identity-empire") {
          expect(file.frontmatter.optional_reference_knowledge).toBeTruthy();
          expect(file.frontmatter.runtime_override).toBe("never");
        }
        expect(file.path).toBe(
          `docs/swarmsy/sparky-wiki/seed-library/packs/${packId}/${file.file}`
        );
        expect(file.byteLength).toBeGreaterThan(250);
      }
    }
  );

  it("rejects unknown pack ids and unsafe path traversal ids", () => {
    expect(getSparkyWikiSeedPack("unknown-pack")).toBeNull();
    expect(isSafePackId("../identity-empire")).toBe(false);
    expect(getSparkyWikiSeedPack("../identity-empire")).toBeNull();
    expect(validateSeedPackFiles("../identity-empire")).toMatchObject({
      valid: false,
      errorCode: "UNKNOWN_PACK",
    });
    expect(
      getSeedPackAbsoluteFilePath(
        getSparkyWikiSeedPack("identity-empire"),
        "../secret.md"
      )
    ).toBeNull();
    expect(
      getSeedPackAbsoluteFilePath(
        getSparkyWikiSeedPack("cultural-protocols"),
        "../BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md"
      )
    ).toBeNull();
  });

  it("imports into one workspace, preserves metadata, and skips duplicate imports", async () => {
    const workspace = { id: 1, slug: "hive-a", name: "HIVE A" };

    const first = await importSparkyWikiSeedPack({
      workspace,
      packId: "identity-empire",
      userId: 12,
    });

    expect(first.success).toBe(true);
    expect(first.imported).toHaveLength(IDENTITY_EMPIRE_FILES.length);
    expect(collector.forwardExtensionRequest).toHaveBeenCalledTimes(
      IDENTITY_EMPIRE_FILES.length
    );
    expect(Document.addDocuments).toHaveBeenCalledTimes(
      IDENTITY_EMPIRE_FILES.length
    );
    expect(collector.forwardExtensionRequest.mock.calls[0][0]).toMatchObject({
      endpoint: "/process",
      method: "POST",
      body: {
        filename: "README.md",
        metadata: {
          docSource: "SPARKY Wiki seed pack: SPARKY Identity Empire",
          chunkSource: "sparky-wiki-seed-pack://identity-empire/README.md",
          sparkyWikiSeedPack: "identity-empire",
          localFirst: true,
          optionalReferenceKnowledge: true,
          autonomousRuntimeAgents: false,
        },
      },
    });

    Document.forWorkspace.mockResolvedValue(
      IDENTITY_EMPIRE_FILES.map((file) => ({
        workspaceId: 1,
        metadata: JSON.stringify({
          chunkSource: `sparky-wiki-seed-pack://identity-empire/${file}`,
        }),
      }))
    );
    collector.forwardExtensionRequest.mockClear();
    Document.addDocuments.mockClear();

    const second = await importSparkyWikiSeedPack({
      workspace,
      packId: "identity-empire",
      userId: 12,
    });

    expect(second.status).toBe("already_added");
    expect(second.imported).toEqual([]);
    expect(second.skipped).toHaveLength(IDENTITY_EMPIRE_FILES.length);
    expect(collector.forwardExtensionRequest).not.toHaveBeenCalled();
    expect(Document.addDocuments).not.toHaveBeenCalled();
  });

  it("keeps workspace A imports from bleeding into workspace B", async () => {
    const workspaceA = { id: 1, slug: "hive-a", name: "HIVE A" };
    const workspaceB = { id: 2, slug: "hive-b", name: "HIVE B" };

    Document.forWorkspace.mockImplementation(async (workspaceId) => {
      if (workspaceId === 1) {
        return IDENTITY_EMPIRE_FILES.map((file) => ({
          workspaceId,
          metadata: JSON.stringify({
            chunkSource: `sparky-wiki-seed-pack://identity-empire/${file}`,
          }),
        }));
      }
      return [];
    });

    const resultA = await importSparkyWikiSeedPack({
      workspace: workspaceA,
      packId: "identity-empire",
    });
    const resultB = await importSparkyWikiSeedPack({
      workspace: workspaceB,
      packId: "identity-empire",
    });

    expect(resultA.status).toBe("already_added");
    expect(resultB.status).toBe("added");
    expect(
      Document.addDocuments.mock.calls.every(
        ([workspace]) => workspace.id === 2
      )
    ).toBe(true);
  });

  it("rejects unsafe and unknown imports without collector or document writes", async () => {
    const workspace = { id: 1, slug: "hive-a", name: "HIVE A" };

    await expect(
      importSparkyWikiSeedPack({ workspace, packId: "../identity-empire" })
    ).resolves.toMatchObject({ success: false, errorCode: "UNSAFE_PACK_ID" });
    await expect(
      importSparkyWikiSeedPack({ workspace, packId: "unknown-pack" })
    ).resolves.toMatchObject({ success: false, errorCode: "UNKNOWN_PACK" });
    expect(collector.forwardExtensionRequest).not.toHaveBeenCalled();
    expect(Document.addDocuments).not.toHaveBeenCalled();
  });

  it("parses JSON metadata and keeps SOURCE_CARD_SCHEMA importable", () => {
    const validation = validateSeedPackFiles("offline-wiki-ledger-standards");
    const sourceCardSchema = validation.files.find(
      (file) => file.file === "SOURCE_CARD_SCHEMA.json"
    );

    expect(sourceCardSchema.frontmatter).toMatchObject({
      title: "Source Card Schema",
      category: "offline wiki ledger standards",
      runtime_override: "never",
    });
    expect(parseSeedPackMetadata("{}", "SOURCE_CARD_SCHEMA.json")).toBeNull();

    const banksyValidation = validateSeedPackFiles("banksy-depth-tree");
    const banksySourceCard = banksyValidation.files.find((file) =>
      file.file.startsWith("source-cards/")
    );
    expect(banksySourceCard.frontmatter).toMatchObject({
      category: "banksy depth tree",
      runtime_override: "never",
      optional_reference_knowledge: true,
    });
  });

  it("keeps seed pack docs optional, safe, and non-overriding", () => {
    const packs = listSparkyWikiSeedPacks();
    for (const pack of packs) {
      const validation = validateSeedPackFiles(pack.id);
      expect(validation.valid).toBe(true);
      for (const file of validation.files) {
        const raw = require("fs").readFileSync(file.absolutePath, "utf8");
        if (pack.id !== "identity-empire") {
          expect(raw).toMatch(
            /optional workspace reference knowledge|optional_reference_knowledge/i
          );
          expect(raw).toMatch(/does not override|runtime_override/i);
        } else {
          expect(file.frontmatter.status_label).toBe("Docs/spec only");
        }
        if (pack.id !== "identity-empire") {
          expect(raw).toMatch(
            /lawful|safety boundary|risk\/ethics|safe|permission/i
          );
        }
        if (
          /step-by-step criminal execution|direct evasion playbooks|instructions to harm people/i.test(
            raw
          )
        ) {
          expect(raw).toMatch(
            /must not operationalize|must not provide|not allowed|not operational playbooks|no step-by-step/i
          );
        }
        expect(raw).not.toMatch(
          /here is how to trespass|evade police by|damage property by|police\/council avoidance tactics:/i
        );
        if (pack.id === "banksy-depth-tree") {
          expect(raw).toMatch(/public evidence|disputed|myth\/lore|source/i);
        }
        if (pack.id === "swarmsy-product-operator-doctrine") {
          expect(raw).toMatch(/Docs\/spec|docs_spec_only|not runtime wiring/i);
        }
        if (pack.id === "swarmsy-support-and-provider-help") {
          expect(raw).toMatch(/Use API|local-first|provider|current app/i);
        }
      }
    }
  });

  it("records the old SWARMSY import audit and manifest without direct enhanced-copy imports", () => {
    const fs = require("fs");
    const path = require("path");
    const repoRoot = path.resolve(__dirname, "../../../..");
    const auditPath = path.join(
      repoRoot,
      "docs/swarmsy/audits/OLD_SWARMSY_WIKI_IMPORT_AUDIT.md"
    );
    const manifestPath = path.join(
      repoRoot,
      "docs/swarmsy/sparky-wiki/seed-library/OLD_SWARMSY_IMPORT_MANIFEST.json"
    );
    const audit = fs.readFileSync(auditPath, "utf8");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    expect(audit).toMatch(
      /\|\s*old_path\s*\|\s*decision\s*\|\s*new_path\s*\|\s*reason\s*\|\s*risk_label\s*\|\s*notes\s*\|/
    );
    expect(manifest.source_repo).toBe("HODLKONG64/SWARMSY");
    expect(manifest.imported_files.length).toBeGreaterThan(150);
    expect(manifest.skipped_files.length).toBeGreaterThan(400);
    expect(manifest.manual_review_files.length).toBeGreaterThan(0);
    expect(manifest.packs_added.map((pack) => pack.id)).toEqual([
      "swarmsy-core-truth-archive",
      "identity-forge-and-campaign-os",
      "community-and-open-build-governance",
      "source-card-and-subject-governance",
      "local-user-support-and-troubleshooting-archive",
      "product-planning-archive",
      "swarmsy-app-brain-reference-archive",
    ]);
    expect(
      manifest.imported_files.some((file) =>
        file.old_path.includes("repo_enhanced_copies")
      )
    ).toBe(false);
  });

  it("keeps all registered seed pack paths local, current-workspace scoped, and free of forbidden local paths", () => {
    const fs = require("fs");
    const forbiddenPathPattern =
      /C:\\Users|Users\\GOD|swarmsy-APP|OPENAI_API_KEY\s*=\s*[^\s]+|ANTHROPIC_API_KEY\s*=\s*[^\s]+|GITHUB_TOKEN\s*=\s*[^\s]+/i;
    const staleCurrentGuidancePattern =
      /npm install|npm run|npm test|npm run start|npm run web|npm run android|npm run ios|npm run typecheck|npm run check:current-truth|npm run check:brand-canon|npm run stress:sandbox|npm test -- --watch=false|scripts\/system-sync-stress-sandbox\.mjs|desktop:build:web|desktop:build:win|Graffiti Kings app|GRAFFITI-KINGS-APP|HODLKONG64\/current DIZ\/SWARMSY workspace/i;
    const brokenDemoGuideLinkPattern =
      /\[[^\]]*docs\/DEMO_DATA_GUIDE\.md[^\]]*\]\((?:\.\/)?DEMO_DATA_GUIDE\.md\)/i;

    for (const pack of listSparkyWikiSeedPacks()) {
      expect(pack.sourcePath).not.toMatch(/repo_enhanced_copies|\.\./);
      if (pack.id.includes("archive") || pack.id.includes("governance")) {
        expect(pack.draftImportable).toBe(true);
      }
      const validation = validateSeedPackFiles(pack.id);
      expect(validation.valid).toBe(true);
      for (const file of validation.files) {
        expect(
          file.frontmatter.workspace_scope || "current workspace only"
        ).toBe("current workspace only");
        expect(file.frontmatter.runtime_override || "never").toBe("never");
        expect(file.path).not.toMatch(/repo_enhanced_copies|\.\./);
        const raw = fs.readFileSync(file.absolutePath, "utf8");
        expect(raw).not.toMatch(forbiddenPathPattern);
        expect(raw).not.toMatch(staleCurrentGuidancePattern);
        expect(raw).not.toMatch(brokenDemoGuideLinkPattern);
        if (pack.id !== "identity-empire") {
          expect(raw).toMatch(/does not override|runtime_override/i);
        }
      }
    }
  });

  describe("optional campaign/protocol matching", () => {
    const allOptionalPackFiles = () =>
      new Map([
        ["cultural-protocols", new Set(CULTURAL_PROTOCOLS_FILES)],
        ["campaign-case-studies", new Set(CAMPAIGN_CASE_STUDIES_FILES)],
      ]);

    const matchedSectionIds = (prompt) =>
      discoverRelevantOptionalSeedPackSections({
        prompt,
        packFiles: allOptionalPackFiles(),
      }).map((section) => `${section.packId}/${section.file}`);

    it("discovers relevant optional campaign and protocol support sections", () => {
      const sections = matchedSectionIds(
        "Build a lawful scarcity drop and public signal campaign with Nike-style identity compression."
      );

      expect(sections).toEqual(
        expect.arrayContaining([
          "cultural-protocols/SUPREME_DROP_SCARCITY_PROTOCOL.md",
          "cultural-protocols/BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
          "cultural-protocols/NIKE_IDENTITY_COMPRESSION_PROTOCOL.md",
          "campaign-case-studies/SUPREME_DROP_CULTURE.md",
          "campaign-case-studies/NIKE_JUST_DO_IT.md",
        ])
      );
    });

    it("matches bounded PR campaign prompts", () => {
      expect(matchedSectionIds("build a PR angle for my campaign")).toEqual(
        expect.arrayContaining([
          "cultural-protocols/BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
          "campaign-case-studies/MASTER_MARKETERS_OVERVIEW.md",
        ])
      );
    });

    it("matches bounded ARG mystery trail campaign prompts", () => {
      expect(matchedSectionIds("make an ARG mystery trail campaign")).toEqual(
        expect.arrayContaining([
          "cultural-protocols/BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
          "campaign-case-studies/MASTER_MARKETERS_OVERVIEW.md",
        ])
      );
    });

    it.each([
      ["advertising copy", ["campaign-case-studies/OGILVY.md"]],
      [
        "public relations ethics",
        [
          "cultural-protocols/BERNAYS_PUBLIC_OPINION_PROTOCOL.md",
          "campaign-case-studies/EDWARD_BERNAYS.md",
        ],
      ],
      ["positioning strategy", ["campaign-case-studies/OGILVY.md"]],
      [
        "propaganda analysis",
        [
          "cultural-protocols/BERNAYS_PUBLIC_OPINION_PROTOCOL.md",
          "campaign-case-studies/EDWARD_BERNAYS.md",
        ],
      ],
      [
        "What should Bernays teach this launch?",
        ["campaign-case-studies/EDWARD_BERNAYS.md"],
      ],
      [
        "Use Ogilvy research for this offer",
        ["campaign-case-studies/OGILVY.md"],
      ],
    ])("matches downstream optional discovery term: %s", (prompt, expected) => {
      expect(matchedSectionIds(prompt)).toEqual(
        expect.arrayContaining(expected)
      );
    });

    it.each([
      "private hidden identity project",
      "what is the target audience?",
      "privacy boundary for hidden identity",
    ])("does not match optional packs from substring noise: %s", (prompt) => {
      expect(matchedSectionIds(prompt)).toEqual([]);
    });
  });

  it("discovers relevant Identity Empire sections for identity-building prompts", () => {
    const files = discoverRelevantIdentityEmpireSections({
      prompt:
        "Build my identity empire from nothing with a 30-day launch plan, PR angle, slogan bank, lawful physical visibility plan, and Signal measurement.",
      mode: "Face Identity Mode",
    }).map((item) => item.file);

    expect(files).toEqual(
      expect.arrayContaining([
        "IDENTITY_EMPIRE_INDEX.md",
        "01_identity_operating_system.md",
        "02_no_idea_user_intake.md",
        "03_brand_foundation_builder.md",
        "07_pr_and_press_machine.md",
        "08_social_content_engine.md",
        "09_physical_visibility_safe_playbook.md",
        "13_30_day_identity_empire_launch.md",
        "16_measurement_signal_and_next_moves.md",
      ])
    );
  });
});

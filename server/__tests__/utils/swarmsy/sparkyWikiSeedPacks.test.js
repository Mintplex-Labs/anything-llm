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
  IDENTITY_EMPIRE_FILES,
  discoverRelevantIdentityEmpireSections,
  getSeedPackAbsoluteFilePath,
  getSparkyWikiSeedPack,
  importSparkyWikiSeedPack,
  isSafePackId,
  listSparkyWikiSeedPacks,
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

  it("lists exactly the pre-installed Identity Empire pack", () => {
    const packs = listSparkyWikiSeedPacks();

    expect(packs).toHaveLength(1);
    expect(packs[0]).toMatchObject({
      id: "identity-empire",
      category: "identity empire seed pack",
      docsSpecOnly: true,
      sourcePath: "docs/swarmsy/sparky-wiki/seed-library/packs/identity-empire",
      importable: true,
    });
    expect(packs[0].includedFiles).toEqual([...IDENTITY_EMPIRE_FILES]);
    expect(packs[0].safetyBoundaries.join(" ")).toContain("No autonomous");
  });

  it("validates every expected file and frontmatter without crawling the repo", () => {
    const validation = validateSeedPackFiles("identity-empire");

    expect(validation.valid).toBe(true);
    expect(validation.files).toHaveLength(IDENTITY_EMPIRE_FILES.length);
    expect(validation.errors).toEqual([]);
    for (const file of validation.files) {
      expect(file.frontmatter.title).toBeTruthy();
      expect(file.frontmatter.category).toBe("identity empire seed pack");
      expect(file.path).toBe(
        `docs/swarmsy/sparky-wiki/seed-library/packs/identity-empire/${file.file}`
      );
      expect(file.byteLength).toBeGreaterThan(250);
    }
  });

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

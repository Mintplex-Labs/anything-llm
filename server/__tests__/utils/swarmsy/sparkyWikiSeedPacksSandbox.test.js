jest.mock("../../../models/documents", () => ({
  Document: {
    addDocuments: jest.fn(),
    forWorkspace: jest.fn(),
  },
}));

jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));

const fs = require("fs");
const path = require("path");
const { Document } = require("../../../models/documents");
const { CollectorApi } = require("../../../utils/collectorApi");
const {
  IDENTITY_EMPIRE_FILES,
  discoverRelevantIdentityEmpireSections,
  importSparkyWikiSeedPack,
  listSparkyWikiSeedPacks,
  validateSeedPackFiles,
  __resetSeedPackImportLocksForTests,
} = require("../../../utils/swarmsy/sparkyWikiSeedPacks");

describe("SPARKY Wiki seed pack sandbox stress test", () => {
  let collector;
  let workspaceDocs;

  beforeEach(() => {
    jest.clearAllMocks();
    __resetSeedPackImportLocksForTests();
    workspaceDocs = new Map();
    collector = {
      online: jest.fn().mockResolvedValue(true),
      forwardExtensionRequest: jest
        .fn()
        .mockImplementation(async ({ body }) => {
          if (global.fetch) expect(global.fetch).not.toHaveBeenCalled();
          return {
            success: true,
            documents: [
              {
                location: `custom-documents/sparky-wiki/${body.metadata.sparkyWikiSeedPack}/${body.metadata.sparkyWikiSeedPackFile}.json`,
              },
            ],
          };
        }),
    };
    CollectorApi.mockImplementation(() => collector);
    Document.forWorkspace.mockImplementation(
      async (workspaceId) => workspaceDocs.get(workspaceId) || []
    );
    Document.addDocuments.mockImplementation(async (workspace, locations) => {
      const docs = workspaceDocs.get(workspace.id) || [];
      for (const location of locations) {
        const file = path.basename(location, ".json");
        docs.push({
          workspaceId: workspace.id,
          docpath: location,
          metadata: JSON.stringify({
            chunkSource: `sparky-wiki-seed-pack://identity-empire/${file}`,
          }),
        });
      }
      workspaceDocs.set(workspace.id, docs);
      return { failedToEmbed: [], errors: [], embedded: locations };
    });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("exercises the full local registry/import flow without workspace bleed or hosted mutation", async () => {
    const packs = listSparkyWikiSeedPacks();
    expect(packs.map((pack) => pack.id)).toEqual(["identity-empire"]);

    const validation = validateSeedPackFiles("identity-empire");
    expect(validation.valid).toBe(true);
    expect(validation.files.map((file) => file.file)).toEqual([
      ...IDENTITY_EMPIRE_FILES,
    ]);
    expect(validation.files.every((file) => file.frontmatter.title)).toBe(true);
    expect(validation.files.every((file) => file.frontmatter.category)).toBe(
      true
    );

    const workspaceA = { id: 101, slug: "workspace-a", name: "Workspace A" };
    const workspaceB = { id: 202, slug: "workspace-b", name: "Workspace B" };

    await expect(
      importSparkyWikiSeedPack({ workspace: workspaceA, packId: "unknown" })
    ).resolves.toMatchObject({ success: false, errorCode: "UNKNOWN_PACK" });
    await expect(
      importSparkyWikiSeedPack({
        workspace: workspaceA,
        packId: "../identity-empire",
      })
    ).resolves.toMatchObject({ success: false, errorCode: "UNSAFE_PACK_ID" });

    const importA = await importSparkyWikiSeedPack({
      workspace: workspaceA,
      packId: "identity-empire",
      userId: null,
    });
    expect(importA.success).toBe(true);
    expect(importA.imported).toHaveLength(IDENTITY_EMPIRE_FILES.length);
    expect(importA.workspace).toMatchObject({ id: 101, slug: "workspace-a" });

    const repeatA = await importSparkyWikiSeedPack({
      workspace: workspaceA,
      packId: "identity-empire",
      userId: null,
    });
    expect(repeatA.status).toBe("already_added");
    expect(repeatA.imported).toEqual([]);
    expect(workspaceDocs.get(101)).toHaveLength(IDENTITY_EMPIRE_FILES.length);
    expect(workspaceDocs.get(202)).toBeUndefined();

    const importB = await importSparkyWikiSeedPack({
      workspace: workspaceB,
      packId: "identity-empire",
      userId: null,
    });
    expect(importB.success).toBe(true);
    expect(workspaceDocs.get(101)).toHaveLength(IDENTITY_EMPIRE_FILES.length);
    expect(workspaceDocs.get(202)).toHaveLength(IDENTITY_EMPIRE_FILES.length);

    expect(
      Document.addDocuments.mock.calls.every(([workspace]) =>
        [101, 202].includes(workspace.id)
      )
    ).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();

    const sections = discoverRelevantIdentityEmpireSections({
      prompt:
        "Build my identity empire from nothing. Build my PR angle and lawful physical visibility plan.",
      mode: "Hidden Identity Mode",
    });
    expect(sections.map((section) => section.file)).toEqual(
      expect.arrayContaining([
        "02_no_idea_user_intake.md",
        "04_story_myth_and_manifesto.md",
        "07_pr_and_press_machine.md",
        "09_physical_visibility_safe_playbook.md",
      ])
    );

    const onboardingSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );
    const hubSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../../frontend/src/components/SwarmsyLocalUserSettingsHub/index.jsx"
      ),
      "utf8"
    );
    const handoffSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../../frontend/src/components/SwarmsyFirstRunOnboarding/handoff.js"
      ),
      "utf8"
    );
    expect(onboardingSource).toContain("getLocalUserOllamaRuntimeSelection");
    expect(handoffSource).toContain('provider: "ollama"');
    expect(hubSource).toContain("local-first reference knowledge");
    expect(hubSource).not.toMatch(
      /illegal fly-posting|vandalism instructions|trespass guidance|evasion tactics|police\/council avoidance/i
    );
    expect(JSON.stringify(Document.addDocuments.mock.calls)).not.toMatch(
      /backup|hosted|admin|global/i
    );
  });
});

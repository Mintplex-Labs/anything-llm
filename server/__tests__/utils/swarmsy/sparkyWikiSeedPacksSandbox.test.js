jest.mock("../../../models/documents", () => ({
  Document: {
    addDocuments: jest.fn(),
    forWorkspace: jest.fn(),
    where: jest.fn(),
  },
}));

jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { Document } = require("../../../models/documents");
const { CollectorApi } = require("../../../utils/collectorApi");
const {
  CAMPAIGN_CASE_STUDIES_FILES,
  CULTURAL_PROTOCOLS_FILES,
  IDENTITY_EMPIRE_FILES,
  discoverRelevantIdentityEmpireSections,
  importSparkyWikiSeedPack,
  listSparkyWikiSeedPacks,
  validateSeedPackFiles,
  __resetSeedPackImportLocksForTests,
} = require("../../../utils/swarmsy/sparkyWikiSeedPacks");
const {
  buildIdentityEmpireRetrievalPlan,
} = require("../../../utils/swarmsy/identityEmpireRetrieval");

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
  const script = new vm.Script(`${source}
module.exports = { getIntakeStarterMessage };`);
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

function loadFrontendMemoryLockModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../../frontend/src/components/SwarmsyFirstRunOnboarding/memoryLock.js"
      ),
      "utf8"
    )
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");
  const script = new vm.Script(`${source}
module.exports = { buildMemoryLockStarterMessage };`);
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

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
    Document.where.mockImplementation(async (clause) => {
      const docs = workspaceDocs.get(clause.workspaceId) || [];
      return docs.map(({ metadata }) => ({ metadata }));
    });
    Document.addDocuments.mockImplementation(async (workspace, locations) => {
      const docs = workspaceDocs.get(workspace.id) || [];
      for (const location of locations) {
        const file = path.basename(location, ".json");
        const packId = path.basename(path.dirname(location));
        docs.push({
          workspaceId: workspace.id,
          docpath: location,
          metadata: JSON.stringify({
            chunkSource: `sparky-wiki-seed-pack://${packId}/${file}`,
            sparkyWikiSeedPack: packId,
            sparkyWikiSeedPackFile: file,
            localFirst: true,
            optionalReferenceKnowledge: true,
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
    ]);

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
    const protocolImportA = await importSparkyWikiSeedPack({
      workspace: workspaceA,
      packId: "cultural-protocols",
      userId: null,
    });
    const caseStudyImportA = await importSparkyWikiSeedPack({
      workspace: workspaceA,
      packId: "campaign-case-studies",
      userId: null,
    });
    expect(importA.success).toBe(true);
    expect(protocolImportA.success).toBe(true);
    expect(caseStudyImportA.success).toBe(true);
    expect(importA.imported).toHaveLength(IDENTITY_EMPIRE_FILES.length);
    expect(protocolImportA.imported).toHaveLength(
      CULTURAL_PROTOCOLS_FILES.length
    );
    expect(caseStudyImportA.imported).toHaveLength(
      CAMPAIGN_CASE_STUDIES_FILES.length
    );
    expect(importA.workspace).toMatchObject({ id: 101, slug: "workspace-a" });

    const repeatA = await importSparkyWikiSeedPack({
      workspace: workspaceA,
      packId: "identity-empire",
      userId: null,
    });
    expect(repeatA.status).toBe("already_added");
    expect(repeatA.imported).toEqual([]);
    expect(workspaceDocs.get(101)).toHaveLength(
      IDENTITY_EMPIRE_FILES.length +
        CULTURAL_PROTOCOLS_FILES.length +
        CAMPAIGN_CASE_STUDIES_FILES.length
    );
    expect(workspaceDocs.get(202)).toBeUndefined();

    const importB = await importSparkyWikiSeedPack({
      workspace: workspaceB,
      packId: "identity-empire",
      userId: null,
    });
    expect(importB.success).toBe(true);
    expect(workspaceDocs.get(101)).toHaveLength(
      IDENTITY_EMPIRE_FILES.length +
        CULTURAL_PROTOCOLS_FILES.length +
        CAMPAIGN_CASE_STUDIES_FILES.length
    );
    expect(workspaceDocs.get(202)).toHaveLength(IDENTITY_EMPIRE_FILES.length);

    expect(
      Document.addDocuments.mock.calls.every(([workspace]) =>
        [101, 202].includes(workspace.id)
      )
    ).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();

    const workspaceARetrievalPlan = await buildIdentityEmpireRetrievalPlan({
      workspace: workspaceA,
      prompt:
        "Build my identity empire from nothing. Create a 30-day lawful public signal campaign strategy with scarcity drop mechanics, Nike-style identity compression, and a PR angle.",
    });
    expect(workspaceARetrievalPlan.status).toBe("Using local wiki knowledge");
    expect(workspaceARetrievalPlan.retrievalInput).toContain(
      "IDENTITY_EMPIRE_INDEX.md"
    );
    expect(workspaceARetrievalPlan.retrievalInput).toContain(
      "13_30_day_identity_empire_launch.md"
    );
    expect(workspaceARetrievalPlan.retrievalInput).toContain(
      "07_pr_and_press_machine.md"
    );
    expect(workspaceARetrievalPlan.supportingSections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          packId: "cultural-protocols",
          file: "BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
        }),
        expect.objectContaining({
          packId: "cultural-protocols",
          file: "SUPREME_DROP_SCARCITY_PROTOCOL.md",
        }),
        expect.objectContaining({
          packId: "campaign-case-studies",
          file: "NIKE_JUST_DO_IT.md",
        }),
      ])
    );
    expect(workspaceARetrievalPlan.retrievalInput).toContain(
      "Optional campaign/protocol supporting context"
    );
    expect(workspaceARetrievalPlan.retrievalInput).toContain(
      "cultural-protocols/BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md"
    );
    expect(workspaceARetrievalPlan.retrievalInput).toContain(
      "campaign-case-studies/NIKE_JUST_DO_IT.md"
    );

    const emptyWorkspaceB = {
      id: 303,
      slug: "workspace-b-empty",
      name: "Workspace B Empty",
    };
    const workspaceBRetrievalPlan = await buildIdentityEmpireRetrievalPlan({
      workspace: emptyWorkspaceB,
      prompt: "Build my identity empire from nothing.",
    });
    expect(workspaceBRetrievalPlan.status).toBe(
      "No Identity Empire knowledge added yet"
    );
    expect(workspaceBRetrievalPlan.retrievalInput).toBe(
      "Build my identity empire from nothing."
    );
    expect(workspaceBRetrievalPlan.supportingSections).toBeUndefined();
    expect(Document.where).toHaveBeenCalledWith(
      { workspaceId: workspaceA.id },
      null,
      null,
      null,
      { metadata: true }
    );

    const { getIntakeStarterMessage } = loadFrontendHandoffModule();
    const { buildMemoryLockStarterMessage } = loadFrontendMemoryLockModule();

    const scenarioAHiddenPrompt = getIntakeStarterMessage("hidden", {
      identityEmpireAvailable: true,
    });
    const scenarioARetrievalPlan = await buildIdentityEmpireRetrievalPlan({
      workspace: workspaceA,
      prompt: scenarioAHiddenPrompt,
    });
    expect(scenarioAHiddenPrompt).toContain("Hidden Identity Mode");
    expect(scenarioAHiddenPrompt).toContain("hidden-identity safety");
    expect(scenarioAHiddenPrompt).toContain("supporting local context only");
    expect(scenarioAHiddenPrompt).toContain(
      "Do not use web/API unless Use API is explicitly enabled"
    );
    expect(scenarioAHiddenPrompt).toContain("Use Ollama/local-first");
    expect(scenarioARetrievalPlan.status).toBe("Using local wiki knowledge");
    expect(scenarioARetrievalPlan.retrievalInput).toContain(
      "Hidden Identity Mode"
    );
    expect(scenarioARetrievalPlan.retrievalInput).toContain("alias, pseudonym");

    const scenarioBFacePrompt = getIntakeStarterMessage("face", {
      identityEmpireAvailable: false,
    });
    const scenarioBRetrievalPlan = await buildIdentityEmpireRetrievalPlan({
      workspace: emptyWorkspaceB,
      prompt: scenarioBFacePrompt,
    });
    expect(scenarioBFacePrompt).toContain("Face Identity Mode");
    expect(scenarioBFacePrompt).toContain(
      "No Identity Empire knowledge added yet"
    );
    expect(scenarioBFacePrompt).toContain("without blocking on a pack picker");
    expect(scenarioBRetrievalPlan.status).toBe(
      "No Identity Empire knowledge added yet"
    );
    expect(scenarioBRetrievalPlan.retrievalInput).toBe(scenarioBFacePrompt);

    const scenarioCMemoryPrompt = buildMemoryLockStarterMessage("MEMORY LOCK", {
      identityEmpireAvailable: true,
    });
    const scenarioCRetrievalPlan = await buildIdentityEmpireRetrievalPlan({
      workspace: workspaceA,
      prompt: scenarioCMemoryPrompt,
    });
    expect(scenarioCMemoryPrompt).toContain(
      "combine memory lock + current workspace memory + workspace docs"
    );
    expect(scenarioCMemoryPrompt).toContain(
      "Do not overwrite Memory Lock or existing identity/template structure unless I explicitly confirm"
    );
    expect(scenarioCRetrievalPlan.retrievalInput).toContain("Load Memory Lock");
    expect(scenarioCRetrievalPlan.retrievalInput).toContain(
      "without overwriting existing user identity unless confirmed"
    );

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
    for (const docs of workspaceDocs.values()) {
      for (const doc of docs) {
        expect(doc.metadata).toContain('"optionalReferenceKnowledge":true');
        expect(doc.metadata).not.toMatch(
          /autonomousRuntimeAgents":true|webCrawler":true|apiRequired":true/i
        );
      }
    }
    expect(JSON.stringify(Document.addDocuments.mock.calls)).not.toMatch(
      /backup|hosted|admin|global/i
    );
  });
});

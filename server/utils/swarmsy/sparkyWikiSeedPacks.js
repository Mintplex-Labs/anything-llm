const fs = require("fs");
const path = require("path");
const { CollectorApi } = require("../collectorApi");
const { Document } = require("../../models/documents");

const REPO_ROOT = path.resolve(__dirname, "../../..");
const SEED_PACK_SOURCE_ROOT = "docs/swarmsy/sparky-wiki/seed-library/packs";
const IDENTITY_EMPIRE_SOURCE_PATH = `${SEED_PACK_SOURCE_ROOT}/identity-empire`;
const IDENTITY_EMPIRE_FILES = Object.freeze([
  "README.md",
  "IDENTITY_EMPIRE_INDEX.md",
  "01_identity_operating_system.md",
  "02_no_idea_user_intake.md",
  "03_brand_foundation_builder.md",
  "04_story_myth_and_manifesto.md",
  "05_offer_and_product_ladder.md",
  "06_campaign_builder.md",
  "07_pr_and_press_machine.md",
  "08_social_content_engine.md",
  "09_physical_visibility_safe_playbook.md",
  "10_digital_wall_distribution.md",
  "11_swarm_coordination_model.md",
  "12_agent_department_model.md",
  "13_30_day_identity_empire_launch.md",
  "14_local_business_visibility_system.md",
  "15_artist_creator_visibility_system.md",
  "16_measurement_signal_and_next_moves.md",
  "17_sparky_prompt_recipes.md",
  "18_identity_empire_templates.md",
]);

const SAFETY_BOUNDARIES = Object.freeze([
  "Local-first reference knowledge only; not required doctrine.",
  "No autonomous runtime agents are created by importing this pack.",
  "Use lawful, permission-based physical visibility only.",
  "No vandalism, trespass, evasion, harassment, threats, or fake claims.",
  "API/web lookup stays optional and only for explicitly requested live research.",
]);

const PACKS = Object.freeze([
  Object.freeze({
    id: "identity-empire",
    title: "SPARKY Identity Empire",
    shortDescription:
      "Book-grade local wiki pack for building identity, story, brand, offers, campaigns, PR angles, slogans, content systems, lawful visibility, launch plans, measurement, and next moves from zero signal.",
    category: "identity empire seed pack",
    status: "docs/spec-only source, importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: IDENTITY_EMPIRE_SOURCE_PATH,
    includedFiles: IDENTITY_EMPIRE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach to the current SWARMSY workspace so Sparky can automatically retrieve deep local playbooks during Face Identity Mode, Hidden Identity Mode, Existing Project rebuilds, Memory Lock continuations, and direct identity-building prompts.",
    importable: true,
  }),
]);

const seedPackImportLocks = new Map();

function clonePack(pack) {
  if (!pack) return null;
  return {
    ...pack,
    includedFiles: [...pack.includedFiles],
    safetyBoundaries: [...pack.safetyBoundaries],
  };
}

function listSparkyWikiSeedPacks() {
  return PACKS.map(clonePack);
}

function isSafePackId(packId = "") {
  return /^[a-z0-9][a-z0-9-]*$/.test(String(packId || ""));
}

function getSparkyWikiSeedPack(packId = "") {
  if (!isSafePackId(packId)) return null;
  return clonePack(PACKS.find((pack) => pack.id === packId));
}

function getSeedPackRelativeFilePath(pack, fileName) {
  if (!pack?.includedFiles?.includes(fileName)) return null;
  const relativePath = path.posix.join(pack.sourcePath, fileName);
  if (!relativePath.startsWith(`${pack.sourcePath}/`)) return null;
  return relativePath;
}

function getSeedPackAbsoluteFilePath(pack, fileName) {
  const relativePath = getSeedPackRelativeFilePath(pack, fileName);
  if (!relativePath) return null;

  const absolutePath = path.resolve(REPO_ROOT, relativePath);
  const sourceRoot = path.resolve(REPO_ROOT, pack.sourcePath);
  const relativeToSource = path.relative(sourceRoot, absolutePath);
  if (
    relativeToSource.startsWith("..") ||
    path.isAbsolute(relativeToSource) ||
    relativeToSource.includes(path.sep + ".." + path.sep)
  ) {
    return null;
  }
  return absolutePath;
}

function parseMarkdownFrontmatter(raw = "") {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return null;

  const fields = {};
  const frontmatter = raw.slice(4, end).split(/\r?\n/);
  for (const line of frontmatter) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    fields[match[1]] = match[2].replace(/^['"]|['"]$/g, "").trim();
  }
  return fields;
}

function validateSeedPackFiles(packId = "") {
  const pack = getSparkyWikiSeedPack(packId);
  if (!pack) {
    return {
      valid: false,
      errorCode: "UNKNOWN_PACK",
      message: "Unknown SPARKY Wiki seed pack.",
      files: [],
    };
  }

  const files = [];
  const errors = [];
  for (const fileName of pack.includedFiles) {
    const absolutePath = getSeedPackAbsoluteFilePath(pack, fileName);
    const relativePath = getSeedPackRelativeFilePath(pack, fileName);
    if (!absolutePath || !relativePath) {
      errors.push({ file: fileName, error: "unsafe_path" });
      continue;
    }

    if (!fs.existsSync(absolutePath)) {
      errors.push({ file: fileName, error: "missing" });
      continue;
    }

    const raw = fs.readFileSync(absolutePath, "utf8");
    const frontmatter = parseMarkdownFrontmatter(raw);
    if (!frontmatter?.title || !frontmatter?.category) {
      errors.push({ file: fileName, error: "missing_frontmatter" });
      continue;
    }

    files.push({
      file: fileName,
      path: relativePath,
      absolutePath,
      frontmatter,
      byteLength: Buffer.byteLength(raw),
    });
  }

  return {
    valid: errors.length === 0,
    errorCode: errors.length ? "INVALID_PACK_FILES" : null,
    message: errors.length
      ? "One or more SPARKY Wiki seed pack files failed validation."
      : "SPARKY Wiki seed pack files are valid.",
    pack,
    files,
    errors,
  };
}

function getWorkspaceSummary(workspace = null) {
  if (!workspace) return null;
  return {
    exists: true,
    id: workspace.id,
    slug: workspace.slug,
    name: workspace.name,
  };
}

function safeParseMetadata(metadata) {
  try {
    return JSON.parse(metadata || "null");
  } catch {
    return null;
  }
}

function getExistingChunkSources(existingDocs = []) {
  const existingChunkSources = new Set();
  for (const existingDoc of existingDocs) {
    const metadata = safeParseMetadata(existingDoc.metadata);
    if (metadata?.chunkSource)
      existingChunkSources.add(String(metadata.chunkSource));
  }
  return existingChunkSources;
}

function getPackLockKey(workspace, packId) {
  if (workspace?.id != null) return `${workspace.id}:${packId}`;
  return `${workspace?.slug || "unknown"}:${packId}`;
}

async function withSeedPackImportLock(workspace, packId, run) {
  const lockKey = getPackLockKey(workspace, packId);
  const previousLock = seedPackImportLocks.get(lockKey) || Promise.resolve();
  let releaseCurrentLock;
  const currentLock = new Promise((resolve) => {
    releaseCurrentLock = resolve;
  });
  const lockChain = previousLock.then(() => currentLock);
  seedPackImportLocks.set(lockKey, lockChain);

  await previousLock;
  try {
    return await run();
  } finally {
    releaseCurrentLock();
    if (seedPackImportLocks.get(lockKey) === lockChain) {
      seedPackImportLocks.delete(lockKey);
    }
  }
}

async function importSparkyWikiSeedPack({
  workspace,
  packId,
  userId = null,
} = {}) {
  if (!workspace) {
    throw new Error("Workspace is required for SPARKY Wiki seed pack import.");
  }
  if (!isSafePackId(packId)) {
    return {
      success: false,
      errorCode: "UNSAFE_PACK_ID",
      message: "SPARKY Wiki seed pack id is not valid.",
    };
  }

  const validation = validateSeedPackFiles(packId);
  if (!validation.valid) {
    return {
      success: false,
      errorCode: validation.errorCode,
      message: validation.message,
      pack: validation.pack || null,
      files: validation.files || [],
      errors: validation.errors || [],
    };
  }

  const pack = validation.pack;
  if (!pack.importable) {
    return {
      success: false,
      errorCode: "PACK_NOT_IMPORTABLE",
      message: "This SPARKY Wiki seed pack is not importable yet.",
      pack,
    };
  }

  return await withSeedPackImportLock(workspace, pack.id, async () => {
    const collector = new CollectorApi();
    const collectorOnline = await collector.online();
    if (!collectorOnline) {
      return {
        success: false,
        errorCode: "COLLECTOR_OFFLINE",
        message: "Document processing API is not online.",
        pack,
      };
    }

    const existingDocs = await Document.forWorkspace(workspace.id);
    const existingChunkSources = getExistingChunkSources(existingDocs);
    const imported = [];
    const skipped = [];
    const failed = [];

    for (const file of validation.files) {
      const chunkSource = `sparky-wiki-seed-pack://${pack.id}/${file.file}`;
      if (existingChunkSources.has(chunkSource)) {
        skipped.push({
          path: file.path,
          reason: "already_attached",
          error: null,
        });
        continue;
      }

      const {
        success,
        reason,
        documents = [],
      } = await collector.forwardExtensionRequest({
        endpoint: "/process",
        method: "POST",
        body: {
          filename: file.file,
          options: { absolutePath: file.absolutePath },
          metadata: {
            ...file.frontmatter,
            title: file.frontmatter.title || file.file,
            docSource: `SPARKY Wiki seed pack: ${pack.title}`,
            description: `${pack.shortDescription} Source: ${file.path}`,
            chunkSource,
            sparkyWikiSeedPack: pack.id,
            sparkyWikiSeedPackTitle: pack.title,
            sparkyWikiSeedPackFile: file.file,
            sparkyWikiSeedPackSourcePath: pack.sourcePath,
            localFirst: true,
            optionalReferenceKnowledge: true,
            autonomousRuntimeAgents: false,
          },
        },
      });

      if (!success || documents.length === 0 || !documents[0]?.location) {
        failed.push({
          path: file.path,
          stage: "collect",
          error:
            reason ||
            "Collector did not return an ingestible document location.",
        });
        continue;
      }

      const {
        failedToEmbed = [],
        errors = [],
        embedded = [],
      } = await Document.addDocuments(
        workspace,
        [documents[0].location],
        userId
      );

      if (failedToEmbed.length > 0 || embedded.length === 0) {
        failed.push({
          path: file.path,
          stage: "embed",
          error:
            errors[0] ||
            "Document.addDocuments failed for this seed pack file.",
        });
        continue;
      }

      imported.push({ path: file.path });
      existingChunkSources.add(chunkSource);
    }

    const partial = failed.length > 0;
    const alreadyAttachedCount = skipped.filter(
      (item) => item.reason === "already_attached"
    ).length;
    const allAlreadyAttached =
      imported.length === 0 && alreadyAttachedCount === validation.files.length;

    return {
      success: true,
      workspace: getWorkspaceSummary(workspace),
      pack,
      imported,
      skipped,
      failed,
      partial,
      status: allAlreadyAttached
        ? "already_added"
        : partial
          ? "partial"
          : "added",
      message: allAlreadyAttached
        ? "SPARKY Identity Empire knowledge is already attached to this workspace."
        : partial
          ? "SPARKY Wiki seed pack import completed with partial failures."
          : "SPARKY Identity Empire knowledge added to this workspace.",
    };
  });
}

function discoverRelevantIdentityEmpireSections({
  prompt = "",
  mode = "",
} = {}) {
  const text = `${prompt} ${mode}`.toLowerCase();
  const matches = new Set(["IDENTITY_EMPIRE_INDEX.md"]);

  const addWhen = (needles, files) => {
    if (needles.some((needle) => text.includes(needle))) {
      files.forEach((file) => matches.add(file));
    }
  };

  addWhen(
    ["from nothing", "no idea", "identity", "intake"],
    [
      "01_identity_operating_system.md",
      "02_no_idea_user_intake.md",
      "18_identity_empire_templates.md",
    ]
  );
  addWhen(
    ["hidden", "alias", "pseudonym", "privacy"],
    ["02_no_idea_user_intake.md", "04_story_myth_and_manifesto.md"]
  );
  addWhen(
    ["face", "founder", "public"],
    ["03_brand_foundation_builder.md", "04_story_myth_and_manifesto.md"]
  );
  addWhen(
    ["existing", "audit", "rebuild", "relaunch"],
    [
      "03_brand_foundation_builder.md",
      "06_campaign_builder.md",
      "13_30_day_identity_empire_launch.md",
    ]
  );
  addWhen(["brand", "messy idea"], ["03_brand_foundation_builder.md"]);
  addWhen(
    ["offer", "product", "service", "ladder"],
    ["05_offer_and_product_ladder.md"]
  );
  addWhen(["campaign", "stickup"], ["06_campaign_builder.md"]);
  addWhen(["pr", "press", "ghost"], ["07_pr_and_press_machine.md"]);
  addWhen(
    ["slogan", "social", "content"],
    ["08_social_content_engine.md", "17_sparky_prompt_recipes.md"]
  );
  addWhen(
    ["physical", "visibility", "wall", "flyer", "lawful"],
    [
      "09_physical_visibility_safe_playbook.md",
      "10_digital_wall_distribution.md",
    ]
  );
  addWhen(["swarm", "coordinate"], ["11_swarm_coordination_model.md"]);
  addWhen(
    ["30-day", "30 day", "launch"],
    ["13_30_day_identity_empire_launch.md"]
  );
  addWhen(
    ["measure", "signal", "next"],
    ["16_measurement_signal_and_next_moves.md"]
  );

  return [...matches].map((file) => ({
    packId: "identity-empire",
    file,
    path: `${IDENTITY_EMPIRE_SOURCE_PATH}/${file}`,
  }));
}

function __resetSeedPackImportLocksForTests() {
  seedPackImportLocks.clear();
}

module.exports = {
  IDENTITY_EMPIRE_FILES,
  REPO_ROOT,
  discoverRelevantIdentityEmpireSections,
  getSeedPackAbsoluteFilePath,
  getSeedPackRelativeFilePath,
  getSparkyWikiSeedPack,
  importSparkyWikiSeedPack,
  isSafePackId,
  listSparkyWikiSeedPacks,
  parseMarkdownFrontmatter,
  validateSeedPackFiles,
  __resetSeedPackImportLocksForTests,
};

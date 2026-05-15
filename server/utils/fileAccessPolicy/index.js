const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { SystemSettings } = require("../../models/systemSettings");
const { EventLogs } = require("../../models/eventLogs");
const { safeJsonParse } = require("../http");
const { documentsPath, directUploadsPath } = require("../files");

const MODES = {
  sandbox: "sandbox",
  authorized: "authorized",
  open: "open",
};

const SETTING_KEYS = {
  defaultMode: "file_access_default_mode",
  authorizedDirectories: "file_access_authorized_directories",
  openBlacklist: "file_access_open_blacklist",
};

const DENIAL_REASONS = {
  pathNotAllowed: "path_not_allowed",
  blacklistedPath: "blacklisted_path",
  terminalNotAllowed: "terminal_not_allowed",
  writeNotAllowed: "write_not_allowed",
  pathNotFound: "path_not_found",
  symlinkEscape: "symlink_escape",
  approvalRequired: "approval_required",
  approvalDenied: "approval_denied",
};

const DEFAULT_OPEN_BLACKLIST = [
  {
    id: "builtin-dot-ssh",
    pattern: ".ssh",
    type: "segment",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-dot-env",
    pattern: ".env*",
    type: "glob",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-dot-git",
    pattern: ".git",
    type: "segment",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-node-modules",
    pattern: "node_modules",
    type: "segment",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-system",
    path: "/System",
    type: "path",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-library",
    path: "/Library",
    type: "path",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-applications",
    path: "/Applications",
    type: "path",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-private",
    path: "/private",
    type: "path",
    enabled: true,
    source: "builtin",
  },
  {
    id: "builtin-volumes-tm",
    path: "/Volumes/.timemachine",
    type: "path",
    enabled: true,
    source: "builtin",
  },
];

function expandHome(inputPath = "") {
  const value = String(inputPath || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

function normalizeMode(mode = MODES.sandbox) {
  const value = String(mode || "").toLowerCase();
  return Object.values(MODES).includes(value) ? value : MODES.sandbox;
}

function isInsideOrEqual(root = "", target = "") {
  if (!root || !target) return false;
  const relative = path.relative(root, target);
  return (
    relative === "" ||
    (!!relative && !relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

function resolvePath(inputPath = "", baseDir = null) {
  if (
    typeof inputPath !== "string" ||
    !inputPath.trim() ||
    inputPath.includes("\x00")
  )
    return null;
  const expanded = expandHome(inputPath);
  return path.resolve(baseDir || process.cwd(), expanded);
}

function realpathIfExists(targetPath = "") {
  try {
    if (!targetPath || !fs.existsSync(targetPath)) return null;
    return fs.realpathSync(targetPath);
  } catch {
    return null;
  }
}

function ensureDirPath(targetPath = "") {
  const resolved = resolvePath(targetPath);
  if (!resolved) return null;
  return realpathIfExists(resolved) || resolved;
}

function storagePath(folder) {
  const storageRoot =
    process.env.STORAGE_DIR || path.resolve(__dirname, "../../storage");
  return path.join(storageRoot, folder);
}

function sandboxDirectories() {
  return [
    documentsPath,
    directUploadsPath,
    storagePath("anythingllm-fs"),
    storagePath("generated-files"),
  ].map((dir) => ({
    id: `sandbox-${path.basename(dir)}`,
    label: path.basename(dir),
    path: dir,
    resolvedPath: ensureDirPath(dir),
    read: true,
    write: true,
    enabled: true,
    source: "sandbox",
  }));
}

function builtinAuthorizedDirectories() {
  return ["Desktop", "Documents", "Downloads"].map((folder) => {
    const dirPath = path.join(os.homedir(), folder);
    return {
      id: `builtin-${folder.toLowerCase()}`,
      label: folder,
      path: `~/${folder}`,
      resolvedPath: ensureDirPath(dirPath),
      read: true,
      write: false,
      enabled: true,
      source: "builtin",
    };
  });
}

function normalizeDirectoryRule(rule = {}, fallbackUserId = null) {
  if (!rule || typeof rule !== "object") return null;
  const rawPath = String(rule.path || "").trim();
  if (!rawPath) return null;
  const resolvedPath = ensureDirPath(rawPath);
  return {
    id: rule.id || uuidv4(),
    label: String(rule.label || path.basename(expandHome(rawPath)) || rawPath),
    path: rawPath,
    resolvedPath,
    read: rule.read !== false,
    write: rule.write === true,
    enabled: rule.enabled !== false,
    source: rule.source || "admin",
    createdAt: rule.createdAt || new Date().toISOString(),
    createdBy: rule.createdBy ?? fallbackUserId ?? null,
  };
}

function normalizeBlacklistRule(rule = {}, index = 0) {
  if (!rule || typeof rule !== "object") return null;
  const pattern = rule.pattern ? String(rule.pattern).trim() : null;
  const rawPath = rule.path ? String(rule.path).trim() : null;
  if (!pattern && !rawPath) return null;
  return {
    id: rule.id || `blacklist-${index}`,
    label: rule.label || pattern || rawPath,
    pattern,
    path: rawPath,
    resolvedPath: rawPath ? ensureDirPath(rawPath) : null,
    type: rule.type || (rawPath ? "path" : "segment"),
    enabled: rule.enabled !== false,
    source: rule.source || "admin",
  };
}

async function getJsonSetting(label, fallback) {
  const value = await SystemSettings.getValueOrFallback(
    { label },
    JSON.stringify(fallback)
  );
  return safeJsonParse(value, fallback);
}

async function getGlobalPolicy() {
  const defaultMode = normalizeMode(
    await SystemSettings.getValueOrFallback(
      { label: SETTING_KEYS.defaultMode },
      MODES.sandbox
    )
  );
  const adminDirs = (
    await getJsonSetting(SETTING_KEYS.authorizedDirectories, [])
  )
    .map((rule) => normalizeDirectoryRule(rule))
    .filter(Boolean);
  const customBlacklist = (await getJsonSetting(SETTING_KEYS.openBlacklist, []))
    .map((rule, index) => normalizeBlacklistRule(rule, index))
    .filter(Boolean);

  return {
    defaultMode,
    authorizedDirectories: adminDirs,
    openBlacklist: [
      ...DEFAULT_OPEN_BLACKLIST.map((rule, index) =>
        normalizeBlacklistRule(rule, index)
      ).filter(Boolean),
      ...customBlacklist,
    ],
  };
}

async function setGlobalPolicy(updates = {}, user = null) {
  const payload = {};
  if (updates.defaultMode)
    payload[SETTING_KEYS.defaultMode] = normalizeMode(updates.defaultMode);
  if (Array.isArray(updates.authorizedDirectories)) {
    payload[SETTING_KEYS.authorizedDirectories] = JSON.stringify(
      updates.authorizedDirectories
        .map((rule) => normalizeDirectoryRule(rule, user?.id))
        .filter(Boolean)
    );
  }
  if (Array.isArray(updates.openBlacklist)) {
    payload[SETTING_KEYS.openBlacklist] = JSON.stringify(
      updates.openBlacklist
        .map((rule, index) => normalizeBlacklistRule(rule, index))
        .filter((rule) => rule && rule.source !== "builtin")
    );
  }

  const result = await SystemSettings._updateSettings(payload);
  if (result.success) {
    await auditLog("file_access_global_policy_updated", {
      user,
      mode: payload[SETTING_KEYS.defaultMode] || null,
      metadata: {
        updatedKeys: Object.keys(payload),
      },
    });
  }
  return result;
}

async function resolveEffectivePolicy(context = {}) {
  const globalPolicy = context.globalPolicy || (await getGlobalPolicy());
  const mode = normalizeMode(context.sessionMode || globalPolicy.defaultMode);
  return {
    ...globalPolicy,
    mode,
    sandboxDirectories: sandboxDirectories().filter(
      (dir) => dir.enabled && dir.resolvedPath
    ),
    authorizedDirectories: [
      ...builtinAuthorizedDirectories(),
      ...globalPolicy.authorizedDirectories,
    ].filter((dir) => dir.enabled && dir.resolvedPath),
    context,
  };
}

function globMatch(value = "", pattern = "") {
  const escaped = String(pattern)
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(value);
}

function pathSegments(targetPath = "") {
  return String(targetPath || "")
    .split(path.sep)
    .filter(Boolean);
}

function matchedBlacklist(targetPath = "", policy = {}) {
  const realOrResolved = targetPath;
  const basename = path.basename(realOrResolved);
  const segments = pathSegments(realOrResolved);
  for (const rule of policy.openBlacklist || []) {
    if (!rule?.enabled) continue;
    if (
      rule.type === "path" &&
      rule.resolvedPath &&
      isInsideOrEqual(rule.resolvedPath, realOrResolved)
    )
      return rule;
    if (
      rule.type === "glob" &&
      (globMatch(basename, rule.pattern) ||
        segments.some((segment) => globMatch(segment, rule.pattern)))
    )
      return rule;
    if (
      (rule.type === "segment" || !rule.type) &&
      segments.includes(rule.pattern)
    )
      return rule;
  }
  return null;
}

function directoriesForMode(policy = {}, operation = "read") {
  const sandbox = policy.sandboxDirectories || [];
  if (policy.mode === MODES.sandbox)
    return sandbox.filter((dir) => dir[operation] === true);
  if (policy.mode === MODES.authorized) {
    const authorized = policy.authorizedDirectories || [];
    return [...sandbox, ...authorized].filter(
      (dir) => dir.read === true && (operation === "read" || dir.write === true)
    );
  }
  return null;
}

async function validatePathForOperation(
  inputPath = "",
  context = {},
  operation = "read"
) {
  const policy = await resolveEffectivePolicy(context);
  const requested = resolvePath(inputPath);
  if (!requested)
    return denial(DENIAL_REASONS.pathNotAllowed, "Path is empty or invalid.", {
      mode: policy.mode,
    });

  const exists = fs.existsSync(requested);
  const realRequested = exists ? realpathIfExists(requested) : null;
  const target = realRequested || requested;

  const blacklistRule = matchedBlacklist(target, policy);
  if (blacklistRule)
    return denial(
      DENIAL_REASONS.blacklistedPath,
      `Path is blocked by file access rule: ${blacklistRule.label || blacklistRule.id}`,
      {
        mode: policy.mode,
        path: target,
        matchedRule: blacklistRule.id,
      }
    );

  if (policy.mode === MODES.open) {
    if (operation === "read" && !exists)
      return denial(DENIAL_REASONS.pathNotFound, "Path does not exist.", {
        mode: policy.mode,
        path: requested,
      });
    return allowed(target, policy.mode, null);
  }

  const dirs = directoriesForMode(policy, operation) || [];
  const matchedRule = dirs.find((dir) =>
    isInsideOrEqual(dir.resolvedPath, target)
  );
  if (!matchedRule) {
    const reason =
      operation === "write" && policy.mode === MODES.authorized
        ? DENIAL_REASONS.writeNotAllowed
        : DENIAL_REASONS.pathNotAllowed;
    return denial(reason, explainDenial(reason), {
      mode: policy.mode,
      path: target,
    });
  }

  if (
    exists &&
    realRequested &&
    !isInsideOrEqual(matchedRule.resolvedPath, realRequested)
  ) {
    return denial(
      DENIAL_REASONS.symlinkEscape,
      "Symlink target escapes the allowed directory.",
      {
        mode: policy.mode,
        path: realRequested,
        matchedRule: matchedRule.id,
      }
    );
  }

  if (operation === "read" && !exists)
    return denial(DENIAL_REASONS.pathNotFound, "Path does not exist.", {
      mode: policy.mode,
      path: requested,
      matchedRule: matchedRule.id,
    });

  return allowed(target, policy.mode, matchedRule.id);
}

function allowed(pathValue, mode, matchedRule) {
  return {
    allowed: true,
    path: pathValue,
    mode,
    matchedRule,
    reason: null,
    message: null,
  };
}

function denial(reason, message, extra = {}) {
  return {
    allowed: false,
    path: extra.path || null,
    mode: extra.mode || MODES.sandbox,
    matchedRule: extra.matchedRule || null,
    reason,
    message,
  };
}

async function validateReadPath(inputPath, context = {}) {
  const result = await validatePathForOperation(inputPath, context, "read");
  if (!result.allowed)
    await auditPath(
      "file_access_path_denied",
      inputPath,
      result,
      context,
      "read"
    );
  return result;
}

async function validateWritePath(inputPath, context = {}) {
  const result = await validatePathForOperation(inputPath, context, "write");
  if (!result.allowed)
    await auditPath(
      "file_access_path_denied",
      inputPath,
      result,
      context,
      "write"
    );
  return result;
}

async function canUseTerminal(context = {}) {
  const policy = await resolveEffectivePolicy(context);
  return {
    allowed: policy.mode === MODES.open,
    mode: policy.mode,
    reason:
      policy.mode === MODES.open ? null : DENIAL_REASONS.terminalNotAllowed,
    message:
      policy.mode === MODES.open
        ? null
        : explainDenial(DENIAL_REASONS.terminalNotAllowed),
  };
}

function explainDenial(reason) {
  switch (reason) {
    case DENIAL_REASONS.pathNotAllowed:
      return "Path is outside the current file access mode's allowed directories.";
    case DENIAL_REASONS.blacklistedPath:
      return "Path is blocked by a sensitive-path blacklist rule.";
    case DENIAL_REASONS.terminalNotAllowed:
      return "Terminal and shell execution are only allowed in Open file access mode.";
    case DENIAL_REASONS.writeNotAllowed:
      return "Write access is not allowed for this path in the current file access mode.";
    case DENIAL_REASONS.pathNotFound:
      return "Path does not exist or cannot be resolved by the current process.";
    case DENIAL_REASONS.symlinkEscape:
      return "Path resolves through a symlink outside an allowed directory.";
    case DENIAL_REASONS.approvalRequired:
      return "User approval is required before this operation can run.";
    case DENIAL_REASONS.approvalDenied:
      return "The user rejected or did not approve this operation.";
    default:
      return "File access was denied.";
  }
}

async function getAllowedDirectories(context = {}, operation = "read") {
  const policy = await resolveEffectivePolicy(context);
  if (policy.mode === MODES.open)
    return [
      { path: "/", resolvedPath: "/", read: true, write: true, source: "open" },
    ];
  return directoriesForMode(policy, operation) || [];
}

async function auditLog(
  event,
  {
    user = null,
    workspace = null,
    thread = null,
    mode = null,
    tool = null,
    path: pathValue = null,
    root = null,
    reason = null,
    allowed = null,
    matchedRule = null,
    metadata = {},
  } = {}
) {
  return EventLogs.logEvent(
    event,
    {
      workspaceId: workspace?.id || workspace?.workspace_id || null,
      threadId: thread?.id || thread?.thread_id || null,
      mode,
      tool,
      path: pathValue,
      root,
      reason,
      allowed,
      matchedRule,
      ...metadata,
    },
    user?.id || user || null
  );
}

async function auditPath(
  event,
  requestedPath,
  result,
  context = {},
  operation = "read"
) {
  const invocation = context.invocation || {};
  return auditLog(event, {
    user: context.user || invocation.user_id || null,
    workspace: context.workspace || invocation.workspace || invocation,
    thread: context.thread || invocation,
    mode: result.mode,
    tool: context.tool || null,
    path: requestedPath,
    reason: result.reason,
    allowed: result.allowed,
    matchedRule: result.matchedRule,
    metadata: { operation },
  });
}

function commandHash(command = "") {
  return crypto.createHash("sha256").update(String(command)).digest("hex");
}

module.exports = {
  MODES,
  SETTING_KEYS,
  DENIAL_REASONS,
  expandHome,
  resolvePath,
  isInsideOrEqual,
  getGlobalPolicy,
  setGlobalPolicy,
  resolveEffectivePolicy,
  validateReadPath,
  validateWritePath,
  canUseTerminal,
  explainDenial,
  getAllowedDirectories,
  auditLog,
  commandHash,
};

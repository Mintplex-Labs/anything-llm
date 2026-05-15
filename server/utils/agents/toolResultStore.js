const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const MAX_MODEL_TOOL_RESULT_CHARS = 12_000;
const MAX_TOOL_OUTPUT_PREVIEW_CHARS = 500;
const MAX_AGENT_EVENT_CHARS = 500;
const TOOL_RUN_RETENTION_DAYS = 7;
const TOOL_RUN_MAX_COUNT = 1_000;
const TOOL_RUN_MAX_BYTES = 1024 * 1024 * 1024;

function storageRoot() {
  return process.env.STORAGE_DIR || path.resolve(__dirname, "../../storage");
}

function toolRunsRoot() {
  return path.join(storageRoot(), "tool-runs");
}

function todayFolder() {
  return new Date().toISOString().slice(0, 10);
}

function safeStringify(value) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function parseMaybeJson(value) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function truncate(value = "", maxChars = MAX_TOOL_OUTPUT_PREVIEW_CHARS) {
  const text = String(value || "");
  if (text.length <= maxChars) return { text, truncated: false };
  return { text: text.slice(0, maxChars), truncated: true };
}

function resultSize(value) {
  return Buffer.byteLength(safeStringify(value), "utf8");
}

function outputFromResult(result) {
  const parsed = parseMaybeJson(result);
  if (parsed && typeof parsed === "object") {
    return (
      parsed.output ??
      parsed.stdout ??
      parsed.stderr ??
      parsed.error ??
      parsed.message ??
      parsed.summary ??
      ""
    );
  }
  return parsed;
}

function countFor(value, key) {
  return Array.isArray(value?.[key]) ? value[key].length : value?.[key];
}

function summarizeToolResult({ toolName, result }) {
  const parsed = parseMaybeJson(result);
  const output = outputFromResult(parsed);
  const preview = truncate(output, MAX_TOOL_OUTPUT_PREVIEW_CHARS);
  const size = resultSize(result);
  const summaryParts = [];

  if (parsed && typeof parsed === "object") {
    if (parsed.success === false) summaryParts.push("Tool returned an error.");
    else if (parsed.success === true) summaryParts.push("Tool completed.");

    if (parsed.reason) summaryParts.push(`Reason: ${parsed.reason}.`);
    if (parsed.error)
      summaryParts.push(`Error: ${String(parsed.error).slice(0, 160)}.`);
    const importedCount = countFor(parsed, "importedFiles");
    const scannedCount = countFor(parsed, "scannedFiles");
    const skippedCount = countFor(parsed, "skippedFiles");
    const fileCount = countFor(parsed, "files") ?? parsed.fileCount;
    const excludedCount = parsed.excludedCount;
    if (Number.isFinite(Number(importedCount)))
      summaryParts.push(`Imported ${importedCount} file(s).`);
    if (Number.isFinite(Number(scannedCount)))
      summaryParts.push(`Scanned ${scannedCount} file(s).`);
    if (Number.isFinite(Number(fileCount)))
      summaryParts.push(`Matched ${fileCount} file(s).`);
    if (Number.isFinite(Number(skippedCount)))
      summaryParts.push(`Skipped ${skippedCount} file(s).`);
    if (Number.isFinite(Number(excludedCount)))
      summaryParts.push(`Excluded ${excludedCount} file(s).`);
    if (parsed.exitCode !== undefined)
      summaryParts.push(`Exit code ${parsed.exitCode}.`);
    if (parsed.timedOut) summaryParts.push("Command timed out.");
  }

  const fallback = preview.text
    ? `${toolName || "Tool"} result: ${preview.text}`
    : `${toolName || "Tool"} returned a result.`;

  return {
    summary: summaryParts.join(" ") || truncate(fallback, 240).text,
    outputPreview: preview.text,
    resultSize: size,
    truncated: preview.truncated || size > MAX_MODEL_TOOL_RESULT_CHARS,
    exitCode: parsed?.exitCode,
    timedOut: parsed?.timedOut,
    root: parsed?.root || parsed?.rootPath,
    fileCount:
      parsed?.fileCount ??
      countFor(parsed, "files") ??
      countFor(parsed, "importedFiles"),
    excludedCount: parsed?.excludedCount ?? countFor(parsed, "skippedFiles"),
    totalSize: parsed?.totalSize ?? parsed?.estimatedBytes,
  };
}

function runDirectory(runId) {
  return path.join(toolRunsRoot(), todayFolder(), runId);
}

function collectRunDirs() {
  const root = toolRunsRoot();
  if (!fs.existsSync(root)) return [];
  const dirs = [];
  for (const day of fs.readdirSync(root)) {
    const dayPath = path.join(root, day);
    if (!fs.existsSync(dayPath) || !fs.lstatSync(dayPath).isDirectory())
      continue;
    for (const runId of fs.readdirSync(dayPath)) {
      const runPath = path.join(dayPath, runId);
      if (!fs.existsSync(runPath) || !fs.lstatSync(runPath).isDirectory())
        continue;
      const stats = fs.statSync(runPath);
      const resultPath = path.join(runPath, "result.json");
      const size = fs.existsSync(resultPath) ? fs.statSync(resultPath).size : 0;
      dirs.push({ path: runPath, mtimeMs: stats.mtimeMs, size });
    }
  }
  return dirs.sort((a, b) => a.mtimeMs - b.mtimeMs);
}

function removeDirQuietly(dirPath) {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
  } catch (error) {
    console.warn(`[tool-runs] Failed to remove ${dirPath}: ${error.message}`);
  }
}

function cleanupToolRuns() {
  try {
    const cutoff = Date.now() - TOOL_RUN_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    let dirs = collectRunDirs();
    for (const dir of dirs) {
      if (dir.mtimeMs < cutoff) removeDirQuietly(dir.path);
    }

    dirs = collectRunDirs();
    let totalSize = dirs.reduce((sum, dir) => sum + dir.size, 0);
    while (dirs.length > TOOL_RUN_MAX_COUNT || totalSize > TOOL_RUN_MAX_BYTES) {
      const dir = dirs.shift();
      if (!dir) break;
      totalSize -= dir.size;
      removeDirQuietly(dir.path);
    }
  } catch (error) {
    console.warn(`[tool-runs] Cleanup failed: ${error.message}`);
  }
}

async function storeToolRun({ toolName, arguments: args, result }) {
  const runId = uuidv4();
  const summary = summarizeToolResult({ toolName, result });
  const record = {
    runId,
    toolName,
    arguments: args,
    result,
    resultSha256: crypto
      .createHash("sha256")
      .update(safeStringify(result))
      .digest("hex"),
    createdAt: new Date().toISOString(),
  };

  try {
    const dir = runDirectory(runId);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "result.json"),
      safeStringify(record),
      "utf8"
    );
    cleanupToolRuns();
    return { ...summary, runId, stored: true, storageError: null };
  } catch (error) {
    console.warn(`[tool-runs] Failed to store tool run: ${error.message}`);
    return {
      ...summary,
      runId,
      stored: false,
      storageError: "write_failed",
    };
  }
}

function prepareToolResultForModel(result, storedRun = null) {
  const text = safeStringify(result);
  if (text.length <= MAX_MODEL_TOOL_RESULT_CHARS) return text;

  const suffix = storedRun?.stored
    ? `\n\n[Tool result truncated: full result stored as runId=${storedRun.runId}]`
    : "\n\n[Tool result truncated: full result omitted because local tool-run storage failed]";
  return `${text.slice(0, MAX_MODEL_TOOL_RESULT_CHARS)}${suffix}`;
}

function sanitizeAgentEvent(event = {}) {
  if (!event || typeof event !== "object") return event;
  const sanitized = {
    id: event.id,
    uuid: event.uuid,
    createdAt: event.createdAt,
    type: event.type,
    toolName: event.toolName,
    skillName: event.skillName,
    requestId: event.requestId,
    approved: event.approved,
    reason: event.reason,
    status: event.status,
    runId: event.runId,
    stored: event.stored,
    storageError: event.storageError,
    resultSize: event.resultSize,
    truncated: event.truncated,
    exitCode: event.exitCode,
    timedOut: event.timedOut,
    root: event.root,
    fileCount: event.fileCount,
    excludedCount: event.excludedCount,
    totalSize: event.totalSize,
  };

  const content = truncate(
    event.summary || event.content || event.outputPreview || "",
    MAX_AGENT_EVENT_CHARS
  ).text;
  if (content) sanitized.content = content;

  if (event.payload && event.type === "approval_request") {
    sanitized.payload = sanitizePayload(event.payload);
  }

  return Object.fromEntries(
    Object.entries(sanitized).filter(([, value]) => value !== undefined)
  );
}

function sanitizePayload(payload = {}) {
  if (!payload || typeof payload !== "object") return payload;
  const allowedKeys = [
    "command",
    "cwd",
    "mode",
    "risk",
    "root",
    "estimatedFiles",
    "scannedFiles",
    "excludedCount",
    "estimatedBytes",
    "fileTypes",
    "glob",
    "excludedByReason",
  ];
  const next = {};
  for (const key of allowedKeys) {
    if (payload[key] === undefined) continue;
    next[key] =
      typeof payload[key] === "string"
        ? truncate(payload[key], MAX_AGENT_EVENT_CHARS).text
        : payload[key];
  }
  return next;
}

module.exports = {
  MAX_MODEL_TOOL_RESULT_CHARS,
  MAX_TOOL_OUTPUT_PREVIEW_CHARS,
  storeToolRun,
  prepareToolResultForModel,
  sanitizeAgentEvent,
  summarizeToolResult,
};

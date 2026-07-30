const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { LOGS_DIR, AGENT_NAME } = require("../config");

// ─── State ─────────────────────────────────────────────────────────────────

let _sessionId = null;      // UUID for the current conversation
let _sessionStart = null;   // ISO timestamp when session was created
let _messageCount = 0;      // messages written this session

// ─── Session lifecycle ─────────────────────────────────────────────────────

/**
 * Creates a new session ID.  Called lazily on the first chat_message and
 * explicitly on POST /api/v1/new-session (to close the old one first).
 */
function startSession() {
  _sessionId = uuidv4();
  _sessionStart = new Date().toISOString();
  _messageCount = 0;

  _appendIndex({
    event: "session_start",
    id: _sessionId,
    agent: AGENT_NAME,
    started_at: _sessionStart,
  });

  return _sessionId;
}

/**
 * Marks the current session as closed in the index.  Should be called before
 * starting a new session so the index records a clean end timestamp.
 */
function endSession({ exitCode } = {}) {
  if (!_sessionId) return;
  _appendIndex({
    event: "session_end",
    id: _sessionId,
    ended_at: new Date().toISOString(),
    messages: _messageCount,
    exit_code: exitCode ?? null,
  });
  _sessionId = null;
  _sessionStart = null;
  _messageCount = 0;
}

/**
 * Returns info about the active session, or null if none exists yet.
 */
function currentSession() {
  if (!_sessionId) return null;
  return { id: _sessionId, started_at: _sessionStart, messages: _messageCount };
}

// ─── Message logging ───────────────────────────────────────────────────────

/**
 * Appends a chat message (user or assistant) to the current session's JSONL
 * file, creating the session lazily if this is the first message.
 */
function logChatMessage({ role, content }) {
  if (!_sessionId) startSession();
  _messageCount++;

  const entry = {
    ts: new Date().toISOString(),
    session_id: _sessionId,
    agent: AGENT_NAME,
    role,
    content: String(content || "").slice(0, 32_000),
  };

  _appendChatFile(_sessionId, entry);
}

// ─── Query helpers ─────────────────────────────────────────────────────────

/**
 * Reads the sessions index and returns the most recent `limit` sessions
 * (start events only, enriched with their matching end event if available).
 */
function listSessions(limit = 50) {
  const indexFile = _indexPath();
  if (!fs.existsSync(indexFile)) return [];

  const lines = fs
    .readFileSync(indexFile, "utf8")
    .split("\n")
    .filter(Boolean);

  // Parse all index entries
  const starts = {};
  const ends = {};
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.event === "session_start") starts[entry.id] = entry;
      if (entry.event === "session_end") ends[entry.id] = entry;
    } catch {}
  }

  return Object.values(starts)
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      agent: s.agent,
      started_at: s.started_at,
      ended_at: ends[s.id]?.ended_at ?? null,
      messages: ends[s.id]?.messages ?? null,
      exit_code: ends[s.id]?.exit_code ?? null,
      active: s.id === _sessionId,
    }));
}

/**
 * Returns all messages for a given session ID, in order.
 */
function getSessionMessages(sessionId) {
  const chatFile = _chatFilePath(sessionId);
  if (!fs.existsSync(chatFile)) return [];

  return fs
    .readFileSync(chatFile, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// ─── File helpers ──────────────────────────────────────────────────────────

function _ensureLogsDir() {
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  } catch {}
}

function _indexPath() {
  return path.join(LOGS_DIR, `sessions-${AGENT_NAME}.jsonl`);
}

function _chatFilePath(sessionId) {
  return path.join(LOGS_DIR, `chat-${AGENT_NAME}-${sessionId}.jsonl`);
}

function _appendIndex(entry) {
  _ensureLogsDir();
  try {
    fs.appendFileSync(_indexPath(), JSON.stringify(entry) + "\n");
  } catch {}
}

function _appendChatFile(sessionId, entry) {
  _ensureLogsDir();
  try {
    fs.appendFileSync(_chatFilePath(sessionId), JSON.stringify(entry) + "\n");
  } catch {}
}

module.exports = {
  startSession,
  endSession,
  currentSession,
  logChatMessage,
  listSessions,
  getSessionMessages,
};
